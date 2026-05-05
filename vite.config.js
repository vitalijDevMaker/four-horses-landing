// vite.config.js
import imagemin from "unplugin-imagemin/vite";
import { defineConfig } from "vite";

const repositoryName = "four-horses-landing";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? `/${repositoryName}/` : "/",
});
