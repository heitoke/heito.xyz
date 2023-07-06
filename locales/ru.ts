import type { ILocale } from './';

export default {
    global: {
        settings: 'Настройки',
        exit: ['Выход', 'Выйти'],
        lang: ['Языки', 'Язык'],
        notification: ['Уведомления', 'Уведомление'],
        theme: {
            default: 'Тема',
            dark: 'Темная тема',
            light: 'Светлая тема',
        },
        nickname: 'Имя',
        login: 'Логин',
        email: 'Почта',
        password: 'Пароль',
        repeatPassword: 'Повтор пароля',
        sign: {
            in: 'Войти',
            out: 'Выйти'
        }
    },
    page: {
        main: {
            title: 'Добро пожаловать мой друг',
            text: 'Lore2m ipsum dolor sit amet, consectetur adipisicing elit. Ex odio ad soluta obcaecati magnam sit eius dolor. Numquam dolore exercitationem maxime repellat molestias neque quos.'
        }
    },
    user: {
        auth: {
            title: ['Авторизация']
        },
        create: {
            title: ['Создание аккаунта', 'Создать аккаунт'],
            text: 'Это необходимо для того, чтобы, когда вы заходите на этот сайт из других браузеров или устройств, вы могли войти в ту же учетную запись с теми же данными. Мы используем ваш IP-адрес, чтобы понять, есть ли у вас уже пользователь.'
        }
    }
} as ILocale;