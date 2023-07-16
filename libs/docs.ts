import type { ICategory, ICategoryOptions, IRoute } from '~/types/api';

export let categories: Array<ICategory> = [];

export class DocumentationAPI {
    readonly name: string;
    readonly options: ICategoryOptions;

    constructor(name: string, options: ICategoryOptions) {
        this.name = name;
        this.options = options;

        this.initCategory();
    }

    private initCategory() {
        if (!this.name || categories.find(c => c.name === this.name)) return;

        categories = [...categories || [], {
            version: 'stable',
            ...this.options,
            name: this.name,
            routes: []
        }];
    }

    route(route: IRoute) {
        const name = this.name;

        return function(target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
            const categoryIndex = categories?.findIndex(c => c?.name === name);

            if (categoryIndex < 0) return;

            categories[categoryIndex].routes = [
                ...categories[categoryIndex].routes || [],
                {
                    path: ``,
                    method: 'GET',
                    ...route
                }
            ];
        };
    }
}