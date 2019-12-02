const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateFogotPasswordInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';

  if (!Validator.isEmail(data.email)) {
    errors.message = 'Email is invalid';
    errors.code = 1001
  }

  if (Validator.isEmpty(data.email)) {
    errors.message = 'Email field is required';
    errors.code = 1002
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
