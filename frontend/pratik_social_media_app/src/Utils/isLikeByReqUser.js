export const isLikedByReqUser = (reqUserId, post) => {
  const likedArray = Array.isArray(post.liked) ? post.liked : [];
  for (let user of likedArray) {
    if (reqUserId === user.id) return true;
  }
  return false;
};
