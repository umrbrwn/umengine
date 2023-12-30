export function loadImage(url: string): Promise<ImageBitmap> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(createImageBitmap(image));
    image.src = url;
  });
}

export async function loadJSON(path: string) {
  return (await fetch(path)).json();
}
