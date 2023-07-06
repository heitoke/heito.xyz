<template>
    <div class="main">
        Main Page

        <Alert :type="'mini'">das</Alert>

        <Checkbox>hello</Checkbox>

        <Icon/>

        <Loading/>

        <Button>asd</Button>

        <Textbox :value="'testest'" style="margin: 12px 0 0 0;"/>

        <Text :text="$t('global.exit[0]')"/>

        <Button style="width: 128px;" @click="switchLang">Switch lang</Button>
    </div>
</template>

<script lang="ts" setup>

const { locale, locales, setLocale } = useI18n();

function switchLang() {
    setLocale(locale.value === 'en' ? 'ru' : 'en');
}

useSeoMeta({
    title: 'Home'
})

</script>

<style lang="scss" scoped>

.main {
    padding: 12px;
}

</style>