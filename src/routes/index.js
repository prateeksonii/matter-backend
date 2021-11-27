const router = require('express').Router();
const userRouter = require('./userRouter');
const organizationRouter = require('./organizationRouter');

router.use('/users', userRouter);
router.use('/organization', organizationRouter);

module.exports = router;
