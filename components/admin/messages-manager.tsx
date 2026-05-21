'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function MessagesManager() {
  const [messages, setMessages] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    try {
      const response = await fetch('/api/admin/data?type=contactMessages')
      const data = await response.json()
      setMessages(data.contactMessages || [])
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  async function handleMarkAsRead(id: string) {
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contactMessages',
          action: 'markRead',
          id
        })
      })

      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  async function handleReply(id: string) {
    if (!replyText.trim()) return

    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contactMessages',
          action: 'reply',
          id,
          replyText
        })
      })

      if (response.ok) {
        setReplyText('')
        setSelectedId(null)
        fetchMessages()
      }
    } catch (error) {
      console.error('Failed to reply:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return

    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contactMessages',
          action: 'delete',
          id
        })
      })

      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        إجمالي الرسائل: {messages.length} | غير مقروءة: {messages.filter(m => !m.read).length}
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            لا توجد رسائل جديدة
          </Card>
        ) : (
          messages.map((message: any) => (
            <Card key={message.id} className={`p-4 ${!message.read ? 'bg-blue-50 border-blue-200' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{message.name}</h4>
                  <p className="text-sm text-gray-600">{message.email}</p>
                  <p className="text-sm text-gray-500">{message.phone}</p>
                </div>
                <div className="flex gap-2">
                  {!message.read && (
                    <Button 
                      onClick={() => handleMarkAsRead(message.id)} 
                      variant="outline" 
                      size="sm"
                    >
                      وضع علامة مقروءة
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-sm font-medium mb-2">{message.subject}</p>
              <p className="text-sm text-gray-700 mb-4">{message.message}</p>

              <div className="text-xs text-gray-500 mb-4">
                {new Date(message.createdAt).toLocaleDateString('ar-SA')} - {new Date(message.createdAt).toLocaleTimeString('ar-SA')}
              </div>

              {selectedId === message.id ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="الرد على الرسالة..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleReply(message.id)} 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      إرسال الرد
                    </Button>
                    <Button 
                      onClick={() => setSelectedId(null)} 
                      variant="outline"
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setSelectedId(message.id)} 
                    variant="outline" 
                    size="sm"
                  >
                    رد
                  </Button>
                  <Button 
                    onClick={() => handleDelete(message.id)} 
                    variant="destructive" 
                    size="sm"
                  >
                    حذف
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
