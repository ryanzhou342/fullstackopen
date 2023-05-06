const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, current) => {
    return sum + current.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  blogs.sort((a, b) => {
    if (a["likes"] < b["likes"]) {
      return 1;
    } else if (a["likes"] > b["likes"]) {
      return -1;
    } else {
      return 0;
    }
  });

  return blogs.length === 0 ? null : {
    title: blogs[0].title,
    author: blogs[0].author,
    likes: blogs[0].likes
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};