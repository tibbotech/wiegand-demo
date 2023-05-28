# wiegand-demo

https://tibbo.com/linux/nodejs/simple-card-based-access-control.html

## Quick start
```
dnf -y install git nodejs-npm node-libgpiod node-better-sqlite3
export NODE_PATH=$NODE_PATH:/usr/lib/node_modules/
git clone https://github.com/tibbotech/wiegand-demo.git
cd wiegand-demo
npm i .
```
If npm install will fail trying to build the node module, install build-essentials and start again:
```
dnf -y install packagegroup-core-buildessential libgpiod-dev
npm i .
```
Finally run the application:
```
node ./app.js
```

## Notes: 
1) LEDs configuration is placed at conf.js
2) you can put your Wiegand Tibbit on any socket: it will be found by index#0
