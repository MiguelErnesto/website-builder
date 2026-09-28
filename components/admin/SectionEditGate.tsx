'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { SectionEditForm } from '@/components/admin/SectionEditForm'

export function SectionEditGate() {
  const sectionId = useSearchParams().get('section')

  useEffect(() => {
    document.body.classList.toggle('is-section-edit', Boolean(sectionId))
    if (!sectionId) return undefined
    const buttons = document.querySelectorAll('button')
    buttons.forEach((btn) => {
      const text = (btn.textContent || '').trim()
      if (text === 'Secciones' || text === 'Sections') btn.click()
    })
    return () => document.body.classList.remove('is-section-edit')
  }, [sectionId])

  if (!sectionId) return null
  return <SectionEditForm sectionId={sectionId} />
}
