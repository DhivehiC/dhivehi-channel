import client from '@sikundi/libs/server/TwitterClient'

export default async function post(title:string, link:string) {
    return new Promise(async (resolve, reject)=>{
        client.v2.tweet(`${title}\n${link}`).then((response)=>{
            resolve(response)
        }).catch((error)=>{
            reject(error)
        })
    })
}