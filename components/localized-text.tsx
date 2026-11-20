'use client'

import { useLanguage } from '@/lib/language'

type LocalizedTextProps = {
  text: string
  as?: 'h1' | 'h2' | 'p' | 'span'
  className?: string
  id?: string
}

export function LocalizedText({ text, as = 'span', className, id }: LocalizedTextProps) {
  const { t } = useLanguage()
  const Element = as

  return <Element id={id} className={className}>{t(text)}</Element>
}
