import Joi from "joi"

export const schemaEnquete = Joi.object({
    title: Joi.string().required(),
    expireAt: Joi.date()
})

export const schemaOpcaoDeVoto = Joi.object({
    title: Joi.string().required(),
    pollId: Joi.string().required()
})
