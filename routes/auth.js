

const router = require("express").Router();
const User   = require('../model/User');
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {registerValidation, loginValidation} = require('../validation');


router.post('/register' , async (req,res) => {
     // Validation
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the user is already in the database
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

   // Password Hashing 
     const salt           = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(req.body.password, salt); 

    const user = new User({
        name    :req.body.name,
        email   :req.body.email,
        password:hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({ user:user._id });
    }catch(err){
        res.status(400).send(err);
    }
});

// User Login 

router.post('/login' , async (req,res) => {
    // Validation

   const {error} = loginValidation(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   // Checking if the email already exist or not

   const user = await User.findOne({email:req.body.email});
   if(!user)    return res.status(400).send('Email is not found');

   // checking password

   const vaildPassword = await bcrypt.compare(req.body.password, user.password);
   if(!vaildPassword)    return res.status(400).send('invalid password'); 

    // create and assign tokens

    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token);

   

 });


module.exports = router;
