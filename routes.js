const express = require('express');
const joi = require('joi');
const fs = require('fs');
const userSchema = joi.object({
    name: joi.string().required(),
    gender: joi.string().required(),
    contact: joi.string().required(),
    address: joi.string().required(),
    photoUrl: joi.string(),

})


const router = express.Router();

router.get("/user/random", async (req,res)=>{
    const filePath = 'user.json';
    const allUsers = JSON.parse(fs.readFileSync(filePath, {
        encoding: 'utf-8'
    }));
    const randomIndex = Math.floor(Math.random() * ((allUsers.length - 1) + 1));
    return res.send({
        success: true,
        message: "Random user fetch successfully",
        data: allUsers[randomIndex],
    });

})

router.get("/user/all", async (req,res)=>{

})
router.post("/user/save", async (req,res)=>{
     try {
         await userSchema.validateAsync(req.body);
         const filePath = 'user.json';
         const user = req.body;
         const allUsers = JSON.parse(fs.readFileSync(filePath, {
             encoding: 'utf-8'
         }));
         console.log({allUsers});

         if(allUsers.length) {
            user.id = allUsers[allUsers.length - 1].id + 1;
         } else {
             user.id = 1;
         }
         allUsers.push(user);
         fs.writeFileSync(filePath, JSON.stringify(allUsers))
         return res.send({
             success: true,
             message: "User save successfully",
             data: user
         })
     } catch (e) {
         return res.status(500).send({
             success: false,
             message: 'An error occur',
             data: e
         })
     }

})

router.patch("/user/update", async (req,res)=>{

})

router.patch("/user/bulk-update", async (req,res)=>{

})

router.delete("/user/delete", async (req,res)=>{

})




module.exports = router;