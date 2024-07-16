const express = require('express');
const axios = require('axios');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  // enclose in a try-catch block for error handling
  try {
    const { start = 0, limit = 10 } = req.query;
    const posts = await fetchPosts({ start, limit });

    const postsWithImagesAndUsers = await Promise.all(
      posts.map(async post => {
        const user = await fetchUserById(post.userId);
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/albums/${post.id}/photos`,
        );
        const images = response.data.slice(0, 3); // Limit to 3 images per post

        return {
          ...post,
          user,
          images: images.map(img => ({ url: img.url })),
        };
      }),
    );

    res.json(postsWithImagesAndUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts or images' });
  }
});

module.exports = router;
