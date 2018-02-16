const browserSync = require('browser-sync')

browserSync({
  open: false,
  logLevel: "debug",
  logFileChanges: true,
  reloadDelay: 200,
  reloadDebounce: 500,
  files: [
    'examples/nested/dist/bundle.js', 'examples/nested/dist/index.css', 'examples/nested/index.html',
    'examples/nested/dist/mo-vue-dnd.css'
  ],
  watchOptions: {ignored: 'node_modules'},
  server: {baseDir: './', directory: true}
});
