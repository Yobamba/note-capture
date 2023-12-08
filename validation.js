const Validator = require("validatorjs");

const validator = async (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

const saveCreatedUser = async (req, res, next) => {
  const validationRule = {
    username: "required|string",
    googleId: "required|string",
  };

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

const noteValidationRules = {
  title: "required|string|max:255",
  note: "required|string",
  noteTags: "required",
  pinStatus: "required|string",
  
};

const validateNote = async (req, res, next) => {
  await validator(req.body, noteValidationRules, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};


module.exports = {
  validator,
  saveCreatedUser,
  validateNote
};

// module.exports = validator;
