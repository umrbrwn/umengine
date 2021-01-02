export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    }, reject => {
        console.error(`failed to load image ${url}`, reject);
    });
}

export async function loadJSON(path) {
    return (await fetch(path)).json();
}