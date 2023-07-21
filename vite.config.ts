/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";

const projectRootDir = path.resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        https: false,
        proxy: {
            "/search": {
                target: "https://www.wowhead.com/classic",
                changeOrigin: true
            }
        }
    },
    test: {
        include: [
            "./test/**/*.test.ts"
        ]
    }
});
