const browserSync = require('browser-sync')

browserSync({
  open: false,
  logLevel: "debug",
  logFileChanges: true,
  reloadDelay: 200,
  reloadDebounce: 500,
  files: [
    'exmaples/**/*.js', 'exmaples/**/*.css', 'exmaples/**/*.html',
    'src/**/*.js', 'dist/mo-vue-dnd.css'
  ],
  watchOptions: {ignored: 'node_modules'},
  server: {baseDir: './', directory: true}
});
