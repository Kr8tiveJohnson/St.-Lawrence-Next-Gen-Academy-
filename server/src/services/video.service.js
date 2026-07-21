const cloudinary = require('../config/cloudinary');

class VideoService {
    static async getPlaybackUrl(publicId) {
        // Generates the raw video URL for Cloudinary
        return cloudinary.url(publicId, { resource_type: 'video' });
    }
}

module.exports = VideoService;
