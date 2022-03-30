const mix = require('laravel-mix');
const path = require('path');

mix
    .js(
        path.join('src/resources/js/app.js'),
        path.join('src/public/js/app.js')
    )
    .sass(
        path.join('src/resources/scss/style.scss'),
        path.join('src/public/css/style.css')
    )
    .options({
    autoprefixer: { remove: false }
});