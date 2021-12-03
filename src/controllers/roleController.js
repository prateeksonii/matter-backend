const Joi = require('joi');

const roleSchema = Joi.object({
  name: Joi.string().required().normalize().trim(),
  organizationId: Joi.number().required(),
  rolePermission: Joi.object().required(),
});

exports.createRole = async (req, res, next) => {
  const { name, organizationId, rolePermission } = req.body;

  try {
    const { value, error } = roleSchema.validate({
      name,
      organizationId,
      rolePermission,
    });

    if (error) {
      res.status(403);
      throw new Error(error.details.map((detail) => detail.message).join(','));
    }

    await Role.query().insertGraphAndFetch({
      name: value.name,
      organization_id: value.organizationId,
      role_permission: value.rolePermission,
    });

    return res.status(201).json({
      ok: true,
    });
  } catch (err) {
    return next(err);
  }
};
