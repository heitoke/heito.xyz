import $api, { DocumentationAPI } from '../';

const docs = new DocumentationAPI('blogs', {
    path: '/blogs',
    label: 'Blogs',
    icon: 'quill',
    version: 'disabled'
});

export interface IBlog {
    _id: string;
}

class Route {
    constructor() {}
}

export default new Route();