module.exports = {
    provider: 'cloudinary',
    defaultVideoOptions: {
        resource_type: 'video',
        chunk_size: 6000000,
        eager: [
            { width: 300, height: 300, crop: "pad", audio_codec: "none" },
            { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }
        ],
        eager_async: true
    }
};
