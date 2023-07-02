export default async function post(title:string, link:string) {
    return new Promise((resolve, reject)=>{
        fetch(`https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/feed?message=${title}&link=${link}&access_token=${process.env.FACEBOOK_KEY}`, {
            method: "POST",
        }).then((response)=>{
            resolve(response)
        }).catch((error)=>{
            reject(error)
        })
    })
}