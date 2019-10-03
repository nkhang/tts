const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.fullname = !isEmpty(data.fullname) ? data.fullname : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.numberPhone = !isEmpty(data.numberPhone) ? data.numberPhone : '';

  if (!Validator.isLength(data.fullname, { min: 2, max: 50 })) {
    errors.fullname = 'fullname must be between 2 and 50 characters';
  }

  if (Validator.isEmpty(data.fullname)) {
    errors.fullname = 'fullname field is required';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (Validator.isEmpty(data.numberPhone)) {
    errors.numberPhone = 'NumberPhone field is required';
  }

  if (!Validator.isMobilePhone(data.numberPhone)) {
    errors.numberPhone = "NumberPhone is invalid"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
