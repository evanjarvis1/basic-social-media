require("dotenv").config();

const { sequelize } = require("./util/database");

const express = require("express");

const cors = require("cors");

const { PORT } = process.env;

const { User } = require("./models/user");

const { Post } = require("./models/post");

User.hasMany(Post);

Post.belongsTo(User);

const {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost,
} = require("./controllers/posts");

//endpoints

const { register, login } = require("./controllers/auth");

const { isAuthenticated } = require("./Middleware/isAuthenticated");

const app = express();

app.use(express.json());

app.use(cors());

app.post(`/register`, register);

app.post("/login", login);

app.get("/posts", getAllPosts);

app.get("/userposts/:userId", getCurrentUserPosts);

app.post("/posts", isAuthenticated, addPost);

app.put("/posts/:id", isAuthenticated, editPost);

app.delete("/posts/:id", isAuthenticated, deletePost);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database synced, and Server up on ${PORT}!`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
