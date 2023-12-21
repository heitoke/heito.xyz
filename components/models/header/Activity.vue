<template>
    <div :class="['activity', content.type]">
        <div class="header">
            <div class="previews">
                <div :class="['large', largePreview.type, { s: smallPreview !== null }]" v-if="largePreview">
                    <template v-if="largePreview.type === 'image'">
                        <img :src="largePreview.url" alt="Large Activity Image">
                    </template>

                    <template v-else-if="largePreview.type === 'icon'">
                        <Icon :name="largePreview.icon"
                            :style="{ '--color': largePreview?.color || 'var(--main-color)' }"
                        />
                    </template>
                </div>
            
                <div :class="['small', smallPreview.type]" v-if="smallPreview">
                    <template v-if="smallPreview.type === 'image'">
                        <img :src="smallPreview.url" alt="Small Activity Image">
                    </template>

                    <template v-else-if="smallPreview.type === 'icon'">
                        <Icon :name="smallPreview.icon"
                            :style="{ '--color': smallPreview?.color || 'var(--main-color)' }"
                        />
                    </template>
                </div>
            </div>

            <div class="content">
                <div class="label">{{ content.name }}</div>

                <div class="details">{{ content.details }}</div>

                <div class="state" v-if="content.type !== 'mini'">{{ content.state }}</div>

            </div>
        </div>

        <div class="progress" v-if="content.progress">
            <span>{{ getProgressBar.start }}</span>

            <div class="bar">
                <div :style="{ width: `${getProgressBar.width}%` }"></div>
            </div>

            <span>{{ getProgressBar.end }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>

type TypeActivity = 'default' | 'mini';

type TypeProgress = 'time' | 'percentages' | 'numbers';

type TypePreview = 'image' | 'icon';

interface PreviewTemplate<Type = TypePreview> {
    type: Type;
    label?: string;
}

interface ImagePreview extends PreviewTemplate<'image'> {
    url: string;
}

interface IconPreview extends PreviewTemplate<'icon'> {
    icon: string;
    color?: string;
}

type Preview = ImagePreview | IconPreview;

interface Button {}

interface Progress {
    type?: TypeProgress;
    value?: number;
    end?: number;
}

export interface Activity {
    id?: string;
    type: TypeActivity;
    name: string;
    details?: string;
    state?: string;
    largePreview?: Preview;
    smallPreview?: Preview;
    buttons?: Array<Button>;
    progress?: Progress;
}


const props = defineProps<{
    content: Activity;
    showButtons?: boolean;
}>();



const getProgressBar = computed(() => {
    const { type, value, end } = props.content.progress!;

    return {
        start: progressValue(type!, value!),
        width: per(value!, end!),
        end: progressValue(type!, end!)
    }
});

const largePreview = computed(() => {
    if (!props.content?.largePreview) return null;

    return props.content.largePreview;
});

const smallPreview = computed(() => {
    if (!props.content?.smallPreview) return null;

    return props.content.smallPreview;
});


function per(a: number, b: number) {
    return a / b * 100;
}

function progressValue(type: TypeProgress, value: number) {
    switch(type) {
        case 'time':
            return msInMin(value);
            break;

        case 'numbers':
            return String(value);
            break;

        case 'percentages':
            return `${value}%`;
            break;
    }
}

function msInMin(ms: number) {
    let min = Math.floor((ms / 1000 / 60) << 0),
        sec = Math.floor((ms / 1000) % 60);

    return `${min}:${`${sec}`.length < 2 ? `0${sec}` : sec}`;
}

</script>

<style lang="scss" scoped>

.activity {
    min-width: 256px;

    &.mini {
        .header {
            .previews {
                .large {
                    max-width: 42px;
                    min-width: 42px;
                    max-height: 42px;
                    min-height: 42px;

                    &.s {
                        mask-image: radial-gradient(circle 12px at center, transparent 100%, green 0%);
                        mask-size: 76px 76px, 100%;
                    }

                    .ui-icon {
                        height: 42px;
                    }
                }

                .small {
                    max-width: 20px;
                    min-width: 20px;
                    max-height: 20px;
                    min-height: 20px;

                    .ui-icon {
                        height: 20px;
                        font-size: 12px;
                    }
                }
            }
        }
    }

    .header {
        display: flex;
        align-items: center;

        .previews {
            margin-right: 8px;
            position: relative;

            .large,
            .small {
                position: relative;
                overflow: hidden;
            }

            .large {
                max-width: 64px;
                min-width: 64px;
                max-height: 64px;
                min-height: 64px;
                border-radius: 5px;

                &.s {
                    mask-image: radial-gradient(circle 14px at center, transparent 100%, green 0%);
                    mask-size: 116px 116px, 100%;
                }

                img {
                    width: 100%;
                    height: 100%;
                }

                .ui-icon {
                    height: 64px;
                    font-size: 24px;
                }
            }

            .small {
                max-width: 24px;
                min-width: 24px;
                max-height: 24px;
                min-height: 24px;
                position: absolute;
                right: -6px;
                bottom: -6px;
                border-radius: 50%;

                .ui-icon {
                    height: 24px;
                    font-size: 14px;
                }
            }

            img {
                background-color: var(--background-secondary);
                transition: .2s;
            }

            .ui-icon {
                display: flex;
                width: 100%;
                color: var(--color);
                align-items: center;
                justify-content: center;
                z-index: 2;

                &::before {
                    z-index: 2;
                }

                &::after {
                    content: "";
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    background-color: var(--color);
                    opacity: .3;
                    z-index: 1;
                }
            }
        }

        .images {
            display: flex;
            margin-right: 8px;
            position: relative;

            .large,
            .small {
                background-color: var(--background-secondary);
                transition: .2s;
            }

            .large {
                max-width: 64px;
                min-width: 64px;
                max-height: 64px;
                min-height: 64px;
                border-radius: 5px;
            }
        
            .small {
                width: 24px;
                height: 24px;
                position: absolute;
                top: -6px;
                left: -6px;
                border-radius: 50%;
            }
        }

        .content {
            max-width: 100%;
            min-width: 0;
            flex: 1;

            .label,
            .details,
            .state {
                max-width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            .label {
                font-weight: 600;
            }

            .details,
            .state {
                font-size: 12px;
            }

            .state {
                color: var(--text-secondary);
            }
        }
    }

    .progress {
        display: flex;
        margin-top: 4px;
        align-items: center;

        span {
            color: var(--text-secondary);
            font-size: 12px;
        }

        .bar {
            margin: 0 8px;
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
                background-color: var(--main-color);
                transition: .2s;
            }
        }
    }
}

</style>