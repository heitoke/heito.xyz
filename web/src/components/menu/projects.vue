<template>
    <div class="projects">
        <ul class="list">
            <li v-for="(project, index) of list" :key="(project, index)"
                :class="{ 'project': true, 'active': open === index }"
                @click="open = index"
            >
                <span class="font-5">{{ project.title }}</span>
                <ul class="menu">
                    <label class="checkbox" :ui-title="project.on ? 'Выключить' : 'Включить'">
                        <input type="checkbox" v-model="project.on">
                        <span></span>
                    </label>
                    <li class="remove" ui-title="Удалить" @click="list = list.filter((f, i) => i !== index)">
                        <i class="uil uil-multiply"></i>
                    </li>
                </ul>
            </li>
            <div class="add-button" @click="list.push({ on: true, type: 'personal', checkboxs: [], links: [], users: [] })">Добавить</div>
        </ul>
        <div class="setting" v-if="open !== false">
            <div class="projects-list">
                <ProjectCard :project="list[open]"/>
            </div>
            <div class="params">
                <div class="param textbox">
                    <div class="subtitle">Заголовок</div>
                    <input type="text" v-model="list[open].title">
                </div>
                <div class="param textbox">
                    <div class="subtitle">Описание</div>
                    <input type="text" v-model="list[open].text">
                </div>
                <div class="param textbox image">
                    <div class="subtitle">Баннер</div>
                    <input type="text" v-model="list[open].image">
                </div>
                <div class="param">
                    <div class="subtitle">Пункты</div>
                    <div class="radios">
                        <label class="radio" @click="list[open].type = 'personal'">
                            <input type="radio" name="project-type" :checked="list[open].type === 'personal'">
                            <span></span>
                            Личный
                        </label>
                        <label class="radio" @click="list[open].type = 'joint'">
                            <input type="radio" name="project-type" :checked="list[open].type === 'joint'">
                            <span></span>
                            Совместный
                        </label>
                    </div>
                </div>
                <div class="param">
                    <div class="subtitle">Пункты</div>
                    <ul class="checkboxs">
                        <li class="textbox" v-for="(box, idx) of list[open].checkboxs" :key="(box, idx)">
                            <input type="text" placeholder="Пункт" v-model="box.name">
                            <div class="remove" ui-title="Удалить" @click="list[open].checkboxs = list[open].checkboxs.filter((f, i) => i !== idx)">
                                <i class="uil uil-multiply"></i>
                            </div>
                        </li>
                    </ul>
                    <div class="add-button" @click="list[open].checkboxs.push({ name: '' })">Добавить</div>
                </div>
                <div class="param joint-users" v-if="list[open].type === 'joint'">
                    <div class="subtitle">Люди которые помогают по проекту (только если совместный тип)</div>
                    <ul class="users">
                        <li class="textbox" v-for="(user, idx) of list[open].users" :key="(user, idx)">
                            <input type="text" placeholder="Ник" v-model="user.name">
                            <input type="text" placeholder="Аватарка" v-model="user.img">
                            <input type="text" placeholder="Ссылка" v-model="user.url">
                            <div class="remove" ui-title="Удалить" @click="list[open].users = list[open].users.filter((f, i) => i !== idx)">
                                <i class="uil uil-multiply"></i>
                            </div>
                        </li>
                    </ul>
                    <div class="add-button" @click="list[open].users.push({ name: '', img: '', url: '' })">Добавить</div>
                </div>
                <div class="param links">
                    <div class="subtitle">Ссылки на проект</div>
                    <ul class="links-list">
                        <li class="textbox" v-for="(link, idx) of list[open].links" :key="(link, idx)">
                            <input type="text" placeholder="Название ссылки" v-model="link.label">
                            <input type="text" placeholder="Иконка" v-model="link.icon">
                            <input type="text" placeholder="Ссылка" v-model="link.url">
                            <div class="remove" ui-title="Удалить" @click="list[open].links = list[open].links.filter((f, i) => i !== idx)">
                                <i class="uil uil-multiply"></i>
                            </div>
                        </li>
                    </ul>
                    <div class="add-button" @click="list[open].links.push({ label: '', icon: 'uil uil-link', url: '' })">Добавить</div>
                </div>
            </div>
            <div class="save" @click="saveProjects()">Сохранить</div>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

import ProjectCard from '../project-card.vue'

export default {
    name: 'BlockMenuProjects',
    props: {},
    computed: mapGetters(['']),
    components: { ProjectCard },
    data() {
        return {
            open: false,
            list: []
        }
    },
    methods: {
        saveProjects() {
            this.postFetch('/projects', this.list);
        }
    },
    async mounted() {
        this.list = await this.postFetch('/projects');
    }
}

</script>

<style lang="scss">

.page.cms-menu .blocks .projects {
    display: flex;

    .add-button {
        cursor: pointer;
        margin: 4px 0 0 0;
        padding: 6px 12px;
        width: 96px;
        color: var(--bg);
        text-align: center;
        background: var(--color);
    }

    .list {
        min-width: 376px;

        .project {
            cursor: pointer;
            display: flex;
            margin: 8px 0 0 0;
            padding: 6px 12px;
            align-items: center;
            justify-content: space-between;
            border: 1px solid var(--T);
            background: var(--bg-2);

            &.active {
                border: 1px solid var(--color);
            }

            span {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .menu {
                display: flex;
                align-items: center;

                .checkbox {
                    margin: 0 4px 0 0;
                }

                .checkbox span {
                    width: 8px;
                    height: 8px;
                }

                .remove {
                    cursor: pointer;
                    color: var(--C5);
                }
            }
        }
    }

    .setting {
        margin: 0 0 0 32px;
        width: 90%;
        background: var(--bg-2);
        
        .params {
            display: grid;
            grid-template-columns: 1fr 1fr;

            .param {
                margin: 0 8px;
            }

            .joint-users, .checkboxs, .links {
                // grid-area: 2/2;
                grid-column: 1/3;

                .textbox {
                    display: flex;
                    margin: 0 0 4px 0;

                    input {
                        margin: 0 8px 0 0;
                        padding: 5px 8px;
                        font-size: 13px;
                    }

                    .remove {
                        cursor: pointer;
                        min-width: 24px;
                        min-height: 24px;
                        color: var(--bg);
                        font-size: 12px;
                        text-align: center;
                        line-height: 24px;
                        background: var(--color);
                    }
                }
            }

            .image {
                grid-column: 1/3;
            }
            
            .textbox {
                input {
                    padding: 6px 12px;
                    width: calc(100% - 24px);
                    color: var(--color);
                    font-size: 14px;
                    border-bottom: 1px solid var(--color);
                    background: var(--T);
                }
            }

            .radios {
                display: flex;
            }

            .subtitle {
                margin: 6px 0 2px 0;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
            }
        }
    }

    .save {
        cursor: pointer;
        margin: 12px 8px;
        padding: 8px 16px;
        width: 96px;
        color: var(--bg);
        text-align: center;
        background: var(--color);
        user-select: none;

        &:active {
            transform: scale(.8);
        }
    }

}

</style>
