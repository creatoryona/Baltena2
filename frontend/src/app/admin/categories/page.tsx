"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadProductImage,
} from "@/lib/admin-api"
import { getFullImageUrl } from "@/lib/image-url"
import type { Category } from "@/lib/types"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState("")

  // Form State
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [image, setImage] = useState("")

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [editSlug, setEditSlug] = useState("")
  const [editImage, setEditImage] = useState("")

  async function loadCategories() {
    try {
      setLoading(true)
      setError("")
      const data = await getCategories()
      setCategories(Array.isArray(data) ? data : data?.categories || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  function makeSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  function handleNameChange(value: string) {
    setName(value)
    if (!slug) {
      setSlug(makeSlug(value))
    }
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false
  ) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    try {
      setUploadingImage(true)
      setError("")
      const result = await uploadProductImage(file)
      const url = result?.url || ""
      if (isEdit) {
        setEditImage(url)
      } else {
        setImage(url)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed")
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()

    if (!name.trim()) {
      setError("Category name is required.")
      return
    }

    if (!slug.trim()) {
      setError("Category slug is required.")
      return
    }

    try {
      setSaving(true)
      setError("")

      const result = await createCategory({
        name: name.trim(),
        slug: slug.trim(),
        image: image.trim() || undefined,
      })

      const category = result?.category || result

      setCategories((current) => [...current, category])
      setName("")
      setSlug("")
      setImage("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category")
    } finally {
      setSaving(false)
    }
  }

  function startEditing(category: Category) {
    setEditingId(category.id)
    setEditName(category.name)
    setEditSlug(category.slug)
    setEditImage(category.image || "")
    setError("")
  }

  function cancelEditing() {
    setEditingId(null)
    setEditName("")
    setEditSlug("")
    setEditImage("")
  }

  async function saveEditing(id: number) {
    if (!editName.trim()) {
      setError("Category name is required.")
      return
    }

    if (!editSlug.trim()) {
      setError("Category slug is required.")
      return
    }

    try {
      setSaving(true)
      setError("")

      const result = await updateCategory(id, {
        name: editName.trim(),
        slug: editSlug.trim(),
        image: editImage.trim() || undefined,
      })

      const updated = result?.category || result

      setCategories((current) =>
        current.map((category) =>
          category.id === id ? { ...category, ...updated } : category
        )
      )

      cancelEditing()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update category")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(category: Category) {
    const productCount = category._count?.products || 0

    if (productCount > 0) {
      setError(
        `Cannot delete "${category.name}" because it has ${productCount} product(s).`
      )
      return
    }

    if (!window.confirm(`Delete category "${category.name}"?`)) {
      return
    }

    try {
      setError("")
      await deleteCategory(category.id)
      setCategories((current) =>
        current.filter((item) => item.id !== category.id)
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category")
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div className="admin-brand">Baltena Market</div>
        <Link href="/admin" className="admin-header-back">
          ← Dashboard
        </Link>
      </header>

      <div className="admin-content">
        <div className="admin-section-title">
          <div>
            <h1>Categories</h1>
            <p>Manage product categories and cover images.</p>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleCreate} className="admin-form-card">
          <div className="admin-section-title">
            <div>
              <h2>Add Category</h2>
              <p>Create a category with an optional cover image.</p>
            </div>
          </div>

          <div className="admin-form-grid">
            <div>
              <label>Category Name *</label>
              <input
                type="text"
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
                placeholder="e.g. Spices & Seasonings"
                required
              />
            </div>

            <div>
              <label>Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="spices-seasonings"
                required
              />
            </div>
          </div>

          {/* Cover Image Upload Row */}
          <div className="admin-category-image-uploader">
            <label>Cover Image (Optional)</label>
            <div className="category-image-row">
              {image ? (
                <div className="category-preview-box">
                  <img src={getFullImageUrl(image)} alt="Preview" />
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="category-remove-img"
                    title="Remove Image"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="category-no-preview">📁 No Cover Image</div>
              )}

              <label className="admin-upload-btn">
                {uploadingImage ? "Uploading..." : "📷 Upload Cover Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  style={{ display: "none" }}
                  disabled={uploadingImage}
                />
              </label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving || uploadingImage}
            >
              {saving ? "Saving..." : "Add Category"}
            </button>
          </div>
        </form>

        <section className="admin-form-card">
          <div className="admin-section-title">
            <div>
              <h2>Category List</h2>
              <p>
                {categories.length} categor
                {categories.length === 1 ? "y" : "ies"}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="admin-empty">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="admin-empty">No categories yet.</div>
          ) : (
            <div className="admin-category-list">
              {categories.map((category) => (
                <div key={category.id} className="admin-category-row">
                  {editingId === category.id ? (
                    <div className="admin-category-edit-box">
                      <div className="admin-form-grid">
                        <input
                          type="text"
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                          placeholder="Category Name"
                        />
                        <input
                          type="text"
                          value={editSlug}
                          onChange={(event) => setEditSlug(event.target.value)}
                          placeholder="Slug"
                        />
                      </div>

                      <div className="category-image-row" style={{ marginTop: "12px" }}>
                        {editImage ? (
                          <div className="category-preview-box small">
                            <img src={getFullImageUrl(editImage)} alt="Preview" />
                            <button
                              type="button"
                              onClick={() => setEditImage("")}
                              className="category-remove-img"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "13px", color: "#888" }}>No image</span>
                        )}

                        <label className="admin-upload-btn small">
                          {uploadingImage ? "Uploading..." : "Change Image"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, true)}
                            style={{ display: "none" }}
                            disabled={uploadingImage}
                          />
                        </label>
                      </div>

                      <div className="admin-row-actions" style={{ marginTop: "12px" }}>
                        <button
                          type="button"
                          className="admin-primary-button"
                          disabled={saving || uploadingImage}
                          onClick={() => saveEditing(category.id)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="admin-category-item-main">
                        <div className="admin-category-thumb">
                          {category.image ? (
                            <img src={getFullImageUrl(category.image)} alt={category.name} />
                          ) : (
                            <span>📁</span>
                          )}
                        </div>
                        <div className="admin-category-info">
                          <strong>{category.name}</strong>
                          <span>/{category.slug}</span>
                        </div>
                      </div>

                      <div className="admin-category-products">
                        {category._count?.products || 0} product
                        {category._count?.products === 1 ? "" : "s"}
                      </div>

                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() => startEditing(category)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-delete-button"
                          onClick={() => handleDelete(category)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
