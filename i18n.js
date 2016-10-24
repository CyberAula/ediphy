import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {es} from './locales/es.js';
import {en} from './locales/en.js';

var translations = {en: en, es: es};

i18n
  .use(LanguageDetector)
  .init({
    whitelist: ['es', 'en'],
    fallbackLng: 'en',
    attributes: ['t', 'i18n'],
    resources: translations,
    debug: false
  });


export default i18n;
