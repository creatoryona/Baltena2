"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  isCustomerLoggedIn,
  customerLogout,
  getCustomerOrders,
  updateCustomerProfile,
  changeCustomerPassword,
} from "@/lib/customer-api"
import type { Order } from "@/lib/types"

export default function CustomerProfilePage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<{
    id?: number
    name: string
    email: string
  } | null>(null)

  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "password">("profile")
  const [loading, setLoading] = useState(true)

  // Orders State
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [ordersError, setOrdersError] = useState("")

  // Profile Edit State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      router.replace("/login?redirect=/profile")
      return
    }

    try {
      const stored = localStorage.getItem("baltena_customer")
      if (stored) {
        const parsed = JSON.parse(stored)
        setCustomer(parsed)
        setName(parsed.name || "")
        setEmail(parsed.email || "")
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [router])

  // Load orders when orders tab is opened
  useEffect(() => {
    if (activeTab === "orders") {
      async function fetchOrders() {
        try {
          setLoadingOrders(true)
          setOrdersError("")
          const data = await getCustomerOrders()
          setOrders(Array.isArray(data) ? data : [])
        } catch (err) {
          setOrdersError(err instanceof Error ? err.message : "Failed to load orders")
        } finally {
          setLoadingOrders(false)
        }
      }
      fetchOrders()
    }
  }, [activeTab])

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setProfileMsg(null)

    if (!name.trim() || !email.trim()) {
      setProfileMsg({ type: "error", text: "Name and email are required" })
      return
    }

    try {
      setProfileSaving(true)
      const res = await updateCustomerProfile({ name, email })
      setCustomer(res.customer)
      setProfileMsg({ type: "success", text: "Profile updated successfully!" })
    } catch (err) {
      setProfileMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update profile",
      })
    } finally {
      setProfileSaving(false)
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMsg(null)

    if (!currentPassword) {
      setPasswordMsg({ type: "error", text: "Current password is required" })
      return
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "New password must be at least 6 characters" })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match" })
      return
    }

    try {
      setPasswordSaving(true)
      await changeCustomerPassword({ currentPassword, newPassword })
      setPasswordMsg({ type: "success", text: "Password changed successfully!" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setPasswordMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to change password",
      })
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="container profile-page">
        <div className="profile-card skeleton">
          <p>Loading your profile...</p>
        </div>
      </main>
    )
  }

  if (!customer) {
    return (
      <main className="container profile-page">
        <div className="profile-card">
          <h2>No account details found</h2>
          <Link href="/login" className="primary-button">
            Go to Login
          </Link>
        </div>
      </main>
    )
  }

  const initial = customer.name ? customer.name.charAt(0).toUpperCase() : "U"

  return (
    <main className="container profile-page">
      <div className="profile-header">
        <h1>My Account</h1>
        <p>Manage your account settings, orders, and security.</p>
      </div>

      <div className="profile-card">
        {/* User Hero Banner */}
        <div className="profile-avatar-row">
          <div className="profile-avatar-large">
            {initial}
          </div>
          <div className="profile-avatar-meta">
            <h2>{customer.name}</h2>
            <p className="profile-email-sub">{customer.email}</p>
            <span className="profile-badge">Customer Account</span>
          </div>
          <button
            type="button"
            onClick={customerLogout}
            className="profile-btn-logout-header"
            title="Log Out"
          >
            Log Out
          </button>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="profile-tabs">
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            ✏️ Change Profile
          </button>

          <button
            type="button"
            className={`profile-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            📦 View Order History
          </button>

          <button
            type="button"
            className={`profile-tab-btn ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            🔒 Change Password
          </button>
        </div>

        {/* TAB 1: CHANGE PROFILE */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="profile-form-section">
            <h3>Profile Information</h3>
            <p className="tab-subtitle">Update your personal account details.</p>

            {profileMsg && (
              <div className={`profile-alert ${profileMsg.type}`}>
                {profileMsg.text}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="customer-name">Full Name</label>
              <input
                id="customer-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customer-email">Email Address</label>
              <input
                id="customer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={profileSaving}
                className="profile-save-btn"
              >
                {profileSaving ? "Saving changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: ORDER HISTORY */}
        {activeTab === "orders" && (
          <div className="profile-orders-section">
            <h3>Order History</h3>
            <p className="tab-subtitle">Review all your previous orders and their current status.</p>

            {loadingOrders ? (
              <div className="orders-empty-state">Loading your orders...</div>
            ) : ordersError ? (
              <div className="profile-alert error">{ordersError}</div>
            ) : orders.length === 0 ? (
              <div className="orders-empty-state">
                <span className="empty-order-icon">🛍️</span>
                <h4>No orders yet</h4>
                <p>When you place an order, it will appear here so you can track it.</p>
                <Link href="/products" className="profile-shop-link">
                  Start Shopping →
                </Link>
              </div>
            ) : (
              <div className="customer-orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="customer-order-card">
                    <div className="customer-order-header">
                      <div>
                        <strong>Order #{order.orderNumber}</strong>
                        <span className="customer-order-date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`customer-order-status status-${order.status}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="customer-order-items">
                      {order.items.map((item) => (
                        <div key={item.id} className="customer-order-item-row">
                          <span>
                            {item.productName} ({item.size}) × {item.quantity}
                          </span>
                          <strong>
                            {(Number(item.price) * item.quantity).toFixed(2)} ETB
                          </strong>
                        </div>
                      ))}
                    </div>

                    <div className="customer-order-footer">
                      <span className="customer-order-address">
                        📍 {order.city || ""}{order.region ? `, ${order.region}` : ""}
                      </span>
                      <strong className="customer-order-total">
                        Total: {Number(order.total).toFixed(2)} ETB
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CHANGE PASSWORD */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit} className="profile-form-section">
            <h3>Change Password</h3>
            <p className="tab-subtitle">Ensure your account is using a long and secure password.</p>

            {passwordMsg && (
              <div className={`profile-alert ${passwordMsg.type}`}>
                {passwordMsg.text}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="current-pass">Current Password</label>
              <input
                id="current-pass"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="new-pass">New Password</label>
              <input
                id="new-pass"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-pass">Confirm New Password</label>
              <input
                id="confirm-pass"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={passwordSaving}
                className="profile-save-btn"
              >
                {passwordSaving ? "Updating password..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
