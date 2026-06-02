export interface OrderItem {
  productId: number
  productName: string
  quantity: number
  price: number
}

export interface Order {
  id: number
  customerId: number
  customerName: string
  items: OrderItem[]
  totalAmount: number
  createdAt: string
}