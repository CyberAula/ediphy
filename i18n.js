
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .init({
    whitelist: ['es', 'en'],

    debug: true
  });


export default i18n;