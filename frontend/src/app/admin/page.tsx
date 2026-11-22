"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { adminLogout, getAdminOrders } from "@/lib/admin-api"

type AdminOrder = {
  id: number
  createdAt: string
}

const NEW_ORDER_SEEN_KEY = "baltena_admin_last_seen_order"

export default function AdminDashboardPage() {
  const [newOrders, setNewOrders] = useState(0)

  async function checkNewOrders() {
    try {
      const orders = await getAdminOrders()

      if (!Array.isArray(orders) || orders.length === 0) {
        setNewOrders(0)
        return
      }

      const sortedOrders = [...orders].sort(
        (a: AdminOrder, b: AdminOrder) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )

      const newestOrder = sortedOrders[0]

      const savedLastSeen = localStorage.getItem(
        NEW_ORDER_SEEN_KEY
      )

      // First time opening the dashboard:
      // use the newest existing order as the starting point.
      if (!savedLastSeen) {
        localStorage.setItem(
          NEW_ORDER_SEEN_KEY,
          newestOrder.createdAt
        )

        setNewOrders(0)
        return
      }

      const lastSeenTime = new Date(
        savedLastSeen
      ).getTime()

      const unseenCount = orders.filter(
        (order: AdminOrder) =>
          new Date(order.createdAt).getTime() >
          lastSeenTime
      ).length

      setNewOrders(unseenCount)
    } catch {
      // Keep the dashboard working even if the check fails.
    }
  }

  useEffect(() => {
    checkNewOrders()

    const interval = setInterval(() => {
      checkNewOrders()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="admin-dashboard-page">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-sidebar-brand">
          <div className="admin-logo">
            B
          </div>

          <div>
            <strong>Bealtena</strong>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">

          <Link
            href="/admin"
            className="admin-sidebar-link active"
          >
            <span className="admin-nav-icon">⌂</span>
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className="admin-sidebar-link"
          >
            <span className="admin-nav-icon">▣</span>
            Products
          </Link>

          <Link
            href="/admin/categories"
            className="admin-sidebar-link"
          >
            <span className="admin-nav-icon">▤</span>
            Categories
          </Link>

          <Link
            href="/admin/orders"
            className="admin-sidebar-link"
            style={{
              position: "relative",
            }}
          >
            <span className="admin-nav-icon">▰</span>
            Orders

            {newOrders > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  minWidth: "22px",
                  height: "22px",
                  padding: "0 6px",
                  borderRadius: "999px",
                  background: "#dc2626",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                {newOrders > 99 ? "99+" : newOrders}
              </span>
            )}
          </Link>

        </nav>

        <div className="admin-sidebar-bottom">

          <Link
            href="/"
            className="admin-store-link"
          >
            ← View Store
          </Link>

          <button
            type="button"
            className="admin-logout-button"
            onClick={adminLogout}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <section className="admin-dashboard-main">

        {/* TOP BAR */}
        <header className="admin-topbar">

          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome back. Manage your Bealtena store.
            </p>
          </div>

          <Link
            href="/"
            className="admin-view-store-button"
          >
            View Store
          </Link>

        </header>

        {/* OVERVIEW */}
        <section className="admin-overview">

          <div className="admin-overview-card">

            <div className="admin-overview-icon">
              ▣
            </div>

            <div>
              <span>Products</span>
              <strong>Manage</strong>
              <small>
                Products, prices and stock
              </small>
            </div>

          </div>

          <div className="admin-overview-card">

            <div className="admin-overview-icon">
              ▤
            </div>

            <div>
              <span>Categories</span>
              <strong>Manage</strong>
              <small>
                Organize your products
              </small>
            </div>

          </div>

          <div
            className="admin-overview-card"
            style={{
              position: "relative",
            }}
          >

            {newOrders > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  background: "#dc2626",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "5px 9px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {newOrders} NEW
              </span>
            )}

            <div className="admin-overview-icon">
              ▰
            </div>

            <div>
              <span>Orders</span>
              <strong>View Orders</strong>
              <small>
                {newOrders > 0
                  ? `${newOrders} new order${newOrders === 1 ? "" : "s"} waiting`
                  : "Customer orders and status"}
              </small>
            </div>

          </div>

        </section>

        {/* MANAGEMENT SECTION */}
        <section className="admin-management-section">

          <div className="admin-section-heading">

            <div>
              <h2>Store Management</h2>

              <p>
                Quickly access the main areas of your store.
              </p>
            </div>

          </div>

          <div className="admin-management-grid">

            {/* PRODUCTS */}
            <Link
              href="/admin/products"
              className="admin-management-card"
            >

              <div className="admin-management-card-top">

                <div className="admin-card-icon">
                  ▣
                </div>

                <span className="admin-card-arrow">
                  →
                </span>

              </div>

              <h3>
                Products
              </h3>

              <p>
                Add new products, upload images,
                manage sizes, prices and stock.
              </p>

              <span className="admin-card-action">
                Manage Products
              </span>

            </Link>

            {/* CATEGORIES */}
            <Link
              href="/admin/categories"
              className="admin-management-card"
            >

              <div className="admin-management-card-top">

                <div className="admin-card-icon">
                  ▤
                </div>

                <span className="admin-card-arrow">
                  →
                </span>

              </div>

              <h3>
                Categories
              </h3>

              <p>
                Create, edit and organize your
                product categories.
              </p>

              <span className="admin-card-action">
                Manage Categories
              </span>

            </Link>

            {/* ORDERS */}
            <Link
              href="/admin/orders"
              className="admin-management-card"
              style={{
                position: "relative",
              }}
            >

              {newOrders > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    background: "#dc2626",
                    color: "#fff",
                    borderRadius: "999px",
                    padding: "5px 9px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {newOrders} NEW
                </span>
              )}

              <div className="admin-management-card-top">

                <div className="admin-card-icon">
                  ▰
                </div>

                <span className="admin-card-arrow">
                  →
                </span>

              </div>

              <h3>
                Orders
              </h3>

              <p>
                View customer orders, delivery
                information and update order status.
              </p>

              <span className="admin-card-action">
                {newOrders > 0
                  ? `View ${newOrders} New Order${newOrders === 1 ? "" : "s"}`
                  : "Manage Orders"}
              </span>

            </Link>

          </div>

        </section>

        {/* ORDER AREA */}
        <section className="admin-orders-preview">

          <div className="admin-orders-preview-header">

            <div>
              <h2>Order Management</h2>

              <p>
                Keep track of customer orders and fulfillment.
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="admin-orders-view-all"
            >
              View All Orders →
            </Link>

          </div>

          <div className="admin-order-info-grid">

            <div className="admin-order-info">

              <div className="admin-order-info-icon">
                +
              </div>

              <div>
                <strong>New Orders</strong>

                <span>
                  Check newly placed customer orders.
                </span>
              </div>

            </div>

            <div className="admin-order-info">

              <div className="admin-order-info-icon">
                ✓
              </div>

              <div>
                <strong>Order Status</strong>

                <span>
                  Update pending, processing and fulfilled orders.
                </span>
              </div>

            </div>

            <div className="admin-order-info">

              <div className="admin-order-info-icon">
                →
              </div>

              <div>
                <strong>Delivery Information</strong>

                <span>
                  View customer phone and delivery location.
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* QUICK ACTIONS */}
        <section className="admin-quick-actions">

          <h2>
            Quick Actions
          </h2>

          <div className="admin-quick-action-buttons">

            <Link
              href="/admin/products/new"
              className="admin-primary-action"
            >
              + Add Product
            </Link>

            <Link
              href="/admin/categories"
              className="admin-secondary-action"
            >
              Manage Categories
            </Link>

            <Link
              href="/admin/orders"
              className="admin-secondary-action"
            >
              View Orders
            </Link>

          </div>

        </section>

      </section>

    </main>
  )
}
