const router = require('express').Router()
const notifcationController = require('../controller/notification.controller')

router.get('/get/:id?',  notifcationController.get)
router.post('/create', notifcationController.create)
router.put('/update/:id', notifcationController.update)
router.delete('/delete/:id', notifcationController.delete)

module.exports = router