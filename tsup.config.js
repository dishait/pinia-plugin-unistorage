import { defineConfig } from 'tsup'

export default defineConfig({
	clean: true,
	format: ['cjs', 'esm'],
	entry: ['uni_modules/pinia-plugin-unistorage/index.js']
})
