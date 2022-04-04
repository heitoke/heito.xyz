import { defineAsyncComponent } from 'vue'

// * Menu Components
const Components = {
    // ? Settings
    SettingsMenu: defineAsyncComponent(() => import('./menu/settings/Main.vue')),
    SettingsEditMenu: defineAsyncComponent(() => import('./menu/settings/Edit.vue')),
    SettingsAddLinkMenu: defineAsyncComponent(() => import('./menu/settings/AddLink.vue')),
    // ? User
    LoginMenu: defineAsyncComponent(() => import('./menu/user/Login.vue')),
    UserInfoMenu: defineAsyncComponent(() => import('./menu/user/Info.vue')),
    // ? Project
    ProjectInfoMenu: defineAsyncComponent(() => import('./menu/project/Info.vue')),
    // ? Services
    ServicesListMenu: defineAsyncComponent(() => import('./menu/services/List.vue')),
    ServicesAddMenu: defineAsyncComponent(() => import('./menu/services/Add.vue'))
}

// * Componetns
import Menu from './components/menu.vue'
import ContextMenu from './components/contextMenu.vue'

// * Fields
import Button from './components/fields/button.vue'
import Check from './components/fields/checkbox.vue'
import Text from './components/fields/textbox.vue'
import File from './components/fields/file.vue'
import Select from './components/fields/select.vue'

// * Other
import icon from './components/other/icon.vue'

const Fields = {
    Button, Check, Text, File, Select,
    Menu, ContextMenu,
    icon
}

export { Components, Fields }