'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Check, X, MoreVertical, Download, Eye } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface Order {
  id: string
  stripe_session_id: string
  stripe_payment_intent_id: string
  product_id: string
  category: string
  sessions: number
  amount_paid: number
  currency: string
  customer_email: string
  customer_id: string
  status: 'completed' | 'refunded' | 'pending'
  created_at: string
}

export function OrdersTab() {
  const { t, locale } = useI18n()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/admin/orders')
        const data = await res.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getProductName = (category: string, sessions: number) => {
    const products: Record<string, string> = {
      'quran': locale === 'ar' ? 'حفظ القرآن الكريم' : 'Quran Memorization',
      'arabic': locale === 'ar' ? 'تأسيس العربي' : 'Arabic Foundation'
    }
    return `${products[category] || category} - ${sessions} حصة/Sessions`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'refunded':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const downloadInvoice = (order: Order) => {
    const invoiceContent = `
Invoice
Order ID: ${order.id}
Date: ${formatDate(order.created_at)}

Customer:
Email: ${order.customer_email}

Product: ${getProductName(order.category, order.sessions)}
Amount: $${order.amount_paid.toFixed(2)} ${order.currency.toUpperCase()}
Status: ${order.status}

Stripe Session: ${order.stripe_session_id}
    `.trim()

    const blob = new Blob([invoiceContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${order.id}.txt`
    a.click()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground">
          {locale === 'ar' ? 'جاري تحميل الأوامر...' : 'Loading orders...'}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {locale === 'ar' ? 'الأوامر والفواتير' : 'Orders & Invoices'}
        </h2>
        <div className="text-sm text-muted-foreground">
          {locale === 'ar' 
            ? `إجمالي الأوامر: ${orders.length}`
            : `Total Orders: ${orders.length}`
          }
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {locale === 'ar' ? 'لا توجد أوامر حتى الآن' : 'No orders yet'}
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-right font-semibold">
                  {locale === 'ar' ? 'معرف الطلب' : 'Order ID'}
                </th>
                <th className="px-4 py-2 text-right font-semibold">
                  {locale === 'ar' ? 'المنتج' : 'Product'}
                </th>
                <th className="px-4 py-2 text-right font-semibold">
                  {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </th>
                <th className="px-4 py-2 text-right font-semibold">
                  {locale === 'ar' ? 'المبلغ' : 'Amount'}
                </th>
                <th className="px-4 py-2 text-right font-semibold">
                  {locale === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th className="px-4 py-2 text-right font-semibold">
                  {locale === 'ar' ? 'التاريخ' : 'Date'}
                </th>
                <th className="px-4 py-2 text-right font-semibold">
                  {locale === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="px-4 py-2">
                    {getProductName(order.category, order.sessions)}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {order.customer_email}
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    ${order.amount_paid.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status === 'completed' && locale === 'ar' ? 'مكتمل' : 
                       order.status === 'refunded' && locale === 'ar' ? 'مسترجع' :
                       order.status === 'pending' && locale === 'ar' ? 'قيد الانتظار' :
                       order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowDetails(true)
                        }}
                        className="p-1 hover:bg-primary/10 rounded"
                        title={locale === 'ar' ? 'عرض التفاصيل' : 'View details'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="p-1 hover:bg-primary/10 rounded"
                        title={locale === 'ar' ? 'تحميل الفاتورة' : 'Download invoice'}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold">
              {locale === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <div className="text-muted-foreground">
                  {locale === 'ar' ? 'معرف الطلب' : 'Order ID'}
                </div>
                <div className="font-mono text-xs break-all">{selectedOrder.id}</div>
              </div>

              <div>
                <div className="text-muted-foreground">
                  {locale === 'ar' ? 'معرف الجلسة' : 'Session ID'}
                </div>
                <div className="font-mono text-xs break-all">{selectedOrder.stripe_session_id}</div>
              </div>

              <div>
                <div className="text-muted-foreground">
                  {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </div>
                <div>{selectedOrder.customer_email}</div>
              </div>

              <div>
                <div className="text-muted-foreground">
                  {locale === 'ar' ? 'المنتج' : 'Product'}
                </div>
                <div>{getProductName(selectedOrder.category, selectedOrder.sessions)}</div>
              </div>

              <div>
                <div className="text-muted-foreground">
                  {locale === 'ar' ? 'المبلغ' : 'Amount'}
                </div>
                <div className="text-lg font-bold">${selectedOrder.amount_paid.toFixed(2)}</div>
              </div>

              <div>
                <div className="text-muted-foreground">
                  {locale === 'ar' ? 'الحالة' : 'Status'}
                </div>
                <div className={`px-2 py-1 rounded w-fit text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </div>
              </div>

              <div>
                <div className="text-muted-foreground">
                  {locale === 'ar' ? 'التاريخ' : 'Date'}
                </div>
                <div>{formatDate(selectedOrder.created_at)}</div>
              </div>
            </div>

            <button
              onClick={() => setShowDetails(false)}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded font-semibold"
            >
              {locale === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
