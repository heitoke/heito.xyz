import $api, { descriptors } from '../';

export interface IBlog {
    _id: string;
}

@descriptors.addCategory({
    label: 'Blogs',
    name: 'blogs',
    icon: 'quill',
    path: '/blogs',
    version: 'disabled'
})
class Route {
    constructor() {}
}

export default new Route();