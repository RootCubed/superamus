import adapter from "@sveltejs/adapter-static";

const BASE_URL = process.env.BASE_URL || "";

export default {
	kit: {
		adapter: adapter(),
		paths: {
			base: BASE_URL
		}
	}
};
