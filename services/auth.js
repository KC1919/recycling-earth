const jwt = require("jsonwebtoken");
const UserService = require("./user");
const User = require("../models/User");
const bcrypt = require("bcrypt");


let userService = new UserService();

class authService {

    authService() {

    }

    getLogin(req, res) {
        res.render("login");
    }

    //User Login Method
    async postLogin(req, res) {
        try {

            const user = await User.findOne({
                email: req.body.email
            });

            //user exists
            if (user) {
                // console.log(user);
                const saltRounds = 10; //salt rounds used for hashing the password

                //comparing user entered password with saved user password
                bcrypt.compare(req.body.password, user.password, async (err, result) => {

                    if (err) {
                        //Invalid credentials
                        console.log("Invalid username or password");

                        return res.status(401).json({
                            message: "invalid"
                        });
                    } else if (result === true) {
                        console.log(result);
                        //creating token with userId as payload
                        const token = await jwt.sign({
                            userId: user._id
                        }, process.env.SECRET_KEY);

                        //embedding the token inside the cookie
                        const setCookie = await res.cookie('secret', token, {
                            maxAge: 86400,
                            httpOnly: true
                        });

                        // console.log(setCookie);

                        if (Object.keys(setCookie).length !== 0) {
                            console.log("Logged in Successfully");
                            // return res.status(200).json("Successful login");
                            res.send({
                                redirectTo: '/',
                                message: "success"
                            }) //redirecting to home route after successfull login
                        }
                    } else if(result===false){
                        
                        return res.status(401).json({
                            message: "failure"
                        })
                    }
                });

            } else { //User not present in the database
                console.log("User not found");
                return res.status(401).json({
                    message: "failure"
                })
            }

        } catch (error) { //server error
            console.log("Server error");
            console.error(error);
            res.json({
                message: "User not found, internal server error",
                status: 404
            })
        }
    }

    getRegister(req, res) {
        res.render("register");
    }

    //User Registration Method
    async postRegister(req, res) {
        userService.createUser(req, res);
    }

    //Logout method
    async logout(req, res) {

        const response = await res.clearCookie('secret');
        if (response) {
            console.log("Logging out");
            res.redirect("/");
            // res.status(200).json({
            //     message: "Logged out Successfully!",
            // });
        } else {
            res.redirect("/");
        }
    }
}

module.exports = authService;