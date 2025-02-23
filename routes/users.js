const router= require("express").Router();
const User=require("../models/User")
const bcrypt=require('bcrypt')

//UPDATE
router.put("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
       if(req.body.password){
            try{
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password,salt);
            }catch(err){
                return res.status(500).json(err);
            }
       }
       try{
        const user=await User.findByIdAndUpdate(req.params.id,
            {$set:req.body,
            });
            res.status(200).json("Account has been updated");
        }catch(err){
            return res.status(500).json(err.message);
        }

    }
    else
    {
        return res.status(403).json("You can update only your account");
    }
 
})

//DELETE
router.delete("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
      
       try{
        const user=await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been Deleted");
        }catch(err){
            return res.status(500).json(err.message);
        }

    }
    else
    {
        return res.status(403).json("You can Delete only your account");
    }
 
})

//GET A USER
router.get("/:id",async(req,res)=>{
    try{
      const user=await User.findById(req.params.id);
      const {password,updatedAt, ...other}=user._doc
       res.status(200).json(other);
    }catch(err){
        res.status(500).json(err);
    }
})

//FOLLOW A USER
router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId !== req.params.id){
       try{
          const user=await User.findById(req.params.id);
          const currentuser=await User.findById(req.body.userId);
          if(!user.followers.includes(req.body.userId)){
              await user.updateOne({$push:{followers:req.body.userId}})
              await currentuser.updateOne({$push:{followings:req.params.id}})
              res.status(200).json("user has been followed");
          }
          else{
            res.status(403).json("you already follow the user");
          }
       }catch(err){
         res.status(500).json(err);
       }
    }
    else{
        res.status(403).json("You cant follow yourself");
    }
})

// UNFOLLOW A USER

router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId !== req.params.id){
       try{

          const user=await User.findById(req.params.id);
          const currentuser=await User.findById(req.body.userId);

          if(user.followers.includes(req.body.userId)){

              await user.updateOne({$pull:{followers:req.body.userId}})
              await currentuser.updateOne({$pull:{followings:req.params.id}})
              
              res.status(200).json("user has been Unfollowed");
          }
          else{
            res.status(403).json("you dont't follow the user");
          }
       }catch(err){
         res.status(500).json(err);
       }
    }
    else{
        res.status(403).json("You can't Unfollow yourself");
    }
})

module.exports= router
