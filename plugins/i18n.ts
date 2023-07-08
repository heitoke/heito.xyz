import { createI18n } from 'vue-i18n';

import en from '~/locales/en';
import ru from '~/locales/ru';

export default defineNuxtPlugin(({ vueApp }) => {
    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: 'en',
        availableLocales: [
            {
                code: 'en',
            },
            {
                code: 'ru'
            }
        ],
        messages: {
            en: { ...en },
            ru: { ...ru }
        }
    });

    vueApp.use(i18n);

    return {
        provide: {
            langs: {
                list: [
                    {
                        names: {
                            en: 'English',
                            ru: 'Английский'
                        },
                        code: 'en'
                    },
                    {
                        names: {
                            en: 'Russian',
                            ru: 'Русский'
                        },
                        code: 'ru'
                    }
                ]
            }
        }
    }
});