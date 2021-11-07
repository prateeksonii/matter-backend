const router = require('express').Router();
const {
  createUser,
  signIn,
  getSignedInUser,
} = require('../controllers/userController');

router.post('/', createUser);
router.post('/signin', signIn);
router.get('/', getSignedInUser);

module.exports = router;
