const router = require('express').Router();
const {
  createOrganization,
  getOrganizationMember,
} = require('../controllers/organizationController');
const { isAuthenticated } = require('../controllers/userController');

router.post('/', isAuthenticated, createOrganization);
router.get('/member', isAuthenticated, getOrganizationMember);

module.exports = router;
