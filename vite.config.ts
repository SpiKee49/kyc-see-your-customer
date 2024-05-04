import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import basicSsl from "@vitejs/plugin-basic-ssl"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), basicSsl()],
    resolve: {
        alias: {
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@utils": path.resolve(__dirname, "./src/utils")
        }
    }
})
