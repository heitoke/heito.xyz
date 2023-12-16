<template>
    <div class="home">
        <h1>Hello world</h1>

        {{ $user.user?.displayName }}
    </div>
</template>

<script lang="ts" setup>

const $user = useUserStore();

</script>

<style lang="scss" scoped></style>