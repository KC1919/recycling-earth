const express=require("express");
const router=express.Router();
const AuthService=require("../services/auth");
const UserService = require("../services/user");

const userService=new UserService();
const verify=require("../middlewares/verify");
const res = require("express/lib/response");

let authService=new AuthService();

//Login routes
router.get("/login",authService.getLogin);
router.post("/login",authService.postLogin);

//Register routes
router.get("/register",authService.getRegister);
router.post("/register",authService.postRegister);

//Delete Route
router.delete("/delete",verify,userService.deleteUser);

//Logout
router.get('/logout',verify,authService.logout);

module.exports=router;