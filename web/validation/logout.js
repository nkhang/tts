const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateLogoutInput(data) {
  let errors = {};

  data.id = !isEmpty(data.id) ? data.id : '';

  if (Validator.isEmpty(data.id)) {
    errors.message = 'UserId is empty';
    errors.code = 1013
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
