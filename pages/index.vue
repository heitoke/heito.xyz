<template>
    <div class="main">
        Main Page

        <Alert :type="'mini'">das</Alert>

        <Checkbox>hello</Checkbox>

        <Icon/>

        <Loading/>

        <Button>asd</Button>

        <Textbox :value="'testest'" style="margin: 12px 0 0 0;"/>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>

.main {
    padding: 12px;
}

</style>