const router = require('express').Router();
const controllers = require('../controllers');

router.get('/:id', controllers.verify.verifyUser);

module.exports = router;