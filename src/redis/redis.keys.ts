import {client} from "./redis.client.ts"

const init = async () => {
    await client.set('msg:1', 'hey from nodejs')
    const result = await client.get('msg:1');
    console.log('Result', result)
}

init()

