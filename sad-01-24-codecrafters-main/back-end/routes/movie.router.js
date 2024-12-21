const router = require('express').Router()
const movieController = require('../controller/movie.controller')
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/movie_attachments');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.').slice(0, -1).join('.') + '_' + Date.now() + path.extname(file.originalname));
    }
})

let upload = multer({ storage: storage }).single('file')


router.get('/get/:id?',  movieController.get)
router.get('/search',  movieController.search)
router.get('/get_all',  movieController.get_all)
router.post('/create', movieController.create)
router.put('/update/:id', movieController.update)
router.delete('/delete/:id', movieController.delete)
router.post('/upload_file', movieController.upload_file(upload, multer))
//log

module.exports = router