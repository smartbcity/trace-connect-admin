import { request } from "@smartb/g2"


export const postForm = async (url: string, body: any) => {
    const formData = new FormData()
    Object.keys(body).forEach((key) => {
        formData.append(key, body[key])
    })
    const res = await request({
        url,
        method: "POST",
        formData,
        //@ts-ignore
        contentType: "application/x-www-form-urlencoded",
        returnType: "text"
    })
    document.open();
    document.write(res);
    document.close()
}