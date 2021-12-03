const { createRole } = require('../controllers/roleController');

const router = require('express').Router();

router.post('/', createRole);

module.exports = router;
