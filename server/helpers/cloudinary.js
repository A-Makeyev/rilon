const cloudinary = require('cloudinary').v2

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
})

const uploadMedia = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto'
        })
        return result
    } catch (err) {
        throw new Error('Failed to upload to cloudinary -> ' + err)
    }
}

const deleteMedia = async (public_id, resource_type) => {
    try {
        if (!['image', 'video'].includes(resource_type)) {
            throw new Error('Invalid resource type. Must be "image" or "video"')
        }
        
        if (Array.isArray(public_id)) {
            await cloudinary.api.delete_resources(public_id, { resource_type })
        } else {
            await cloudinary.uploader.destroy(public_id, { resource_type, invalidate: true })
        }
    } catch (err) {
        throw new Error(`Failed to delete ${resource_type} asset(s) from Cloudinary -> ${err}`)
    }
}

module.exports = { 
    uploadMedia, 
    deleteMedia
}