export async function readBytesUrl(
  file: File,
  appendFileType?: boolean
): Promise<string> {
  return new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onerror = () => rej(reader.error);
    reader.onload = () => {
      let result = reader.result as string;
      if (!appendFileType) {
        result = result.substring(result.indexOf(',') + 1);
      }
      res(result);
    };
    reader.readAsDataURL(file);
  });
}
