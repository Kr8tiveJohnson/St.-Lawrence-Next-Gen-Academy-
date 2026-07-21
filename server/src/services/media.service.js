const cloudinary = require('../config/cloudinary');

class MediaService {
    static async uploadImage(filePath, folder = 'general') {
        try {
            const result = await cloudinary.uploader.upload(filePath, { folder });
            return result.secure_url;
        } catch (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    }

    static async deleteImage(publicId) {
        try {
            await cloudinary.uploader.destroy(publicId);
            return true;
        } catch (error) {
            throw new Error(`Deletion failed: ${error.message}`);
        }
    }
}

module.exports = MediaService;
