'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { AlertCircle, Check, Copy, Eye, EyeOff, Loader2, Save, Zap } from 'lucide-react'
import useSWR from 'swr'

interface PaymentProvider {
  id: string
  provider_name: 'stripe' | 'paddle' | 'paytabs'
  api_key: string
  secret_key: string | null
  merchant_id: string | null
  vendor_id: string | null
  webhook_secret: string | null
  is_active: boolean
  currency: string
  min_amount: number
  max_amount: number
  support_email: string | null
}

export function PaymentSettingsTab() {
  const { t } = useI18n()
  const [loading, setLoading] = useState(false)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [editingProvider, setEditingProvider] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  // Fetch payment providers
  const { data: providers = [], mutate } = useSWR(
    '/api/admin/payment-settings',
    async (url) => {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch payment settings')
      return res.json()
    }
  )

  const handleSwitchProvider = async (providerName: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'switch_provider',
          provider_name: providerName,
        }),
      })

      if (!res.ok) throw new Error('Failed to switch provider')
      
      mutate()
      alert(`Switched to ${providerName}`)
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProvider = async (provider: PaymentProvider, updates: Partial<PaymentProvider>) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_provider',
          provider_name: provider.provider_name,
          updates,
        }),
      })

      if (!res.ok) throw new Error('Failed to update provider')
      
      mutate()
      setEditingProvider(null)
      alert('Settings updated successfully')
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const maskApiKey = (key: string) => {
    if (!key) return ''
    return key.slice(0, 4) + '*'.repeat(Math.max(0, key.length - 8)) + key.slice(-4)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">{t('admin.paymentSettings') || 'إعدادات الدفع'}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          إدارة مزودي خدمات الدفع والمفاتيح والإعدادات
        </p>
      </div>

      {/* Active Provider Alert */}
      {providers.find((p: PaymentProvider) => p.is_active) && (
        <div className="bg-primary/10 border border-primary rounded-lg p-4 flex items-start gap-3">
          <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-primary">مزود الدفع النشط:</p>
            <p className="text-sm text-foreground">
              {providers.find((p: PaymentProvider) => p.is_active)?.provider_name.toUpperCase()}
            </p>
          </div>
        </div>
      )}

      {/* Payment Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider: PaymentProvider) => (
          <div
            key={provider.id}
            className={`border rounded-lg p-6 space-y-4 transition-all ${
              provider.is_active
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            }`}
          >
            {/* Provider Name */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold uppercase">{provider.provider_name}</h3>
              {provider.is_active && (
                <div className="bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div className="flex gap-2">
              <div
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  provider.is_active
                    ? 'bg-green-500/20 text-green-700'
                    : 'bg-gray-500/20 text-gray-600'
                }`}
              >
                {provider.is_active ? 'نشط' : 'غير فعال'}
              </div>
            </div>

            {/* API Key Display */}
            {provider.api_key && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">API KEY</p>
                <div className="flex items-center gap-2 bg-muted p-2 rounded text-xs font-mono">
                  <span className="flex-1 truncate">
                    {showKeys[provider.id] ? provider.api_key : maskApiKey(provider.api_key)}
                  </span>
                  <button
                    onClick={() => setShowKeys(s => ({ ...s, [provider.id]: !s[provider.id] }))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(provider.api_key, `${provider.id}-api`)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {copied === `${provider.id}-api` ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Webhook Secret */}
            {provider.webhook_secret && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">WEBHOOK SECRET</p>
                <div className="flex items-center gap-2 bg-muted p-2 rounded text-xs font-mono">
                  <span className="flex-1 truncate">
                    {showKeys[`${provider.id}-webhook`] 
                      ? provider.webhook_secret 
                      : maskApiKey(provider.webhook_secret)}
                  </span>
                  <button
                    onClick={() => setShowKeys(s => ({ 
                      ...s, 
                      [`${provider.id}-webhook`]: !s[`${provider.id}-webhook`] 
                    }))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showKeys[`${provider.id}-webhook`] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Missing Configuration Alert */}
            {!provider.api_key && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-700">غير مُكوَّن - أضف المفاتيح</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              {provider.is_active ? (
                <button
                  disabled
                  className="flex-1 py-2 bg-primary/50 text-primary-foreground rounded font-semibold text-sm cursor-not-allowed"
                >
                  نشط حالياً
                </button>
              ) : (
                <button
                  onClick={() => handleSwitchProvider(provider.provider_name)}
                  disabled={loading || !provider.api_key}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded font-semibold text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  تفعيل
                </button>
              )}
              <button
                onClick={() => setEditingProvider(editingProvider === provider.id ? null : provider.id)}
                className="flex-1 py-2 bg-secondary text-secondary-foreground rounded font-semibold text-sm hover:brightness-110 transition-all"
              >
                تعديل
              </button>
            </div>

            {/* Edit Form */}
            {editingProvider === provider.id && (
              <EditProviderForm
                provider={provider}
                onSave={(updates) => handleUpdateProvider(provider, updates)}
                onCancel={() => setEditingProvider(null)}
                loading={loading}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface EditProviderFormProps {
  provider: PaymentProvider
  onSave: (updates: Partial<PaymentProvider>) => void
  onCancel: () => void
  loading: boolean
}

function EditProviderForm({ provider, onSave, onCancel, loading }: EditProviderFormProps) {
  const [formData, setFormData] = useState({
    api_key: provider.api_key || '',
    secret_key: provider.secret_key || '',
    vendor_id: provider.vendor_id || '',
    merchant_id: provider.merchant_id || '',
    webhook_secret: provider.webhook_secret || '',
  })

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="space-y-2">
        <label className="text-xs font-semibold">API Key</label>
        <input
          type="password"
          value={formData.api_key}
          onChange={(e) => setFormData(s => ({ ...s, api_key: e.target.value }))}
          className="w-full px-3 py-2 bg-muted border border-border rounded text-sm"
          placeholder="أدخل API Key"
        />
      </div>

      {provider.provider_name === 'paddle' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold">Vendor ID</label>
          <input
            type="text"
            value={formData.vendor_id}
            onChange={(e) => setFormData(s => ({ ...s, vendor_id: e.target.value }))}
            className="w-full px-3 py-2 bg-muted border border-border rounded text-sm"
            placeholder="أدخل Vendor ID"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-semibold">Webhook Secret</label>
        <input
          type="password"
          value={formData.webhook_secret}
          onChange={(e) => setFormData(s => ({ ...s, webhook_secret: e.target.value }))}
          className="w-full px-3 py-2 bg-muted border border-border rounded text-sm"
          placeholder="أدخل Webhook Secret"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onSave(formData)}
          disabled={loading}
          className="flex-1 py-2 bg-green-600 text-white rounded font-semibold text-sm hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2 bg-muted text-foreground rounded font-semibold text-sm hover:brightness-110 disabled:opacity-50"
        >
          إلغاء
        </button>
      </div>
    </div>
  )
}
