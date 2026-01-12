import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '@/locales/en/common.json';
import enCategories from '@/locales/en/categories.json';
import koCommon from '@/locales/ko/common.json';
import koCategories from '@/locales/ko/categories.json';

const resources = {
  en: {
    common: enCommon,
    categories: enCategories,
  },
  ko: {
    common: koCommon,
    categories: koCategories,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
