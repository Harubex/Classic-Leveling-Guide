/// <reference types="vitest" />
import path from "path";
import { defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const isProd = env.NODE_ENV === "production";
    return {
        build: {
            minify: isProd ? "terser" : "esbuild",
            reportCompressedSize: true            
        },
        preview: {
            host: true,
            https: false
        },
        plugins: [react(), viteStaticCopy({
            targets: [{
                src: "./manifest.webmanifest",
                dest: "."
            }]
        }), splitVendorChunkPlugin()],
        resolve: {
            alias: {
                "@shared": path.resolve(__dirname, "../shared")
            }
        },
        server: {
            https: isProd,
            proxy: {
                "/search": {
                    target: "https://www.wowhead.com/classic",
                    changeOrigin: !isProd
                }
            }
        },
        test: {
            include: [
                "./test/**/*.test.ts"
            ]
        }
    };
});
