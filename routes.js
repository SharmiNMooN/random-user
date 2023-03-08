const express = require('express');
const joi = require('joi');
const fs = require('fs');
const path = require('path');

const userSchema = joi.object({
    name: joi.string().required(),
    gender: joi.string().required(),
    contact: joi.string().required(),
    address: joi.string().required(),
    photoUrl: joi.string(),
})
const updateUserSchema = joi.object({
    id: joi.number().required(),
    name: joi.string(),
    gender: joi.string(),
    contact: joi.string(),
    address: joi.string(),
    photoUrl: joi.string(),
});

const bulkUpdateUserSchema = joi.array().items(joi.object({
    id: joi.number().required(),
    name: joi.string(),
    gender: joi.string(),
    contact: joi.string(),
    address: joi.string(),
    photoUrl: joi.string(),

}));



const router = express.Router();

router.get("/user/random", async (req,res)=>{
    const filePath =path.join(__dirname, 'user.json');
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
    const filePath =path.join(__dirname, 'user.json');
    const allUsers = JSON.parse(fs.readFileSync(filePath, {
        encoding: 'utf-8'
    }));
    return res.send({
        success: true,
        message: "All user fetch successfully",
        data: allUsers,
    });
})
router.post("/user/save", async (req,res)=>{
     try {
         await userSchema.validateAsync(req.body);
         const filePath =path.join(__dirname, 'user.json');
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
    try {
        const payload = req.body;
        await updateUserSchema.validateAsync(payload);
        const filePath =path.join(__dirname, 'user.json');

        const allUsers = JSON.parse(fs.readFileSync(filePath, {
            encoding: 'utf-8'
        }));
        const userIndex = allUsers.findIndex(u => u.id === payload.id);
        if (userIndex > -1) {
            if (payload.name) {
                allUsers[userIndex].name = payload.name;
            }
            if (payload.address) {
                allUsers[userIndex].address = payload.address;
            }
            if (payload.contact) {
                allUsers[userIndex].contact = payload.contact;
            }
            if (payload.gender) {
                allUsers[userIndex].gender = payload.gender;
            }
            if (payload.photoUrl) {
                allUsers[userIndex].photoUrl = payload.photoUrl;
            }

            fs.writeFileSync(filePath, JSON.stringify(allUsers));
            return res.send({
                success: true,
                message: 'user updated successfully',
                data: allUsers[userIndex],
            })
        } else{
            return res.send({
                success: false,
                message: 'Invalid user id',
            })
        }


    } catch (e) {
        console.log(e)
        return res.status(500).send({
            success: false,
            message: 'An error occur',
            data: e
        })
    }

})

router.patch("/user/bulk-update", async (req,res)=>{
    try {
        const reqUsers = req.body;
        await bulkUpdateUserSchema.validateAsync(reqUsers);
        const filePath =path.join(__dirname, 'user.json');

        const allUsers = JSON.parse(fs.readFileSync(filePath, {
            encoding: 'utf-8'
        }));

        reqUsers.map(payload => {
            const userIndex = allUsers.findIndex(u => u.id === payload.id);
            if (userIndex > -1) {
                if (payload.name) {
                    allUsers[userIndex].name = payload.name;
                }
                if (payload.address) {
                    allUsers[userIndex].address = payload.address;
                }
                if (payload.contact) {
                    allUsers[userIndex].contact = payload.contact;
                }
                if (payload.gender) {
                    allUsers[userIndex].gender = payload.gender;
                }
                if (payload.photoUrl) {
                    allUsers[userIndex].photoUrl = payload.photoUrl;
                }

            }
        });
        fs.writeFileSync(filePath, JSON.stringify(allUsers));
        return res.send({
            success: true,
            message: 'bulk updated successfully',
        })


    } catch (e) {
        console.log(e)
        return res.status(500).send({
            success: false,
            message: 'An error occur',
            data: e
        })
    }
})

router.delete("/user/delete", async (req,res)=>{
    try {
        const userId = req.body.userId;
        const filePath =path.join(__dirname, 'user.json');
        if (!userId) {
            return res.status(400).send({
                success: false,
                message: 'userId required',
            })
        }

        const allUsers = JSON.parse(fs.readFileSync(filePath, {
            encoding: 'utf-8'
        }));
        fs.writeFileSync(filePath, JSON.stringify(allUsers.filter(user => user.id !== userId)));
        return res.send({
            success: true,
            message: 'user deleted successfully',
        })


    } catch (e) {
        console.log(e)
        return res.status(500).send({
            success: false,
            message: 'An error occur',
            data: e
        })
    }
})




module.exports = router;