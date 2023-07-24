<template>
    <div class="page-comments">
        <Transition name="opacity">
            <div class="area" v-if="comments.getStatus === 'create'"
                @click="clickNewComment"
            >
                <Button @click.prevent.stop="comments.setStatus(false)">
                    Close
                </Button>
            </div>
        </Transition>

        <div class="comments" v-if="isVisible">
            <TransitionGroup name="opacity">
                <Point v-for="(point, idx) of getListComments" :key="idx"
                    :comments="point.comments"
                    :x="point.x"
                    :y="point.y"
                    :style="{
                        top: point.y + '%',
                        left: point.x + '%'
                    }"
                    @delete="deleteComment(point, $event)"
                />
            </TransitionGroup>
        </div>
    </div>
</template>

<script lang="ts" setup>

import type { IComment, TCommentCreate } from '~/types/api/comments';

import Point from './Point.vue';

interface Point {
    x: number;
    y: number;
    comments: Array<IComment>;
}


const { $api, $win, $socket } = useNuxtApp();

const route = useRoute();

const
    user = useUserStore(),
    contextMenu = useContextMenuStore(),
    comments = usePageCommentsStore();


const uploading = ref<boolean>(false);


const getSizeCell = computed(() => {
    return [
        Math.floor(100 * 48 / $win.size.width),
        Math.floor(100 * 48 / $win.size.height)
    ];
});

function range(a: number, b: number, range: number) {
    return Math.abs(100 * (a - b) / b) <= range;
}

const getListComments = computed<Array<Point>>(() => {
    let list: Array<Point> = [];

    for (const comment of comments.getComments) {
        const { position, window } = comment;

        const
            x = 100 * position?.x! / window?.width!,
            y = 100 * position?.y! / window?.height!;

        const index = list.findIndex(c => {
            return range(c.x, x, getSizeCell.value[0]) || range(c.y, y, getSizeCell.value[1]);
        });

        if (index < 0) {
            list.push({ x, y, comments: [comment] });
        } else {
            list[index].comments.push(comment);
        }
    }

    return list;
});

const isVisible = computed(() => {
    return comments.getUrl.includes(route.path) && comments.isVisible && comments.getComments.length > 0;
});



watch(() => route.path, (newValue) => {
    if (comments.getUrl.includes(newValue)) return;

    comments.setUrl(newValue);
});

watch(() => comments.getUrl, (newValue, oldValue) => {
    if (oldValue) {
        for (let path of oldValue) {
            $socket.off(`comments:upload:${path}`);
        }
    }
    
    for (let path of newValue) {
        $socket.on(`comments:upload:${path}`, (comment: IComment) => {
            console.log(comment);
            
            comments.addComment(comment);
        });
    }
});



async function createComment(body: TCommentCreate) {
    uploading.value = true;

    const [result, status] = await $api.comments.create(body);

    if (status !== 200) return console.log(result);

    comments.setStatus(false);
    
    uploading.value = false;

    comments.addComment({
        ...result,
        user: user.getUser
    });
}

function clickNewComment(event: MouseEvent) {
    if (uploading.value) return;

    let content = '';

    contextMenu.create({
        name: 'comments:page:create',
        position: ['bottom', 'right'],
        items: [
            {
                type: 'component',
                name: 'content',
                component: 'Textbox',
                props: {
                    type: 'area',
                    label: 'Content'
                },
                events: {
                    input: (event: InputEvent) => {
                        content = (event.target as any).value;
                    }
                }
            },
            {
                type: 'component',
                name: 'button',
                component: 'Button',
                style: 'margin: 8px 0 0 0',
                // slot: 'Create page comment',
                events: {
                    click: async () => {
                        const scrollbarContent = document.querySelector('.page')!.closest('div[scrollbar-content]')!;
                        
                        createComment({
                            url: route.path,
                            content,
                            window: {
                                width: scrollbarContent?.scrollWidth,
                                height: scrollbarContent?.scrollHeight
                            },
                            position: {
                                x: event.x,
                                y: (event as any).layerY
                            }
                        });

                        contextMenu.close();
                    }
                }
            }
        ]
    });
}

function deleteComment(point: Point, commentId: string) {
    comments.remove(commentId);
}

</script>

<style lang="scss" scoped>

.opacity-enter-active,
.opacity-leave-active {
    transition: .2s;
    opacity: 0;
}

.page-comments {
    pointer-events: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    .area {
        pointer-events: all;
        width: 100%;
        height: 100%;
        position: relative;
        background-color: #00000095;
        transition: .2s;
        z-index: 6;

        .ui-button {
            width: max-content;
            pointer-events: all;
            position: absolute;
            top: 72px;
            right: 12px;
        }
    }

    .comments {
        .point {
            pointer-events: all;
            position: absolute;
        }
    }
}

</style>