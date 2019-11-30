const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validatePasswordInput(data) {
  let errors = {};

  data.password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(data.password)) {
    errors.message = 'Password field is required';
    errors.code = 1004
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.message = 'Password must be at least 6 characters';
    errors.code = 1005
  }

  if(data.password !== data.repassword) {
    errors.message = 'Repassword is not matched';
    errors.code = 1000;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};