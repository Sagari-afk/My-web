require("dotenv").config();

const getInstPostsIds = async () => {
  let ids = [];
  try {
    await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
    )
      .then((response) => response.json())
      .then((data) => {
        for (post of data.data) {
          if (post.media_type === "IMAGE") {
            ids.push(post.id);
          }
        }
      });
  } catch (error) {
    alert("Communication error with server!");
  }
  return ids;
};

const getInstPostById = async (postId) => {
  let postData = {};
  await fetch(
    `https://graph.instagram.com/${postId}?fields=id,permalink,media_type,media_url,caption&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
  )
    .then((response) => response.json())
    .then((data) => {
      postData = data;
    })
    .catch((error) => console.error("Error fetching Instagram posts:", error));
  return postData;
};

module.exports = {
  getInstPostsIds,
  getInstPostById,
};
