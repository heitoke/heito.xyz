import { defineStore, acceptHMRUpdate } from 'pinia';

import type { IComment } from 'types/api/comments';

type Status = 'create' | false;

export const usePageCommentsStore = defineStore('page-comments', {
    state: () => ({
        url: [] as Array<string>,
        visible: false,
        list: [] as Array<IComment>,
        status: false as Status
    }),
    actions: {
        setStatus(status: Status){
            this.status = status;
        },
        setVisible(boolean: boolean) {
            this.visible = boolean;
        },
        setUrl(url: string | Array<string>) {
            this.url = typeof url === 'string' ? [url] : url;
        },
        setComments(comments: Array<IComment>) {
            this.list = comments;
        },
        addComment(...comments: Array<IComment>) {
            this.list.push(...comments);
        },
        remove(...comments: Array<string>) {
            console.log(comments);
            
            for (const id of comments.filter(id => this.list.find(c => c._id === id))) {
                const index = this.list.findIndex(comment => comment._id === id);

                this.list.splice(index, 1);
            }
        }
    },
    getters: {
        getComments(state): Array<IComment> {
            return state.list;
        },
        getUrl(state): Array<string> {
            return state.url;
        },
        getStatus(state): Status {
            return state.status;
        },
        isVisible(state): boolean {
            return state.visible;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePageCommentsStore, import.meta.hot));
}