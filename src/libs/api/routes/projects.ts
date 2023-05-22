import $api, { descriptors } from '../';

export interface IProject {
    _id: string;
}

@descriptors.addCategory({
    label: 'Projects',
    name: 'projects',
    icon: 'images',
    path: '/projects',
    version: 'disabled'
})
class Route {
    constructor() {}
}

export default new Route();