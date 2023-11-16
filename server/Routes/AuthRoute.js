const { Signup, Login } = require('../Controllers/AuthController')
const { userVerification} = require('../Middlewares/AuthMiddleware')
const router = require('express').Router()

router.post('/signup', Signup);
router.post("/login", Login);
router.post('/',userVerification)
const authenticateUser = require('../Middlewares/authenticateUser');

// Apply the authentication middleware to routes that require authentication
router.get('/protected-route', authenticateUser, (req, res) => {
  // Access authenticated user using req.user
  res.json({ message: 'This route is protected', user: req.user });
});


module.exports = router;