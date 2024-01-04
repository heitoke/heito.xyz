import { createI18n } from 'vue-i18n';

// * Locales
import en from '~/locales/en';
import ru from '~/locales/ru';


export default defineNuxtPlugin(({ vueApp }) => {
    const messages = {
        en,
        ru
    }

    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: cookies.get('HX_LANG') || 'en',
        availableLocales: [
            {
                code: 'en'
            },
            {
                code: 'ru'
            }
        ],
        messages: messages as any
    });

    vueApp.use(i18n);


    const codes = Object.keys(messages);


    function set(code: string) {
        if (!codes.includes(code)) return;

        i18n.global.locale.value = code;

        cookies.set('HX_LANG', code);
    }

    return {
        provide: {
            langs: {
                codes,
                set
            }
        }
    }
});