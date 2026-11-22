export interface Variant {
  id: number
  productId?: number
  size: string
  price: string | number
  stock: number
}

export interface Category {
  id: number
  name: string
  slug: string
  image?: string | null
  createdAt?: string
  _count?: {
    products: number
  }
}

export interface Product {
  id: number
  name: string
  slug?: string
  description?: string
  image?: string
  categoryId?: number | null
  category?: Category | null
  variants?: Variant[]
  createdAt?: string
  updatedAt?: string
}

export interface Customer {
  id: number
  name: string
  email: string
}

export interface OrderItem {
  id: number
  orderId?: number
  productId: number
  productName: string
  size: string
  quantity: number
  price: string | number
}

export interface Order {
  id: number
  orderNumber: string
  customerName: string
  phone: string
  region?: string | null
  city?: string | null
  subCity?: string | null
  woreda?: string | null
  houseNumber?: string | null
  address?: string | null
  note?: string | null
  status: string
  total: string | number
  createdAt: string
  updatedAt?: string
  items: OrderItem[]
  customerId?: number | null
  customer?: Customer | null
}

