const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const err = new Error(error.details[0].message);
      err.name = 'ValidationError';
      return next(err);
    }
    next();
  };
};

module.exports = validate;