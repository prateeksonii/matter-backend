const Joi = require('joi');
const argon2 = require('argon2');
const Organization = require('../models/Organization');
const Role = require('../models/Role');
const OrganizationMember = require('../models/OrganizationMember');

// TODO: Setup multer to get logo

exports.getOrganizationMember = async (req, res, next) => {
  try {
    const [organizationMember] = await OrganizationMember.query()
      .withGraphFetched('[organization,user]')
      .select('*')
      .where('organization_members.user_id', req.user.id);

    return res.status(200).json({
      ok: true,
      result: {
        organizationMember,
      },
    });
  } catch (err) {
    console.log(err);
    return next();
  }
};

const organizationSchema = Joi.object({
  ownerId: Joi.number().required(),
  name: Joi.string().required().trim().normalize(),
  secret: Joi.string().required().min(4).trim().normalize(),
  description: Joi.string().trim().normalize(),
  logoUrl: Joi.string()
    .uri()
    .default('https://img.icons8.com/material-outlined/24/000000/user--v1.png'),
  primaryColor: Joi.string()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
      name: 'Color code',
    })
    .default('#5E5BFF'),
});

exports.createOrganization = async (req, res, next) => {
  const { name, secret, primaryColor, description, logoUrl } = req.body;
  console.log('here');
  const { id: ownerId } = req.user;

  try {
    const { value, error } = organizationSchema.validate({
      ownerId,
      name,
      secret,
      description,
      logoUrl,
      primaryColor,
    });

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

    const organization = await Organization.query().insertAndFetch({
      owner_id: value.ownerId,
      name: value.name,
      secret: hashedSecret,
      description: value.description,
      logo_url: value.logoUrl,
      primary_color: value.primaryColor,
    });

    await Role.query().insertGraphAndFetch({
      name: 'owner',
      organization_id: organization.id,
      role_permission: {
        can_create_project: true,
        can_edit_project: true,
        can_delete_project: true,
        can_add_delete_members: true,
        can_edit_permissions: true,
        can_create_task: true,
        can_delete_task: true,
        can_edit_task: true,
        can_change_task_status: true,
      },
      organization_member: {
        organization_id: organization.id,
        user_id: organization.owner_id,
      },
    });

    return res.status(201).json({
      ok: true,
      result: {
        organization,
      },
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
