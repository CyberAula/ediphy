import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { es } from './es.js';
import { en } from './en.js';

let translations = { en: en, es: es };
let lng;

try {
    const urlParams = new URLSearchParams(window.location.search);
    const locale = urlParams.get('locale');
    if (locale === "es") {
        lng = 'es';
    } else if (locale === "en") {
        lng = 'en';
    }

} catch (e) {
    console.error(e);
}

i18n
    .use(LanguageDetector)
    .init({
        whitelist: ['es', 'en'],
        fallbackLng: 'en',
        attributes: ['t', 'i18n'],
        resources: translations,
        debug: false,
        lng,
    });

export default i18n;
