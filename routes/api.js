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
    res.status(422).json(err)
   }
});

router.delete('/users/:id', async function (req, res){
 const deleted = await User.findByIdAndDelete(req.params.id);
    res.json({ data: 'success!'})
});

router.post('/users/:userId/friends/:friendId', async function (req, res){

   const updated = await User.findByIdAndUpdate(req.params.userId, {
        $push: {
            friends: req.params.friendId
        }
    }, {new: true});
    res.json(updated);
});

router.delete('/users/:userId/friends/:friendId', async function (req, res){

   const updated = await User.findByIdAndUpdate(req.params.userId, {
        $pull: {
            friends: req.params.friendId
        }
    }, {new: true});
    res.json(updated);
});


module.exports = router