import { createI18n } from 'vue-i18n';
import es_mx from './es-mx/es-mx';
import en_us from './en-us/en-us';

const i18n = createI18n({
  legacy: false,
  locale: 'es-mx',
  fallbackLocale: 'es-mx',
  messages: {
    'es-mx': es_mx,
    'en-us': en_us
  }
});

export { i18n };
