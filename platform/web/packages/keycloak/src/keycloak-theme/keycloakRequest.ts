
export const postForm = async (url: string, body: any) => {
    const requestForm = document.createElement("form");
    requestForm.action = url;
    requestForm.method = "post";
    requestForm.style.display = "none";

    Object.keys(body).forEach((key) => {
        var product = document.createElement("input");
        product.value = body[key];
        product.name = key;
        requestForm.appendChild(product)
    });

    document.body.appendChild(requestForm)
    requestForm.submit();
}
