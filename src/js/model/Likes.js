export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLikedRecipe(id, title, author, image) {
    const like = { id, title, author, image };
    this.likes.push(like);
    this.persistData();
    return like;
  }

  removeLikedRecipe(id) {
    const index = this.likes.findIndex((el) => el.id === id);
    this.likes.splice(index, 1);
    this.persistData();
  }

  isLiked(id) {
    return this.likes.findIndex((el) => el.id === id) !== -1;
  }

  getLikesCount() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }

  readStorage() {
    const storage = localStorage.getItem("likes");
    if (storage != null) {
      this.likes = JSON.parse(storage);
    }
  }
}
