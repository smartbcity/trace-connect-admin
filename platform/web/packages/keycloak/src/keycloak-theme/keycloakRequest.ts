import { request } from "@smartb/g2"


export const postForm = async (url: string, body: any) => {
    const data = new URLSearchParams();
    Object.keys(body).forEach((key) => {
        data.append(key, body[key]);
    });
    const res = await request({
        url,
        method: "POST",
        body: data,
        //@ts-ignore
        contentType: "application/x-www-form-urlencoded",
        returnType: "text"
    })
    document.open();
    document.write(res);
    document.close()
}
