<template>
    <div class="markdown-content">
        <div v-html="toHtml(text)"></div>
    </div>
</template>

<script lang="ts" setup>

import Markdown from '~/libs/markdown';

const props = defineProps({
    text: { type: String, required: true }
});


function toHtml(text: string) {
    const markdown = new Markdown(`\n${text}\n`);
    
    return markdown.init();
}

</script>

<style lang="scss" scoped>

.markdown-content {
    :deep(div) {
        // * {
            // font-family: Lato, sans-serif !important;
        // }

        h1, h2, h3, h4, h5, h6 {
            margin: 1.2em 0;
            line-height: 1.33;
            font-weight: bold;
        }

        h1 { font-size: 2em; }
        h2 { font-size: 1.5em; }
        h3 { font-size: 1.17em; }
        h5 { font-size: .83em; }
        h6 { font-size: .67em; }

        a {
            color: var(--main-color);
            text-decoration: none;
            
            &:hover {
                text-decoration: underline;
            }
        }

        strong {
            font-weight: bold;
        }

        em {
            font-style: italic;
        }

        blockquote {
            margin: 0;
            padding: 1px 0 1px 1.5em;
            border-left: 5px solid var(--background-secondary);
        }

        .monospace {
            padding: 2px 4px;
            border-radius: 5px;
            background-color: var(--background-secondary);
        }

        ul {
            padding-inline-start: 24px;

            li {
                padding: 2px 0;
                list-style-type: disc;
            }
        }

        table {
            border-collapse: collapse;
            // border-spacing: 0;
            box-sizing: border-box;

            thead {
                th {
                    font-weight: bold;
                }
            }

            tr {
                border-bottom: 1px solid var(--background-secondary);
            }

            td, th {
                padding: 8px 12px;
                border-right: 1px solid var(--background-secondary);

                &:last-child {
                    border-right: 0;
                }
            }

            td {
                text-align: left !important;
            }
        }
    }
}

</style>