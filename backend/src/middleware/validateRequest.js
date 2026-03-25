const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));

        return res.status(422).json({
          message: "Validation failed",
          errors,
        });
      }

      req.body = result.data; // sanitized data
      next();
    } catch (err) {
      res.status(500).json({
        message: "Validation error",
      });
    }
  };
};

export default validateRequest;