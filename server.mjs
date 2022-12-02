import fs from 'fs';
import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { listen } from 'listhen';
import sirv from 'sirv';

import {fileURLToPath} from "url";
import helmet from 'helmet';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DEV_ENV = 'development';

const bootstrap = async () => {
    const app = express()

    let vite;

    if (process.env.NODE_ENV === DEV_ENV) {
        vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'custom',
        });

        app.use(vite.middlewares)
    } else {
        app.use(sirv('dist/client', {
            gzip: true,
        }));
    }

    app.use(helmet())

    app.use("/", express.static(path.join(__dirname, "dist"), {
        immutable: true,
        maxAge: '86000'
    }));

    app.get("*", async (req, res, next) => {
        const url = req.originalUrl
        let template, render;

        try {
            if (process.env.NODE_ENV === DEV_ENV) {
                template = fs.readFileSync(path.resolve(__dirname, './index.html'), "utf-8");

                template = await vite.transformIndexHtml(url, template);

                render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
            } else {
                template = fs.readFileSync(
                    path.resolve("dist/client/index.html"),
                    "utf-8"
                );
                render = (await import("./dist/server/entry-server.js")).render;
            }

            const appHtml = await render({ path: url });

            const html = template.replace('<!--ssr-outlet-->', appHtml);

            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html").end(html)
        } catch (error) {
            vite.ssrFixStacktrace(error);
            next(error)
        }
    });
    return { app }
};

bootstrap()
    .then(async ({ app }) => await listen(app, { port: process.env.PORT || 3011 }))
    .catch(console.error)

export {}