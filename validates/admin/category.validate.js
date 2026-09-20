const Joi = require("joi")
module.exports.createPost = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .required()
            .messages({
                "string.empty": "Vui long nhap ten danh muc",

            }),
        parent: Joi.string()
            .allow("")
        ,
        position: Joi.string()
            .allow("")
        ,
        status: Joi.string()
            .allow("")
        ,

        avatar: Joi.string()
            .allow("")
        ,
        description: Joi.string()
            .allow("")
        ,


    });
    const { error } = schema.validate(req.body, { allowUnknown: true })
    if (error) {
        const errorMessage = error.details[0].message;
        res.json({
            code: "error",
            message: errorMessage,

        })
        return;
    }
    next();
}