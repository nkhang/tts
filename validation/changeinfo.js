const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateInfoInput(data) {
  let errors = {};

  data.fullname = !isEmpty(data.fullname) ? data.fullname : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.numberPhone = !isEmpty(data.numberPhone) ? data.numberPhone : '';

  if (Validator.isEmpty(data.numberPhone)) {
    errors.message = 'phone number field is required';
    errors.code = 1006
  }

  if (!Validator.isMobilePhone(data.numberPhone)) {
    errors.message = "phone number is invalid"
    errors.code = 1007
  }

  if (Validator.isEmpty(data.email)) {
    errors.message = 'email field is required';
    errors.code = 1002
  }

  if (!Validator.isEmail(data.email)) {
    errors.message = 'email is invalid';
    errors.code = 1001
  }

  if (!Validator.isLength(data.fullname, { min: 2, max: 50 })) {
    errors.message = 'fullname must be between 2 and 50 characters';
    errors.code = 1008
  }

  if (Validator.isEmpty(data.fullname)) {
    errors.message = 'fullname field is required';
    errors.code = 1009
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
