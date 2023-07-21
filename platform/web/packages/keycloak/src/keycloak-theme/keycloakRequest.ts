import { request } from "@smartb/g2"


export const postForm = (url: string, body: any) => {
    const formData = new FormData()
    Object.keys(body).forEach((key) => {
        formData.append(key, body[key])
    })
    const res = request({
        url,
        method: "POST",
        formData,
        returnType: "json"
    })
    return res
}