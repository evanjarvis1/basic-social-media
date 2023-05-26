require("dotenv").config();

const { SECRET } = process.env;

const { User } = require("../models/user");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const createToken = (username, id) => {
  return jwt.sign(
    {
      username,
      id,
    },
    SECRET,
    {
      expiresIn: "2 days",
    }
  );
};

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body;
    let foundUser = await User.findOne({ WHERE: { username: username } });
    try {
      if (foundUser === true) {
        const isAuthenticated = bcrypt.compareSync(
          password,
          foundUser.hashedPass
        );
        if (isAuthenticated) {
          const token = createToken(
            foundUser.dataValues.username,
            foundUser.dataValues.id
          );
          const exp = Date.now() + 1000 * 60 * 60 * 48;
        } else {
          res.status(400).send("Could not log in");
        }
      } else {
        res.status(400).send("Log in request failed");
      }
    } catch (err) {
      res.status(400).send(err);
    }
  },

  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      let foundUser = await User.findOne({ where: { username: username } });

      if (foundUser === true) {
        res.status(400).send("User Already exists");
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = await User.create({
          username: username,
          hashedPass: hash,
        });

        const token = createToken(
          newUser.dataValues.username,
          newUser.dataValues.id
        );

        const exp = Date.now() + 1000 * 60 * 60 * 48;

        res.status(200).send({
          username: newUser.dataValues.username,
          userId: newUser.dataValues.id,
          token: token,
          exp: exp,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
