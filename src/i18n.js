import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend) // charge les fichiers JSON
  .use(LanguageDetector) // détecte la langue du navigateur
  .use(initReactI18next) // connecte à React
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false // React échappe déjà
    }
  });

export default i18n;
