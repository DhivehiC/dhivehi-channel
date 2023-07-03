export function extractVideoId(url:string) {
    const pattern = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch(?:\/|\/?\?(?:\S+)?v=)|embed\/|v\/|youtu\.be\/|)([a-zA-Z0-9_-]{11})/;
    const match = url.match(pattern);
    if (match && match[1]) {
        return match[1];
    } else if (url.includes("youtu.be/")) {
        const splitUrl = url.split("youtu.be/");
        if (splitUrl.length === 2 && splitUrl[1].length === 11) {
        return splitUrl[1];
        }
    }
    return null;
}