const Joi = require('joi');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.createUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const userSchema = Joi.object({
    firstName: Joi.string().required().trim().normalize(),
    lastName: Joi.string().trim().normalize(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().required().min(4),
  });

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

    const [existingUser] = await User.query()
      .select('*')
      .where('email', value.email);

    if (existingUser) {
      res.status(409);
      throw new Error('This email address already exists');
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

exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const signInSchema = Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required(),
  });

  try {
    const { value, error } = signInSchema.validate({
      email,
      password,
    });

    if (error) {
      res.status(403);
      throw new Error(error.details.map((detail) => detail.message).join(','));
    }

    const [user] = await User.query().select('*').where('email', value.email);

    if (!user) {
      res.status(403);
      throw new Error('No user found with this email address');
    }

    const isValidPassword = await argon2.verify(user.password, value.password);

    if (!isValidPassword) {
      res.status(403);
      throw new Error('Invalid Email or Password');
    }

    delete user.password;

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: '10y',
    });

    return res.status(200).json({
      ok: true,
      result: {
        token,
        user,
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.isAuthenticated = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    console.log(req.headers.authorization);

    if (!authorization) {
      res.status(403);
      throw new Error('User not authenticated');
    }

    const [, token] = authorization.split(' ');

    if (!token) {
      res.status(401);
      throw new Error('Invalid token');
    }

    const { user } = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) {
      res.status(401);
      throw new Error('Invalid token');
    }

    req.user = user;

    return next();
  } catch (err) {
    return next(err);
  }
};

exports.getSignedInUser = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.json({
        ok: false,
        user: null,
      });
    }

    const [, token] = authorization.split(' ');

    if (!token) {
      res.status(401);
      throw new Error('Invalid token');
    }

    const { user } = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) {
      res.status(401);
      throw new Error('Invalid token');
    }

    return res.json({
      ok: true,
      user,
    });
  } catch (err) {
    return next(err);
  }
};
