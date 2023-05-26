<template>
    <div :class="['activity', content.type]">
        <header>
            <div class="images">
                <div class="large" v-if="content.largeImage?.url"
                    :style="{ '--image': `url(${content.largeImage?.url})` }"
                    @mouseenter.prevent.stop="content.largeImage?.label ? setToolpic({ text: content.largeImage?.label, event: ($el as Element).querySelector('large') }) : null"
                ></div>
                <div class="small" v-if="content.smallImage?.url || content?.smallImage?.icon"
                    :style="{ '--image': `url(${content.smallImage?.url})` }"
                    @mouseenter.prevent.stop="content.smallImage?.label ? setToolpic({ text: content.smallImage?.label, event: ($el as Element).querySelector('small') }) : null"
                >
                    <Icon :name="content?.smallImage?.icon" v-if="content?.smallImage?.icon"
                        :style="{ color: content?.smallImage?.color }"
                    />
                </div>
            </div>
            <div class="content">
                <Text class="label" :text="content.name"/>
                <Text class="details" :text="content?.details" v-if="content?.details"/>
                <Text class="state" :text="content?.state" v-if="content.type !== 'mini' && content?.state"/>
                
                <div class="progress" v-if="content.progressBar">
                    <span>{{ content.progressBar?.isTime ? getTrackStartInTime : '' }}</span>
                    <div class="bar">
                        <div :style="{ width: `${(content.progressBar?.value || 0) / (content.progressBar?.end || 0) * 100}%` }"></div>
                    </div>
                    <span>{{ content.progressBar?.isTime ? getTrackEndInTime : '' }}</span>
                </div>
            </div>
        </header>
        
        <NavBar style="margin: 8px 0 0 0;" v-if="content?.buttons?.length as number > 0 && showButtons"
            :selected="false"
            :default-id="-1"
            :menu="content.buttons"
            @select="$event?.url ? openUrl($event?.url) : null; $log($event)"    
        />
    </div>
</template>

<script lang="ts" setup>

import NavBar from './NavBar.vue';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { mapActions } from 'vuex';

type TTypeActivity = 'default' | 'mini';

type TLargeImage = {
    url: string;
    label?: string;
}
type TSmallImage = {
    url?: string;
    label?: string;
    icon?: string;
    color?: string;
}

interface IButton {
    label: string;
    icon?: string;
    url?: string;
}

type TProgressBar = {
    value?: number;
    end?: number;
    isTime?: boolean;
}

export interface IContent {
    id?: string;
    type: TTypeActivity;
    name: string;
    details?: string;
    state?: string;
    largeImage?: TLargeImage;
    smallImage?: TSmallImage;
    buttons?: IButton[];
    progressBar?: TProgressBar;
}

export default defineComponent({
    name: 'Activity',
    computed: {
        getTrackStartInTime(): string {
            let value = this.content.progressBar?.value;
            return value ? this.msInMin(value) : '0';  
        },
        getTrackEndInTime(): string {
            let value = this.content.progressBar?.end;
            return value ? this.msInMin(value) : '0';  
        },
    },
    props: {
        content: {
            type: Object as PropType<IContent>,
            default: {}
        },
        showButtons: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
        }
    },
    methods: {
        ...mapActions(['setToolpic']),
        msInMin(ms: number) {
            let min = Math.floor((ms / 1000 / 60) << 0),
            sec = Math.floor((ms / 1000) % 60);
            return `${min}:${`${sec}`.length < 2 ? `0${sec}` : sec}`;
        },
        openUrl(url: string) {
            window.open(url);
        }
    },
    mounted() {}
});

</script>

<style lang="scss" scoped>

.activity {
    min-width: 256px;

    header {
        display: flex;
        align-items: center;

        .images {
            margin: 0 8px 0 0;
            position: relative;

            .large, .small {
                background-size: cover;
                background-position: center;
                background-image: var(--image);
                background-color: var(--background-secondary);
                transition: .2s;
            }

            .large {
                min-width: 64px;
                min-height: 64px;
                border-radius: 5px;
            }

            .small {
                display: flex;
                min-width: 24px;
                min-height: 24px;
                position: absolute;
                right: -6px;
                bottom: -6px;
                border-radius: 50%;
                align-items: center;
                justify-content: center;

                i {
                    font-size: 12px;
                }
            }
        }

        .content {
            max-width: calc(100% - 64px - 8px);
            width: 100%;

            .label, .state, .details {
                max-width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            .label {
                font-weight: 600;
            }

            .details, .state {
                font-size: 12px;
            }

            .state {
                color: var(--text-secondary);
            }
        
            .progress {
                display: flex;
                // margin: 4px 0 0 0;
                align-items: center;

                span {
                    color: var(--text-secondary);
                    font-size: 12px;

                    &:nth-child(1) {
                        margin: 0 8px 0 0;
                    }

                    &:nth-child(3) {
                        margin: 0 0 0 8px;
                    }
                }

                .bar {
                    width: 100%;
                    min-height: 3px;
                    position: relative;
                    border-radius: 5px;
                    background-color: var(--background-secondary);
                    overflow: hidden;

                    div {
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        background: var(--main-color);
                        transition: .2s;
                    }
                }
            }
        }   
    }

    &.mini {
        header {
            .images {
                .large {
                    min-width: 42px;
                    min-height: 42px;
                }

                .small {
                    min-width: 16px;
                    min-height: 16px;
                    right: -4px;
                    bottom: -4px;
                }
            }

            .content {
                max-width: calc(100% - 42px - 8px);
            }
        }
    }

    ul.buttons {
        display: flex;
        margin: 8px 0 0 0;
        align-items: center;

        li {
            cursor: pointer;
            margin: 0 8px 0 0;
            padding: 6px 8px;
            width: 100%;
            text-align: center;
            border-radius: 5px;
            background-color: var(--background-secondary);

            &:last-child {
                margin: 0;
            }

            div {
                font-size: 12px;
            }
        }
    }
}

</style>