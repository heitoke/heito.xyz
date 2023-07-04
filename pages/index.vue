<template>
    <div class="main">
        Main Page

        <Alert :type="'mini'">das</Alert>

        <Checkbox>hello</Checkbox>

        <Icon/>

        <Loading/>

        <Button>asd</Button>

        <Textbox :text="'testest'"/>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>

.main {
    padding: 12px;
}

</style>