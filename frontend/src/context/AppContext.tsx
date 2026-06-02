import {
  createContext,
  useContext,
  useState,
  
} from 'react';
import type { ReactNode } from 'react'

import type { Product } from '../types/product'
import type { Customer } from '../types/customer'
import type { Order } from '../types/order'

interface AppContextType {
  products: Product[]
  setProducts: React.Dispatch<
    React.SetStateAction<Product[]>
  >

  customers: Customer[]
  setCustomers: React.Dispatch<
    React.SetStateAction<Customer[]>
  >

  orders: Order[]
  setOrders: React.Dispatch<
    React.SetStateAction<Order[]>
  >
}

const AppContext =
  createContext<AppContextType | null>(null)

export function AppProvider({
  children,
}: {
  children: ReactNode
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] =
    useState<Customer[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        customers,
        setCustomers,
        orders,
        setOrders,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error(
      'useAppContext must be used inside AppProvider'
    )
  }

  return context
}