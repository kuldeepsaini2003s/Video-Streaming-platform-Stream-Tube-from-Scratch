import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath, onProgress) => {
  try {
    const fileSize = fs.statSync(localFilePath).size; // Get file size in bytes
    let uploadedBytes = 0;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: `Youtube_${new Date()
            .toISOString()
            .replace(/[:.]/g, "-")}`,
          resource_type: "auto",
          folder: "uploads",
        },
        (error, result) => {
          if (error) {
            fs.unlinkSync(localFilePath); // Cleanup the local file
            return reject(error);
          }
          fs.unlinkSync(localFilePath); // Cleanup the local file
          resolve(result);
        }
      );

      const readStream = fs.createReadStream(localFilePath);

      readStream.on("data", (chunk) => {
        uploadedBytes += chunk.length;
        if (onProgress) {
          const progress = Math.round((uploadedBytes / fileSize) * 100);
          onProgress(progress);
        }
      });

      readStream.pipe(uploadStream);

      readStream.on("error", (err) => {
        reject(err);
      });
    });
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("Error while uploading the file to Cloudinary", error);
    return null;
  }
};

export { uploadOnCloudinary };
