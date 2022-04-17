<template>
    <li class="project-repo">
        <!-- {{ data }} -->
        <div class="header">
            <div class="title" @click="redirect(data?.html_url, true, true)">
                <img :src="data?.owner?.avatar_url">
                <span>{{ data?.owner?.login }}/</span>
                <span>{{ data?.name }}</span>
            </div>
            <ul class="menu">
                <li v-if="data?.forks_count > 0">
                    <span>{{ data?.forks_count }}</span>
                    <i class="uil uil-code-branch"></i>
                </li>
                <li v-if="data?.stargazers_count > 0">
                    <span>{{ data?.stargazers_count }}</span>
                    <i class="uil uil-star"></i>
                </li>
                <li class="lang" v-if="data?.language"
                    @mouseenter="openContextMenu([$event, `toolpic:repo:${data?.name}:lang`, 'top center-x fixed hover'])"
                    @mouseleave="closeContextMenu()"
                >
                    <img :src="`https://img.shields.io/badge/-34333a.svg?style=flat-square&logo=${getLang(data?.language)}`" @error="imgError = true">
                    <ContextMenu :name="`toolpic:repo:${data?.name}:lang`" class="toolpic"><p>{{ data?.language }}</p></ContextMenu>
                </li>
                <li v-if="data?.homepage"
                    @mouseenter="openContextMenu([$event, `toolpic:repo:${data?.name}:homepage`, 'top center-x fixed hover'])"
                    @mouseleave="closeContextMenu()"
                    @click="redirect(data?.homepage, true, true)"
                    style="cursor: pointer;"
                >
                    <i class="uil uil-link-alt"></i>
                    <ContextMenu :name="`toolpic:repo:${data?.name}:homepage`" class="toolpic"><p>{{ data?.homepage.replace(/(^\w+:|^)\/\//, '') }}</p></ContextMenu>
                </li>
            </ul>
        </div>
        <div class="description">{{ data?.description }}</div>
        <ul class="tags">
            <ul class="tags" v-if="data?.topics?.length > 0">
                <li v-for="tag of data?.topics" :key="tag">
                    <i class="uil uil-tag-alt"></i>
                    <span>{{ tag }}</span>
                </li>
            </ul>
        </ul>
        <div class="footer">
            <div v-for="(stat, idx) of createFooter()" :key="(stat, idx)"
                :style="stat?.click ? `cursor: pointer;` : null"
                @mouseenter="openContextMenu([$event, `toolpic:repo:footer:${idx}:${stat.title}`, 'top center-x fixed hover'])"
                @mouseleave="closeContextMenu()"
                @click="stat?.click ? stat.click() : null"
            >
                <i :class="stat.icon"></i>
                <span>{{ stat.value }}</span>
                <ContextMenu :name="`toolpic:repo:footer:${idx}:${stat.title}`" class="toolpic"><p>{{ stat.title }}</p></ContextMenu>
            </div>
        </div>
    </li>
</template>

<script>

export default {
    name: 'ProjectRepo',
    components: {},
    computed: {},
    props: {
        data: { type: Object }
    },
    data() {
        return {
            imgError: false,
            languages: {
                'css': 'css3',
                'scss': 'sass',
                'html': 'html5',
                'vim script': 'vim',
                'vue': 'vue.js'
            }
        }
    },
    methods: {
        getLang(language) {
            let lang = language.toLowerCase();
            return this.languages[lang] || lang;
        },
        createFooter() {
            let footer = [];
            if (this.data?.license) footer = [...footer, { title: 'License', value: this.data?.license?.url ? this.data?.license?.name.replace(' License', '') : 'No Assertion', icon: 'uil uil-balance-scale', click: this.data?.license?.url ? () => this.redirect(`https://choosealicense.com/licenses/${this.data?.license?.key}`, true, true) : null }];
            footer = [...footer, { title: 'Date created', value: this.timeago(this.data?.created_at), icon: 'uil uil-clock' }];
            return footer;
        }
    },
    mounted() {}
}
</script>

<style lang="scss">

.project-repo {
    padding: 12px;
    min-height: 128px;
    border-radius: 5px;
    border: 1px solid var(--dimming);
    transition: .2s;

    &:hover {
        border: 1px solid var(--bg-2);
        box-shadow: 0 0 5px 2px var(--bg-2);
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .title {
            cursor: pointer;
            display: flex;
            max-width: 70%;
            font-size: 14px;
            font-weight: 700;
            align-items: center;

            &:hover {
                text-decoration: underline;

                span:nth-child(2) {
                    text-decoration: underline var(--color-3);
                }
            }

            img {
                margin: 0 8px 0 0;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                object-fit: cover;
                object-position: 50% 50%;
            }

            span {
                &:nth-child(2) {
                    color: var(--color-3);
                    font-weight: 500;
                }
                &:nth-child(3) {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }
        }

        .menu {
            display: flex;
            align-items: center;

            li {
                margin: 0 0 0 8px;

                span {
                    margin: 0 4px 0 0;
                    font-size: 14px;

                    & + i {
                        color: var(--color-2);
                    }
                }

                &.lang {
                    img {
                        height: 20px;
                        border-radius: 5px;
                    }
                }

                &:first-child {
                    margin: 0;
                }
            }
        }
    }

    .description {
        margin: 8px 0 0 0;
        color: var(--color-2);
        font-size: 14px;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .tags {
        gap: 4px;

        li {
            font-size: 12px;
            background: var(--dimming);
        }
    }

    .footer {
        display: flex;
        align-items: center;

        div {
            display: flex;
            margin: 0 12px 0 0;
            align-items: center;

            &:last-child {
                margin: 0;
            }

            i {
                margin: 0 8px 0 0;
                color: var(--color-2);
            }

            span {
                font-size: 12px;
            }
        }
    }
}

</style>