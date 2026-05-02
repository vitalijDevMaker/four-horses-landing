import { defineConfig } from 'vite'

const repositoryName = 'four-horses-landing'

export default defineConfig({
	base: process.env.GITHUB_PAGES === 'true' ? `/${repositoryName}/` : '/',
})
