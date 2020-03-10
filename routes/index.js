const router = require('express').Router();

router.use('/verify', require('./verifyRoute'));

module.exports = router;