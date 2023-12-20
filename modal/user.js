class UserSchema {
    constructor(username, email, fav_playlist = []) {
      this.username = username;
      this.email = email;
      this.fav_playlist = fav_playlist;
    }
  
    addSongToPlaylist(newSong) {
      const existingSong = this.fav_playlist.find(song => song.encodeId === newSong.encodeId);
      if (!existingSong) {
        //console.log(1111111111111111)
        this.fav_playlist.push(newSong);
      }
    }
  }
  
  module.exports = UserSchema;