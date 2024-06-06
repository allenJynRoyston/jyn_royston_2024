import adapter from 'sveltekit-adapter-deno';
import preprocess from "svelte-preprocess";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [preprocess(), vitePreprocess()],

	kit: {
		adapter: adapter(),
		alias: {
      $components: "src/components",
    },
	}
};

export default config;
