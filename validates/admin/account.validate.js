const Joi = require("joi")
module.exports.registerPost = async (req, res,next) => {
const schema = Joi.object({
    fullName:Joi.string()
    .required()
    .min(5)
    .max(50)
    .message({
        "string.emty": "Vui long nhap ho ten",
        "string.min": "Họ tên phải có ít nhất 5 kí tự",
        "string.max": "Họ tên phải có nhiều nhất 50 kí tự",
    }),
    email:Joi.string()
    .required()
    .email()
    .message({
        "string.emty": "Vui long nhap email"
    }),
    password:Joi.string().required()
    .min(8)
    .custom((value, helpers)=>{
        if(!/[A-Z]/.test(value)){
            return helpers.error('password.uppercase')
        }
         if(!/[a-z]/.test(value)){
            return helpers.error('password.lowercase')
        }
         if(!/[0-9]/.test(value)){
            return helpers.error('password.numbercase')
        }
        if(!/[!@#$%^&*()?]/.test(value)){
            return helpers.error('password.special')
        }
        return value;
    })
    .message({

        "string.emty": "Vui long nhap mat khau",
        "password.uppercase":"Phai co it nhat mot ki tu in hoa",
        "password.lowercase":"Phai co it nhat mot ki tu thuong",
        "password.numbercase":"Phai co it nhat mot ki tu so",
        "password.special":"Phai co it nhat mot ki tu dac biet",

    }),
   


});
const {error}=schema.validate(req.body)
if (error){
const errorMessage= error.details[0].message;
    res.json({
        code:"error",
        message: errorMessage,
       
    })
     return;
}
next();
}
module.exports.loginPost = async (req, res,next) => {
const schema = Joi.object({
  
    email:Joi.string()
    .required()
    .email()
    .message({
        "string.emty": "Vui long nhap email"
    }),
    password:Joi.string().required()
    .min(8)
    .custom((value, helpers)=>{
        if(!/[A-Z]/.test(value)){
            return helpers.error('password.uppercase')
        }
         if(!/[a-z]/.test(value)){
            return helpers.error('password.lowercase')
        }
         if(!/[0-9]/.test(value)){
            return helpers.error('password.numbercase')
        }
        if(!/[!@#$%^&*()?]/.test(value)){
            return helpers.error('password.special')
        }
        return value;
    })
    .message({

        "string.emty": "Vui long nhap mat khau",
        "password.uppercase":"Phai co it nhat mot ki tu in hoa",
        "password.lowercase":"Phai co it nhat mot ki tu thuong",
        "password.numbercase":"Phai co it nhat mot ki tu so",
        "password.special":"Phai co it nhat mot ki tu dac biet",

    }),
   


});
const {error}=schema.validate(req.body)
if (error){
const errorMessage= error.details[0].message;
    res.json({
        code:"error",
        message: errorMessage,
       
    })
     return;
}
next();
}