const db = require('../models');
const User = db.user;
const passwordUtil = require('../util/passwordComplexityCheck');

module.exports.create = (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      res.status(400).send({ message: 'Content can not be empty!' });
      return;
    }
    const password = req.body.password;
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      res.status(400).send({ message: passwordCheck.error });
      return;
    }
    const user = new User(req.body);
    user
      .save()
      .then((data) => {
        console.log(data);
        res.status(201).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Some error occurred while creating the user.'
        });
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.getAll = (req, res) => {
  try {
    User.find({})
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving users.'
        });
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.getUser = (req, res) => {
  try {
    const username = req.params.username;
    User.find({ username: username })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving users.'
        });
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const username = req.params.username;
    if (!username) {
      res.status(400).send({ message: 'Invalid Username Supplied' });
      return;
    }
    const password = req.body.password;
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      res.status(400).send({ message: passwordCheck.error });
      return;
    }
    const user = await User.findOne({ username: username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.username = req.params.username;
    user.password = req.body.password;
    user.displayName = req.body.displayName;
    user.info = req.body.info;
    user.profile = req.body.profile;
    await user.save();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while updating the user.' });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const username = req.params.username;
    if (!username) {
      res.status(400).send({ message: 'Invalid Username Supplied' });
      return;
    }
   
    const result = await User.deleteOne({ username: username });
   
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while deleting the user.' });
  }
};