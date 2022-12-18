const User = require('../models/User');

const router = require('express').Router();

router.get('/users', async function (req, res){
    const users = await User.find({});
    res.json(users);
});

router.get('/users/:id', async function (req, res){
    const users = await User.findOne({
        _id: req.params.id
    });
    res.json(users);
});

router.post('/users', async function (req, res){
    const user = await User.create({
        username: req.body.username,
        email: req.body.email
    });
    res.json(user);
});

router.put('/users/:id', async function (req, res){
   try {
       const updated = await User.findByIdAndUpdate(req.params.id, {
           email: req.body.email,
       }, { new: true, runValidators: true });
       
       res.json(updated)
   } catch(err){
    res.status(500).json(err)
   }
});

module.exports = router