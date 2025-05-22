// postcss.config.js
module.exports = {
    plugins: {
        // @tailwindcss/postcss is managed by @nuxtjs/tailwindcss module
        // So you typically don't need to add it here.
        // If you did, it would be:
        // '@tailwindcss/postcss': {},

        'postcss-import': {}, // Example of another PostCSS plugin
        'autoprefixer': {}, // Autoprefixer is often included here or by Nuxt
        // Add other PostCSS plugins as needed
    },
};