const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');
const { register, login } = require('../controllers/auth.controller');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

router.post(
  '/test-role',
  authenticate,
  requireRole('DISPATCHER'),
  (req, res) => res.json({ ok: true, role: req.user.role })
);

module.exports = router;