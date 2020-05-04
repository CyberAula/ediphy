import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { es } from './es.js';
import { en } from './en.js';

let translations = { en: en, es: es };

i18n
    .use(LanguageDetector)
    .init({
        whitelist: ['en', 'es'],
        fallbackLng: 'en',
        attributes: ['t', 'i18n'],
        resources: translations,
        debug: false,
    });

export default i18n;
