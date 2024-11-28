const passwordValidator = require("password-validator");
const AWS = require("aws-sdk");
const crypto = require("crypto");

function validatePassword(password) {
  const schema = new passwordValidator();
  schema
    .is()
    .min(6) // Minimum length 6
    .is()
    .max(100); // Maximum length 100

  return schema.validate(password);
}

function createGravatarUrl(email) {
  const hash = crypto
      .createHash('md5')
      .update(email.toLowerCase().trim())
      .digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=mp`;
}

module.exports = {
  validatePassword,
  createGravatarUrl,
};
