const sha1 = require('sha1')
const getRawBody = require('raw-body')
const util = require('./util')

module.exports = (conf) => {
  return async(ctx, next) => {
    const {
      signature,
      timestamp,
      nonce,
      echostr
    } = ctx.query
    const { token } = conf
    const str = [token, timestamp, nonce].sort().join('')
    const sha = sha1(str)
    if (ctx.method === 'GET') {
      if (sha === signature) {
        ctx.body = echostr
      } else {
        ctx.body = '<h1>wrong</h1>'
      }
    } else if (ctx.method === 'POST') {
      if (sha !== signature) {
        ctx.response.body = '<h1>wrong</h1>'
      }
      const data = await getRawBody(ctx.req, {
        length: ctx.lenght,
        limit: '1mb',
        encoding: ctx.charset || 'utf8'
      })
      const content = await util.parseXML(data)
      const message = util.formatMessage(content.xml)

      ctx.status = 200
      ctx.type = 'application/xml'
      ctx.body = `
        <xml>
          <ToUserName>
            <![CDATA[${message.FromUserName}]]>
          </ToUserName>
          <FromUserName>
            <![CDATA[${message.ToUserName}]]>
          </FromUserName>
          <CreateTime>
            ${parseInt(new Date().getTime() / 1000)}
          </CreateTime>
          <MsgType>
            <![CDATA[text]]>
          </MsgType>
          <Content>
            <![CDATA[${message.Content}]]>
          </Content>
          <MsgId>
            ${message.MsgId}
          </MsgId>
        </xml>
      `
    }
  }
}