const router = require('express').Router();
const controllers = require('../controllers');

router.get('/:id', controllers.verify.verifyUser);
router.post('/', controllers.verify.getVerificationToken);

module.exports = router;