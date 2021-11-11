import path from "path";
import fs from "fs";
import fileType from "file-type";

async function base64ToFile(base64, userId, folderName) {
  
  const audioBuffer = new Buffer.from(base64, "base64");
  // console.log("buffer", audioBuffer);
  const extention = await fileType.fromBuffer(audioBuffer);
  // console.log("extension", extention);
  const filePath = path.resolve(`./public/media/users/${userId}`);
  const fileName = `${userId}-${Date.now()}.${extention.ext}`;

  const localPath = `${filePath}/${folderName}`;
  if (!fs.existsSync(localPath)) {
    fs.mkdirSync(localPath, { recursive: true });
  }

  fs.writeFileSync(`${localPath}/${fileName}`, audioBuffer, "utf8");

  const url = `${process.env.BASEURL}/media/users/${userId}/${folderName}/${fileName}`;
  return url;
}

export default base64ToFile;
