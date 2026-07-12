require('dotenv').config();
const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  process.stderr.write('JWT_SECRET is not set\n');
  process.exit(1);
}

const token = jwt.sign(
  { userId: 1, email: 'test@example.com' },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

process.stdout.write(token);
