import Joi from 'joi';

const authenticationSchema = Joi.object({
  email: Joi.string()
    .strip()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com'] },
    })
    .required(),

  password: Joi.string().strip().required(),
});

export { authenticationSchema };
