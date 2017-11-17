import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { es } from './es/es.js';
import { en } from './en/en.js';

let translations = { en: en, es: es };

i18n
    .use(LanguageDetector)
    .init({
        whitelist: ['es', 'en'],
        fallbackLng: 'en',
        attributes: ['t', 'i18n'],
        resources: translations,
        debug: false,
    });

export default i18n;
