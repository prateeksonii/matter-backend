const Joi = require('joi');
const argon2 = require('argon2');
const User = require('../models/User');

const userSchema = Joi.object({
  firstName: Joi.string().required().trim().normalize(),
  lastName: Joi.string().trim().normalize(),
  email: Joi.string().email().required().trim(),
  password: Joi.string().min(4),
});

exports.createUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const { value, error } = userSchema.validate({
      firstName,
      lastName,
      email,
      password,
    });

    if (error) {
      res.status(403);
      throw new Error(error.details.map((detail) => detail.message).join(','));
    }

    const hashedPassword = await argon2.hash(value.password, {
      saltLength: 12,
    });

    const user = await User.query().insert({
      first_name: value.firstName,
      last_name: value.lastName,
      email: value.email,
      password: hashedPassword,
    });

    delete user.password;

    return res.status(201).json({
      ok: true,
      result: {
        user,
      },
    });
  } catch (err) {
    return next(err);
  }
};
