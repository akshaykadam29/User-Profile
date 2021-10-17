const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');

exports.createUser = (req, res, next) => {
  // console.log(req.file);
  const url = req.protocol + "://" + req.get('host');
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        profilePicPath: url + '/images/' + req.file.filename,
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        password: hash,
      });
      user.save()
        .then(createdUser => {
          res.status(201).json({
            message: 'User added successfully!'
          });
        })
        .catch(err => {
          res.status(500).json({
            message: 'Email ID already exists!'
          })
      });
    });
}


exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).then(user => {
    // console.log(user);
      if(!user){
        return res.status(401).json({
          message: 'User not found!'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if(!result){
        return res.status(401).json({
          message: 'Invalid Email or Password!'
        })
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );
      // console.log(token);
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'Invalid credentials!'
      });
    });
}

exports.getUserProfile = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'got',
        profileData: {
          name: result.name,
          email: result.email,
          contact: result.contact,
          profilePicPath: result.profilePicPath
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong!'
      });
    });
}


exports.updateUser = (req, res, next) => {
  let profilePicPath = req.body.profilePic;
  if(req.file){
    const url = req.protocol + '://' + req.get('host');
    profilePicPath = url + '/images/' + req.file.filename;
  }
  const user = new User({
    _id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    contact: req.body.contact,
    profilePicPath: profilePicPath
  });
  console.log(user);
  User.updateOne({ _id: req.body.id }, user).then(result => {
    res.status(200).json({
      message: 'User updated successfully!',
      updatedUser: {
        id: result._id,
        name: result.name,
        email: result.email,
        contact: result.contact,
        profilePicPath: result.profilePicPath
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      message: 'Something went wrong!'
    });
  });
}
