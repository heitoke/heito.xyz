// ? Node.js utility
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ? Vite
import { createServer } from 'vite';

// ? Express
import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

console.log(import.meta);


const
    isProd: boolean = false,
    PORT: number = 3000,
    __dirname: string = path.dirname(fileURLToPath(import.meta.url));

function resolve(p: string): string {
    return path.resolve(__dirname, p);
}

async function getIndexHTML() {
    let indexHTML: string = isProd ? resolve('../../dist/client/index.html') : resolve('../../index.html'),
        html: string = await fs.promises.readFile(indexHTML, 'utf-8');
    
    return html;
}

async function start() {
    const
        manifest = isProd ? JSON.parse(fs.readFileSync(resolve('../../dist/client/ssr-manifest.json'), 'utf-8')) : null,
        app = express();
    
    if (isProd) app.use(express.static('dist/client', { index: false }));
    else {
        var vite = await createServer({
            root: process.cwd(),
            server: { middlewareMode: true },
            appType: 'custom'
        })

        app.use(vite.middlewares);
    }

    app.use('*', async (req, res, next) => {
        try {
            let url = req.url,
                template = await getIndexHTML(),
                render = null;

            // @ts-ignore
            if (isProd) render = await (await import('../../dist/server/entry.ts')).render;
            else {
                template = await vite.transformIndexHtml(url, template);
                render = (await vite.ssrLoadModule(resolve('./entry.ts'))).render;
            }
            
            let [appHtml, preloadLinks, meta] = await render(url, manifest),
                html = template
                    .replace(`<!--preload-links-->`, preloadLinks)
                    .replace('<!--app-html-->', appHtml)
                    .replace('<!--meta-->', meta.toHtml());

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (err) {
            if (vite) vite.ssrFixStacktrace(err as Error);
            next(err);
        }
    });
    
    app.listen(PORT, () => {
        console.log(`Server start -> http://localhost:${PORT}`);
    });
}

start();