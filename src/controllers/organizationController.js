const Joi = require('joi');
const argon2 = require('argon2');
const Organization = require('../models/Organization');

// TODO: Setup multer to get logo

exports.createOrganization = async (req, res, next) => {
  const { name, secret, primaryColor, description, logoUrl } = req.body;
  console.log('here');
  const { id: ownerId } = req.user;

  const organizationSchema = Joi.object({
    ownerId: Joi.number().required(),
    name: Joi.string().required().trim().normalize(),
    secret: Joi.string().required().min(4).trim().normalize(),
    description: Joi.string().trim().normalize(),
    logoUrl: Joi.string()
      .uri()
      .default(
        'https://img.icons8.com/material-outlined/24/000000/user--v1.png'
      ),
    primaryColor: Joi.string()
      .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
        name: 'Color code',
      })
      .default('#5E5BFF'),
  });

  try {
    const { value, error } = organizationSchema.validate({
      ownerId,
      name,
      secret,
      description,
      logoUrl,
      primaryColor,
    });

    console.log({ value, error });

    if (error) {
      res.status(403);
      throw new Error(error.details.map((detail) => detail.message).join(','));
    }

    const [existingOrganization] = await Organization.query()
      .select('*')
      .where('name', value.name);

    if (existingOrganization) {
      res.status(409);
      throw new Error('This organization already exists');
    }

    const hashedSecret = argon2.hash(value.secret, { saltLength: 12 });

    const organization = await Organization.query().insert({
      owner_id: value.ownerId,
      name: value.name,
      secret: hashedSecret,
      description: value.description,
      logo_url: value.logoUrl,
      primary_color: value.primaryColor,
    });

    delete organization.secret;

    return res.status(201).json({
      ok: true,
      result: {
        user: organization,
      },
    });
  } catch (err) {
    return next(err);
  }
};
