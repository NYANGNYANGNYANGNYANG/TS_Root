// tailwind.config.js

module.exports = {

	content: [
		"./src/app/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",

	],
	
	theme: {
		extend: {},
	},
	
	plugins: [],

	safelist: [
    		{ pattern: /^line-clamp-2$/ },
  	],
}
