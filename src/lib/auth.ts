export async function test(){
    let response = await fetch("https://nicetry.franciswibisono.com/user/", {
        method: 'GET',
        mode: 'cors',
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        let data = await response.text(); // read response as plain text
        return data;
    }
}
