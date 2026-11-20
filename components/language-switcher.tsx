'use client'

import { useLanguage } from '@/lib/language'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div role="group" aria-label={t('Choose language')} className={`inline-flex items-center gap-1 rounded-full border border-white/20 p-1 text-xs ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        aria-pressed={language === 'bn'}
        className={`rounded-full px-2 py-1 transition-colors ${language === 'bn' ? 'bg-white text-foreground' : 'text-current hover:bg-white/10'}`}
      >
        বাংলা
      </button>
      <span aria-hidden="true" className="opacity-50">|</span>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`rounded-full px-2 py-1 transition-colors ${language === 'en' ? 'bg-white text-foreground' : 'text-current hover:bg-white/10'}`}
      >
        EN
      </button>
    </div>
  )
}
