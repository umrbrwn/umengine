export function loadImage(url: string) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

export async function loadJSON(path: string) {
  return (await fetch(path)).json();
}
