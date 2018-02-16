const browserSync = require('browser-sync')

browserSync({
  open: false,
  logLevel: "debug",
  logFileChanges: true,
  reloadDelay: 200,
  reloadDebounce: 500,
  files: [
    'demo/dist/bundle.js', 'demo/dist/index.css', 'demo/index.html',
    'demo/dist/mo-vue-dnd.css'
  ],
  watchOptions: {ignored: 'node_modules'},
  server: {baseDir: './', directory: true}
});
