const sequelize = require("../config/connection");
const { User, Post, Comment } = require("../models");
const userData = require("./userData.json");
const postData = require("./postData.json");
const commentData = require("./commentData.json");

const getRandomUserId = (users) => {
  const randomIndex = Math.floor(Math.random() * users.length);
  return users[randomIndex].id;
};

const getRandomPostId = (posts) => {
  const randomIndex = Math.floor(Math.random() * posts.length);
  return posts[randomIndex].id;
};

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const posts = await Post.bulkCreate(postData, {
    individualHooks: true,
    returning: true,
  });

  for (const post of posts) {
    const randomUserId = getRandomUserId(users);

    await post.update({
      user_id: randomUserId,
    });
  }

  for (const comment of commentData) {
    const randomUserId = getRandomUserId(users);
    const randomPostId = getRandomPostId(posts);

    await Comment.create({
      ...comment,
      user_id: randomUserId,
      post_id: randomPostId,
    });
  }

  process.exit(0);
};

seedDatabase();
