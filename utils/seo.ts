type TwitterCard = 'app' | 'summary_large_image' | 'summary' | 'player';

interface SEOTemplateOptions {
    title: string;
    description?: string;
    image?: string;
    color?: string;
    twitterCard?: TwitterCard;
}

class SEO {
    constructor() {}

    createTemplate(options: SEOTemplateOptions) {
        const {
            title,
            description = '',
            image = '',
            color = '',
            twitterCard = 'summary_large_image'
        } = options;
    
        return {
            title,
            ogTitle: title,
            twitterTitle: title,
            ogImage: image,
            twitterImage : image,
            description,
            ogDescription: description,
            twitterDescription: description,
            colorScheme: color,
            themeColor: color,
            twitterCard
        }
    }
}

export const seo = new SEO();