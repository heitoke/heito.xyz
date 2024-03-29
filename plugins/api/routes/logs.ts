import { type IAPI } from '../';

import { DocumentationAPI } from '~/libs/docs';


const docs = new DocumentationAPI('logs', {
    path: '/logs',
    label: 'Logs',
    icon: 'book',
    version: 'disabled'
});


export default class Route {
    private $api: IAPI;

    constructor(api: IAPI) {
        this.$api = api;
    }
}