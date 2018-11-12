const xml2js = require('xml2js')

const parseXML = (xml) => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, { trim: true }, (err, content) => {
      if (err){
        reject(err)
      } else {
        resolve(content)
      }
    })
  })
}

const formatMessage = (result) => {
  let message = {}
  if (typeof result === 'object') {
    const keys = Object.keys(result)
    keys.forEach((it, idx) => {
      let item = result[it]
      if (!Array.isArray(item) || item.length === 0) {
        return
      }
      if (item.length === 1) {
        let val = item[0]
        if (typeof val === 'object') {
          message[it] = formatMessage(val)
        } else {
          message[it] = (val || '').trim()
        }
      } else {
        message[it] = []
        item.forEach(j => {
          message[it].push(formatMessage(j))
        })
      }
    })
  }
  return message
}

module.exports = {
  formatMessage,
  parseXML
}