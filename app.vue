<template>
    <div>
        hello
    </div>
</template>

<script lang="ts" setup>

const { $local } = useNuxtApp();

if (process.client) {
    const
        html = document.querySelector('html')!,
        style = document.documentElement.style,
        theme = $local.get('theme'),
        color = $local.get('color');


    // * Theme
    if (!theme) $local.set('theme', 'dark');

    html.setAttribute('theme', $local.get('theme') as string || 'dark');


    // * Color
    if (color) {
        style.setProperty('--main-color', color as string);
        style.setProperty('--main-color-alt', colors.addAlpha(color as string, .35));
    } else {
        $local.set('color', '#FFBF34');
    }
    

    // * Effects
    html?.classList[$local.params?.effect === 'transparent' ? 'add' : 'remove']('no-blur');
        
    style.setProperty('--blur', `${$local.params?.blur || 5}px`);
    style.setProperty('--transparent', colors.addAlpha('#010101', $local.params?.transparent as number));
}


</script>