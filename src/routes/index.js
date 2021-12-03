const router = require('express').Router();
const userRouter = require('./userRouter');
const organizationRouter = require('./organizationRouter');
const roleRouter = require('./roleRouter');

router.use('/users', userRouter);
router.use('/organization', organizationRouter);
router.use('/role', roleRouter);

module.exports = router;
