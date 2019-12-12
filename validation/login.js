const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(data.password)) {
    errors.message = 'Password field is required';
    errors.code = 1003
  }

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
