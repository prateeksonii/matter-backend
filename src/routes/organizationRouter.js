const router = require('express').Router();
const { createOrganization } = require('../controllers/organizationController');
const { isAuthenticated } = require('../controllers/userController');

router.post('/', isAuthenticated, createOrganization);

module.exports = router;
