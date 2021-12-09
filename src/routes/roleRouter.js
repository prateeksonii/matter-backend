const { createRole, getRoles } = require('../controllers/roleController');
const { isAuthenticated } = require('../controllers/userController');

const router = require('express').Router();

router.post('/', isAuthenticated, createRole);
router.get('/', isAuthenticated, getRoles);

module.exports = router;
