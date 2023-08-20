/// <reference types="vitest" />
import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const isProd = env.NODE_ENV === "production";
    return {
        base: "/classic-leveling-guide/",
        build: {
            minify: isProd ? "terser" : "esbuild",
            reportCompressedSize: true,
            rollupOptions: {
                manualChunks(id: string) {
                    if (id.includes(".json")) {
                        return id.split(".json")[0].split("/").pop();
                    }
                }
            }
            
        },
        preview: {
            host: true,
            https: false
        },
        plugins: [react()],
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
