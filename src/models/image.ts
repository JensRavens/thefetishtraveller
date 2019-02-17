export interface Image {
  full: string;
  big: string;
  medium: string;
  small: string;
  file?: File;
}

export async function readImageUrl(file: File): Promise<Image> {
  const url = await readFile(file);
  return { file, full: url, big: url, medium: url, small: url };
}

function readFile(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = () => rej(reader.error);
    reader.readAsDataURL(file);
  });
}
