import { defineConfig } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'
import { parse } from 'es-module-lexer'
import { fileURLToPath } from 'node:url';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';


const clientManifest = {};

const rootUrl = new URL('.', import.meta.url);


function getRelativePath(absolutePath) {
    return relative(fileURLToPath(rootUrl), absolutePath);
}

function getAbsolutePath(relativePath) {
    return fileURLToPath(new URL(relativePath, rootUrl));
}

function getBuildOutputDirectory() {
    return fileURLToPath(new URL('dist', rootUrl));
}

async function writeFileWithMkdir(path, data, options) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, data, options);
}

export default defineConfig(({ isSsrBuild }) => {
    return {
        optimizeDeps: { exclude: ["fsevents"] },
        build: {
            // ssr: './src/server.tsx',
            manifest: true,
            rollupOptions: {
                input: ['/src/components/ClientComponent.tsx'],
            },
            emptyOutDir: false,
        },
        server: {
            hmr: true,
        },
        plugins: [
            react(),
            ...(isSsrBuild ? [externalizeDeps()] : []),
            Inspect(),
            {
                name: "vite-extract-client-components",
                async transform(code, id) {

                    const isClientComponent = code.startsWith(`"use client"`) || code.startsWith(`'use client'`)

                    if (isClientComponent) {
                        const [, exports] = parse(code);

                        const fileRelativePath = getRelativePath(id);
                        const jsFilePath = fileRelativePath.replace(extname(fileRelativePath), '.js');
                        const pathWithoutSrc = jsFilePath.replace(/^src\//, '');
                        const outputFilePath = join(getBuildOutputDirectory(), pathWithoutSrc);

                        let newCode = code;

                        for (const exp of exports) {
                            const key = `${id}${exp.n}`
                            clientManifest[key] = {
                                id: resolve('/', fileRelativePath),
                                name: exp.n,
                                chunks: [],
                                async: true
                            }
                            newCode += `${exp.ln}.$$typeof = Symbol.for('react.client.reference');\n${exp.ln}.$$id = ${JSON.stringify(key)};`
                        }
                        return newCode;
                    }
                },

                async closeBundle() {
                    const clientManifestPath = resolve(getBuildOutputDirectory(), 'react-client-manifest.json');
                    await writeFileWithMkdir(clientManifestPath, JSON.stringify(clientManifest), 'utf-8');
                    console.log('Writing client manifest map to', clientManifestPath)
                }
            }
        ]
    }
});