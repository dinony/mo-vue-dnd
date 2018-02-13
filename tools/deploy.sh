#!/bin/sh
# Cleanup
ssh dinony@dinony.com 'cd www/static/projects/vue-dnd; rm -rf dist'
ssh dinony@dinony.com 'cd www/static/projects/vue-dnd; ls'
# Deploy
scp -r examples/nested/dist dinony@dinony.com:~/www/static/projects/vue-dnd/dist
scp examples/nested/index.html dinony@dinony.com:~/www/static/projects/vue-dnd/index.html
