const Joi = require('joi');
const OrganizationMember = require('../models/OrganizationMember');
const Role = require('../models/Role');
const User = require('../models/User');

const roleSchema = Joi.object({
  name: Joi.string().required().normalize().trim(),
  rolePermission: Joi.object().required(),
});

exports.createRole = async (req, res, next) => {
  const { name, rolePermission } = req.body;

  try {
    const [{ organization_id: organizationId }] =
      await OrganizationMember.query()
        .select('organization_id')
        .where('user_id', req.user.id);

    const { value, error } = roleSchema.validate({
      name,
      rolePermission,
    });

    if (error) {
      res.status(403);
      throw new Error(error.details.map((detail) => detail.message).join(','));
    }

    await Role.query().insertGraphAndFetch({
      name: value.name,
      organization_id: organizationId,
      role_permission: value.rolePermission,
    });

    return res.status(201).json({
      ok: true,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getRoles = async (req, res, next) => {
  try {
    const [{ organization_id: organizationId }] =
      await OrganizationMember.query()
        .select('organization_id')
        .where('user_id', req.user.id);

    const roles = await Role.query()
      .withGraphFetched('[organization,role_permission]')
      .where('roles.organization_id', organizationId);

    return res.json({
      ok: true,
      result: {
        roles,
      },
    });
  } catch (err) {
    return next();
  }
};
