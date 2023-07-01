import Button from './components/UI/Button.vue';
import Alert from './components/UI/Alert.vue';
import Checkbox from './components/UI/Checkbox.vue';
import ColorPicker from './components/UI/ColorPicker.vue';
import Icon from './components/UI/Icon.vue';
import Loading from './components/UI/Loading.vue';
import Radio from './components/UI/Radio.vue';
import Range from './components/UI/Range.vue';
import Select from './components/UI/Select.vue';
import Skeleton from './components/UI/Skeleton.vue';
import Text from './components/UI/Text.vue';
import Textbox from './components/UI/Textbox.vue';


declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        Button: typeof Button,
        Alert: typeof Alert,
        Checkbox: typeof Checkbox,
        ColorPicker: typeof ColorPicker,
        Icon: typeof Icon,
        Loading: typeof Loading,
        Radio: typeof Radio,
        Range: typeof Range,
        Select: typeof Select,
        Skeleton: typeof Skeleton,
        Text: typeof Text,
        Textbox: typeof Textbox
    }
}