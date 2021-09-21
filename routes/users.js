const router = new require('express').Router();
const UserModel = require('../models/Users');
const uploader = require('./../config/cloudinary');
const protectRoute = require('./../middlewares/protectPrivateRoute');

const bcrypt = require('bcrypt');
const auth = require('./../auth');

router.get('/users/favoris', auth, async (req, res, next) => {
  try {
    let favoris = mongoose.Types.ObjectId(req.params.id);
    const getFav = await UserModel.findById().populate('favoris');
    res.json(getFav);
    if (!favoris) {
      return res.status(404).json({ msg: 'Experience not found' });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const getUser = await UserModel.findById(req.params.id);
    res.json(getUser);
  } catch (err) {
    next(err);
  }
});

// console.log("heloooooooooooooo")
// router.post("/signup", async (req, res, next) => {

//   try {
//     const newUser = await UserModel.create(req.body); //req.body contient les infos postées
//     return res.json(newUser)

//   } catch (err) {
//     next(err)
//   }
// });
// console.log("heloooooooooooooo")

router.patch('/:id', auth.authenticate, async (req, res, next) => {
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (err) {
    next(err);
  }
});

console.log('heyyyyyy');
router.delete('/:id', async (req, res, next) => {
  try {
    const deleteUser = await UserModel.findByIdAndDelete(req.params.id);
    res.json(deleteUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
