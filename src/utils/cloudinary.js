import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

        //file has been uploaded successfully
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)  // remove the locally saved temporary fileas upload operation got failed
        return null
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Asset deleted successfully:", result);
        return result;
    } catch (error) {
        console.error("Error deleting asset:", error);
        return null
    }
}

const getPublicIdFromUrl = (url) => {
    const matches = url.match(/\/v\d+\/([^\/]+)\./);
    if (matches && matches.length > 1) {
      return matches[1];
    } else {
      console.error("Invalid Cloudinary URL format");
      return null;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary, getPublicIdFromUrl }