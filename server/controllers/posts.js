const { DataTypes } = require("sequelize");
const { sequelize } = require("../util/database");
const { Post } = require("../models/post");
const { User } = require("../models/user");

module.exports = {
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.findAll({
        where: { privateStatus: false },
        include: [
          {
            model: User,
            required: true,
            attributes: [`username`],
          },
        ],
      });
      res.status(200).send(posts);
    } catch (error) {
      console.log("ERROR IN getAllPosts");
      console.log(error);
      res.sendStatus(400);
    }
  },

  getCurrentUserPosts: async (req, res) => {
    try {
      const { userId } = req.params;

      const posts = await Post.findAll({
        where: { userId: userId },
        include: [
          {
            model: User,
            required: true,
            attributes: ["username"],
          },
        ],
      });
      res.status(200).send(posts);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  addPost: async (req, res) => {
    try {
      const { title, content, status, userId } = req.body;

      await Post.create({ title, content, privateStatus: status, userId });

      res.status(200).send("Post created successfully!");
    } catch (err) {
      res.status(400).send(err);
    }
  },

  editPost: async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;

      await Post.update({ privateStatus: status }, { where: { id: id } });
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
    }
  },

  deletePost: async (req, res) => {
    try {
      const { id } = req.params;

      await Post.destroy({ where: { id: id } });
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
    }
  },

  // Post: sequelize.define("post", {
  //   id: {
  //     type: DataTypes.INTEGER,
  //     autoIncrement: true,
  //     allowNull: false,
  //     primaryKey: true,
  //   },
  //   title: DataTypes.STRING,
  //   content: DataTypes.TEXT,
  //   privateStatus: DataTypes.BOOLEAN,
  // }),
};
