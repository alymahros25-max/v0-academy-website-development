'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Locale = 'ar' | 'en' | 'fr'

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Complete translation dictionary with defensive fallbacks
const translations: Record<Locale, Record<string, string>> = {
  ar: {
    dashboard: 'لوحة التحكم',
    settings: 'الإعدادات',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    classroom: 'لقطات من الحصص',
    classroomMoments: 'لقطات من الحصص الدراسية',
    videoTitle: 'عنوان الفيديو',
    youtubeUrl: 'رابط الفيديو',
    uploadVideo: 'رفع فيديو',
    videoDescription: 'وصف الفيديو',
    category: 'الفئة',
    featured: 'مميز',
    active: 'نشط',
    inactive: 'غير نشط',
    noVideos: 'لا توجد فيديوهات بعد',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    success: 'تم بنجاح',
    deleteConfirm: 'هل أنت متأكد من حذف هذا الفيديو؟',
    invalidYoutubeUrl: 'رابط YouTube غير صحيح',
    enterValidUrl: 'يرجى إدخال رابط YouTube صحيح',
    arabic: 'العربية',
    english: 'English',
    french: 'Français',
  },
  en: {
    dashboard: 'Dashboard',
    settings: 'Settings',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    classroom: 'Classroom Moments',
    classroomMoments: 'Classroom Moments',
    videoTitle: 'Video Title',
    youtubeUrl: 'YouTube URL',
    uploadVideo: 'Upload Video',
    videoDescription: 'Video Description',
    category: 'Category',
    featured: 'Featured',
    active: 'Active',
    inactive: 'Inactive',
    noVideos: 'No videos yet',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    deleteConfirm: 'Are you sure you want to delete this video?',
    invalidYoutubeUrl: 'Invalid YouTube URL',
    enterValidUrl: 'Please enter a valid YouTube URL',
    arabic: 'العربية',
    english: 'English',
    french: 'Français',
  },
  fr: {
    dashboard: 'Tableau de bord',
    settings: 'Paramètres',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    classroom: 'Moments de classe',
    classroomMoments: 'Moments de classe',
    videoTitle: 'Titre de la vidéo',
    youtubeUrl: 'URL YouTube',
    uploadVideo: 'Télécharger une vidéo',
    videoDescription: 'Description de la vidéo',
    category: 'Catégorie',
    featured: 'En vedette',
    active: 'Actif',
    inactive: 'Inactif',
    noVideos: 'Pas encore de vidéos',
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    success: 'Succès',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cette vidéo?',
    invalidYoutubeUrl: 'URL YouTube invalide',
    enterValidUrl: 'Veuillez entrer une URL YouTube valide',
    arabic: 'العربية',
    english: 'English',
    french: 'Français',
  },
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar')
  const [isMounted, setIsMounted] = useState(false)

  // Initialize from localStorage and set document properties
  useEffect(() => {
    setIsMounted(true)
    const savedLocale = (localStorage.getItem('locale') as Locale) || 'ar'
    setLocaleState(savedLocale)
    applyLocale(savedLocale)
  }, [])

  const applyLocale = (newLocale: Locale) => {
    const dir = newLocale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = newLocale
    localStorage.setItem('locale', newLocale)
  }

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    applyLocale(newLocale)
  }

  // Robust translation function with defensive fallbacks
  const t = (key: string): string => {
    // Try to get translation for current locale
    if (translations[locale]?.[key]) {
      return translations[locale][key]
    }

    // Fallback to English if available
    if (translations['en']?.[key]) {
      return translations['en'][key]
    }

    // Last resort fallback to Arabic if available
    if (translations['ar']?.[key]) {
      return translations['ar'][key]
    }

    // Return key itself if no translation found (prevents blank spots)
    return key
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  if (!isMounted) return <>{children}</>

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation(): TranslationContextType {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider')
  }
  return context
}
