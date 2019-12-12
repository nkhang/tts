const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateInfoInput(data) {
  let errors = {};

  data.fullname = !isEmpty(data.fullname) ? data.fullname : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.numberPhone = !isEmpty(data.numberPhone) ? data.numberPhone : '';
  data.cardName = !isEmpty(data.cardName) ? data.cardName : '';
  data.cardNumber = !isEmpty(data.cardNumber) ? data.cardNumber : '';
  data.expmonth = !isEmpty(data.expmonth) ? data.expmonth : '';
  data.expyear = !isEmpty(data.expyear) ? data.expyear : '';
  data.cvv = !isEmpty(data.cvv) ? data.cvv : '';

  if (Validator.isEmpty(data.numberPhone)) {
    errors.message = 'NumberPhone field is required';
    errors.code = 1006
  }

  if (!Validator.isMobilePhone(data.numberPhone)) {
    errors.message = "NumberPhone is invalid"
    errors.code = 1007
  }

  if (Validator.isEmpty(data.email)) {
    errors.message = 'Email field is required';
    errors.code = 1002
  }

  if (!Validator.isEmail(data.email)) {
    errors.message = 'Email is invalid';
    errors.code = 1001
  }

  if (!Validator.isLength(data.fullname, { min: 2, max: 50 })) {
    errors.message = 'Fullname must be between 2 and 50 characters';
    errors.code = 1008
  }

  if (Validator.isEmpty(data.fullname)) {
    errors.message = 'Fullname field is required';
    errors.code = 1009
  }

  if (!Validator.isLength(data.cardName, { min: 2, max: 50 })) {
    errors.message = 'Owner name must be between 2 and 50 characters';
    errors.code = 1004
  }

  if (Validator.isEmpty(data.cardName)) {
    errors.message = 'Owner name field is required';
    errors.code = 1005
  }

  if (!Validator.isLength(data.cardNumber, { min: 16, max: 16 })) {
    errors.message = 'Card number must be 16 characters';
    errors.code = 1011
  }

  if (Validator.isEmpty(data.cardNumber)) {
    errors.message = 'Card number field is required';
    errors.code = 1012
  }

  if (!Validator.isLength(data.cvv, { min: 3, max: 3 })) {
    errors.message = 'CVV number must be 3 characters';
    errors.code = 1013
  }

  if (Validator.isEmpty(data.cvv)) {
    errors.message = 'CVV field is required';
    errors.code = 1014
  }

  if (data.expyear < new Date().getYear()) {
    errors.message = 'Card is expired';
    errors.code = 1015
  }

  if (Validator.isEmpty(data.expyear)) {
    errors.message = 'Year is required';
    errors.code = 1016
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
