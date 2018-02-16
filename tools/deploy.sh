#!/bin/sh
# Cleanup
ssh dinony@dinony.com 'cd www/static/projects/vue-dnd; rm -rf dist'
ssh dinony@dinony.com 'cd www/static/projects/vue-dnd; ls'
# Deploy
scp -r demo/dist dinony@dinony.com:~/www/static/projects/vue-dnd/dist
scp demo/index.html dinony@dinony.com:~/www/static/projects/vue-dnd/index.html
