const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const keys = require("../../config/key")

//load inut validation
const validateRegisterInput = require("../../validation/register")
const validateLoginInput = require("../../validation/login")

// load user model
const User = require("../../models/model.user")


// route to get all users
router.get("/users", (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => console.log(err))
})

// @route POST api/users/register
// @desc Register user
// @access Publuic
router.post("/register", (req, res) => {
    //form validaation

    const { errors, isValid } = validateRegisterInput(req.body);

    //check validaation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email}).then(user => {
        if (user){
            return res.status(400).json({ email: "Email already exists"})
        }
        else{
            const newUser =new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                })
            })
        }
    })
})

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login", (req, res) => {

    //Form valiation

    const { errors, isValid} =validateLoginInput(req.body);

    //check validation
    if(!isValid){
        return res.status(400).json(errors);
    }


    const email =req.body.email;
    const password =req.body.password;

    // find user by email
    User.findOne({ email }).then(user => {

        //check if user exists
        if (!user){
            return res.status(404).json({ emaillnotfound: "Email not found"})
        }

        // check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch) {
                // User matched
                // create JWT payload

                const payload ={
                    id: user.id,
                    name: user.name
                };
                // Sign token
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        {
                            expireIn: 31556926 // 1 year in seconds
                        },
                        ( err, token ) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        }
                    )
            }
            else{
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect"})
            }
        })
    })
})

module.exports = router