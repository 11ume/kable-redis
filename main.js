const kable = require('kable-core')
const redis = require('redis')
const { description } = require('./package.json')

function connect(k, options) {
    const client = redis.createClient(options)
    client.on('connect', () => {
        if (!k.avaliable) {
            k.start()
        }
    })

    client.on('end', () => {
        if (k.avaliable) {
            k.stop('end')
        }
    })

    client.on('reconnecting', () => {
        if (k.avaliable) {
            k.doing('reconnecting')
        }
    })
}

function run({
    id
    , host = '127.0.0.1'
    , port = 6379
    , password = null
    , key = null
}) {
    const meta = {
        id: 'redis-node'
        , description
    }

    const options = {
        host
        , port
        , password
    }

    const k = kable(id, {
        host
        , port
        , key
        , meta
    })

    return k.up(false).then(() => {
        k.doing('Starting')
        connect(k, options)
        return k
    })
}

module.exports = run 