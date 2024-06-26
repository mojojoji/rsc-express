import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

// Define the folder containing the JS files
const inputFolder = './src'; // Change this to your folder path

// Function to get all files in a folder
function getFiles(dir, fileList = []) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else if (['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(filePath))) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const files = getFiles(inputFolder);

const args = ["--conditions", "react-server", "dist/server"];
let nodeProcess = spawn('node', args, {
    stdio: 'inherit',
});

let ctx = await esbuild.context({
    entryPoints: files,
    outdir: "./dist/server",
    plugins: [{
        name: 'rebuild-notify',
        setup(build) {
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