import type { Locale } from '~/types/locale';

const lang: Locale = {
    language: ['Язык', 'Языки'],
    languages: {
        en: 'Английский',
        ru: 'Русский'
    },
    online: 'Онлайн',
    settings: 'Настройки',
    darkMode: 'Темный режим',
    session: ['Сессия', 'Сессии'],
    signIn: 'Войти',
    exit: 'Выйти',
    project: ['Проект', 'Проекты'],
    
    pages: {
        home: {
            title: 'Главная',
            description: ''
        },
        projects: {
            title: 'Проекты',
            description: ''
        },
        repos: {
            title: 'Репозитории',
            description: ''
        },
        stats: {
            title: 'Статистика',
            description: ''
        }
    },
    
    footer: {
        thanks: 'Спасибо за все'
    }
}

export default lang;