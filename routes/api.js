const { Thought, User } = require('../models')

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


router.get('/thoughts', async function (req, res){
    const thoughts = await Thought.find({});
    console.log(thoughts)
    
    res.json(thoughts);
});


router.get('/thoughts/:id', async function (req, res) {
   try{
       const thought = await Thought.findOne({
           _id: req.params.id,
       });
       res.json(thought);
   } catch (err){
    res.status(500).json(err)
   }
})

router.post('/thoughts', function (req, res) {
    const data = Thought.create({
        thoughtText: req.body.thoughtText,
        username: req.body.username,
        userId: req.body.userId
    }).then((thought) => {
        return User.findByIdAndUpdate(
            {_id: req.body.userId},
            {$addToSet: {thoughts: thought._id}},
            {new: true}
        );
        })
        .then((user) => 
        !user
        ? res.status(404).json({
            message: 'Thought created, but found no user with that ID',
        })
        : res.json('Created Thought')
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.put('/thoughts/:id', async function (req, res) {
    try {
        const updated = await Thought.findByIdAndUpdate(req.params.id, {
            thoughtText: req.body.thoughtText
        }, {new: true})
        res.json(updated);
    } catch(err){
        res.status(500).json(err)
    }
})

router.delete('/thoughts/:id', async function (req, res) {
        const deleted = await Thought.findByIdAndDelete(req.params.id);
        res.json({data: 'success!'})
  
})

router.post('/thoughts/:id/reactions', async function (req, res) {
    const body = req.body;
  
    try {
      const dbThoughtData = await Thought.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { reactions: body }},
        { new: true }
      );
      
      if (!dbThoughtData) {
        return res.status(404).json({ message: "No Thought Found."});
      }
  
      return res.json(dbThoughtData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  });

  router.delete('/thoughts/:thoughtId/reactions/:reactionId', async function(req, res) {
    try {
      const { thoughtId, reactionId } = req.params;
  
      const dbThoughtData = await Thought.findByIdAndUpdate(thoughtId, {
        $pull: { reactions: { _id: reactionId } }
      }, { new: true });
  
      if (!dbThoughtData) {
        return res.status(404).json({ message: "No Thought Found." });
      }
  
      return res.json(dbThoughtData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  });

  router.post('/users/:id/friends', async function(req, res) {
    const { id } = req.params;
    const { friendId } = req.body;
  
    try {
      const dbUserData = await User.findByIdAndUpdate(id, {
        $addToSet: { friends: friendId }
      }, { new: true });
  
      if (!dbUserData) {
        return res.status(404).json({ message: "No User Found." });
      }
  
      return res.json(dbUserData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  });

  router.delete('/users/:id/friends/:friendId', async function(req, res) {
    const { id, friendId } = req.params;
  
    try {
      const dbUserData = await User.findByIdAndUpdate(id, {
        $pull: { friends: friendId }
      }, { new: true });
  
      if (!dbUserData) {
        return res.status(404).json({ message: "No User Found." });
      }
  
      return res.json(dbUserData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  });
  
  

  
  




module.exports = router