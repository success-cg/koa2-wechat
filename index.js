const Koa = require('koa')
const wechat = require('./wechat-lib/middleware')
const config = require('./config/config')
const app = new Koa()

app.use(wechat(config.wechat))

app.listen(config.port, () => {
  console.log('listen on port http://localhost:3006');
})