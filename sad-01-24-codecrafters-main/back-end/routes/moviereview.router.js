const router = require('express').Router()
const movieReviewController = require('../controller/moviereview.controller')

router.get('/get/:id?',  movieReviewController.get)
router.get('/get_all',  movieReviewController.get_all)
router.post('/create', movieReviewController.create)
router.put('/update/:id', movieReviewController.update)
router.delete('/delete/:id', movieReviewController.delete)

module.exports = router