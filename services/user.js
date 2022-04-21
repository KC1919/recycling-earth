const User = require("../models/User");
const bcrypt = require("bcrypt");

class UserService {

    UserService() {

    }

    async createUser(req, res) {
        try {
            const saltRounds = 10;
            // console.log(req.body);
            const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
            // console.log(hashPassword);

            const user = {
                "fname": req.body.fname,
                "lname": req.body.lname,
                "password": hashPassword,
                "mobile": req.body.mobile,
                "email": req.body.email,
                "city": req.body.city,
                "state": req.body.state,
                "pincode": req.body.pincode
            }
            const newUser = await User.create(user);

            if(newUser!==null){
                console.log("User created successfully!");
                // res.status(201).json({
                //     message: "User created Successfully!",
                //     user: newUser
                // });
                res.send({redirectTo:'/auth/login'});
            }else{
                res.send({redirectTo:'/auth/login',message:"invalid"});
            }
        } catch (error) {
            console.log("Failed to create user");
            res.status(500).json({
                message: "Failed to create user,internal server error",
                error: error
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const user = await User.findOne({
                _id: req.user
            });
            console.log(user);
            if (user) {
                const newUser = await User.findByIdAndDelete(req.user);
                console.log("User deleted successfully!");
                return res.status(200).json({
                    message: "User deleted"
                });
            } else {
                console.log("User Not found");
                return res.status(404).json({
                    message: "User not found"
                });
            }
        } catch (error) {
            console.log("Failed to delete user");
            console.error(error);
            return res.status(500).json({
                message: "User not found, internal server error",
                error: error
            });
        }
    }

    async getUser(req,res){
        try {
            const user=await User.findOne({_id:req.user});
            if(user){
                return user;
            }else{
                console.log("User not found");
                return "Not found";
            }
        } catch (error) {
            console.log("User not found, internal server error");
            process.exit();
        }
    }
}

module.exports = UserService;