const { uploadMedia, deleteMedia } = require('../../helpers/cloudinary')
const express = require('express')
const multer = require('multer')


const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const result = await uploadMedia(req.file.path)
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: `Error uploading file -> ${err}`
        })
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Asset id is required'
            })
        }

        const result = await deleteMedia(id)
        res.status(200).json({
            success: true,
            data: result,
            message: 'Deleted Media'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: `Error deleting file -> ${err}`
        })
    }
})

router.post('/bulk-upload', upload.array('files', 10), async (req, res) => {
    try {
        const upload = req.files.map(file => uploadMedia(file.path))
        const result = await Promise.all(upload)

        res.status(200).json({
            success: true,
            data: result
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: `Error uploading files -> ${err}`
        })
    }
})

module.exports = router