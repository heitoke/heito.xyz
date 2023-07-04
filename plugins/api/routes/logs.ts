import { DocumentationAPI } from '../';


const docs = new DocumentationAPI('logs', {
    path: '/logs',
    label: 'Logs',
    icon: 'book',
    version: 'disabled'
});


class Route {
    constructor() {}
}

export default new Route();