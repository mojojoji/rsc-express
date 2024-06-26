import esbuild from "esbuild";
import { stat, readdir, readFile } from "fs/promises";
import path from "path";
import { spawn } from "child_process";

// Define the folder containing the JS files
const inputFolder = './src'; // Change this to your folder path

// Function to get all files in a folder
async function getFiles(dir, fileList = []) {
    const files = await readdir(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const fileStat = await stat(filePath);
        if (fileStat.isDirectory()) {
            await getFiles(filePath, fileList);
        } else if (['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(filePath))) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const files = await getFiles(inputFolder);
console.log(files);
const args = ["--conditions", "react-server", "dist/server"];
let nodeProcess = spawn('node', args, {
    stdio: 'inherit',
});

let ctx = await esbuild.context({
    entryPoints: files,
    outdir: "./dist/server",
    // packages: "external",
    plugins: [{
        name: 'rebuild-notify',
        setup(build) {
            build.onResolve({ filter: /.*/ }, async (args) => {
                console.log(`rebuilding ${args.path}`);
                const contents = await readFile(args.path, 'utf-8');
                if (contents.startsWith("'use client'") || contents.startsWith('"use client"')) {
                    return null;
                }
            });
            build.onEnd(result => {
                console.log(`build ended with ${result.errors.length} errors`);
                nodeProcess.kill('SIGINT');
                nodeProcess = spawn('node', args, {
                    stdio: 'inherit',
                });
                // HERE: somehow restart the server from here, e.g., by sending a signal that you trap and react to inside the server.
            })
        },
    }],
});
await ctx.watch();
console.log('Watching...');