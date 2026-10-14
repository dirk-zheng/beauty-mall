const isProduction = process.env.NODE_ENV === 'production';
const configuredPassword = String(process.env.ADMIN_PASSWORD || '').trim();

if (isProduction && configuredPassword.length < 12) {
  throw new Error('ADMIN_PASSWORD must be set to at least 12 characters in production.');
}

module.exports = Object.freeze({
  account: String(process.env.ADMIN_ACCOUNT || 'admin').trim(),
  password: configuredPassword || 'AureliaAdmin@2026',
  name: String(process.env.ADMIN_NAME || 'Aurelia Beauty Admin').trim(),
  role: 'admin',
});
