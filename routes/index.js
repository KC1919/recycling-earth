const express=require("express");
const router=express.Router();
const verifyGuest=require("../middlewares/verify");
const UserService=require("../services/user");

const userService=new UserService();

router.get("/",async (req,res)=>{
    let data=null;
    
    //checking if the cookie exists, to see if the user is logged in or not
    if(req.cookies["secret"]!==undefined){
        
        //verifying guest to get the user id of the user in request header
        const response=await verifyGuest(req,res,async()=>{
            const user=await userService.getUser(req,res); //getting user info from the database
            
            //if user exists
            if(user!==null){
                
                data={
                    city:user.city,
                    state:user.state,
                    pincode:user.pincode,
                    apiKey:process.env.API_KEY
                }
                //making the map link for the logged in user
                let link=`https://www.google.com/maps/embed/v1/search?key=${data.apiKey}&q=garbage+dump+in+${data.city}+${data.state}+India+near+${data.pincode}`;
            
                res.render("home",{"data":link});
            }
            else{
                res.render("home",{"data":null});
            }
        });

        if(response){
            res.render("home",{"data":null});
        }
    }
    
    //if the user is not logged in we simply render the home page
    else{
        console.log(data);
        res.render("home",{"data":data});
    }
})

router.get("/know-more",(req,res)=>{
    res.render("know-more");
})

router.get("/chat-bot",(req,res)=>{
    res.render("chat-bot");
})
router.get("/secret",verifyGuest,(req,res)=>{
    res.render("secret");
});

router.get("/articles",(req,res)=>{
    res.render("articles");
})
module.exports=router;