export default async function post(title:string, link:string) {
    return new Promise((resolve, reject)=>{
        fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_GROUP_ID}&text=${title}%0A${link}`, {
            method: "POST",
        }).then((response)=>{
            resolve(response)
        }).catch((error)=>{
            reject(error)
        })
    })
}