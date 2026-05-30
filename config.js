var JWT_SECRET = process.env.JWT_SECRET || 'gallery_project_dev_secret';
var env = process.env.NODE_ENV || 'development';

if (!process.env.JWT_SECRET) {
  if (env === 'production') {
    throw new Error('JWT_SECRET must be set in production');
  }
  console.warn('Warning: JWT_SECRET is not defined. Using a default development secret. Set JWT_SECRET in the environment for production.');
}

module.exports = {
  JWT_SECRET,
};
