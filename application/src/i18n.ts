import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'

import en from './translations/en.json'
import de from './translations/de.json'
import pt from './translations/pt.json'

const resources = {
    en: { translation: en },
    de: { translation: de },
    pt: { translation: pt },
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getLocales()[0].languageCode || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    })

export default i18n
