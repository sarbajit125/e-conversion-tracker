import 'server-only'
import type { Locale } from './i18n-config'

const dictionaries = {
    en: () => import('./Localization/en.json').then((module) => module.default),
    hi: () => import('./Localization/hi.json').then((module) => module.default),
    cs: () => import('./Localization/cs.json').then((module) => module.default),
  }
  
  export const getLocalization = async (locale: Locale) =>
    dictionaries[locale]?.() ?? dictionaries.en()
  