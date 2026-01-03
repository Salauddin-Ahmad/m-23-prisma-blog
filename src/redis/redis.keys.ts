import {client} from "./redis.client.ts"

const init = async () => {
    await client.set('msg:1', 'hey from nodejs')
    await client.expire('msg:1', 20)
    const result = await client.get('msg:1');
    console.log('Result', result)
}

init()

