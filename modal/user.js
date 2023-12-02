class UserSchema {
    constructor(username, email, fav_playlist = []) {
      this.username = username;
      this.email = email;
      this.fav_playlist = fav_playlist;
    }
  
    addSongToPlaylist(newSong) {
      // Check if the song already exists in the playlist
      const existingSong = this.fav_playlist.find(song => song.encodeId === newSong.encodeId);
       // console.log((newSong.en))
      if (!existingSong) {
        // Add the new song to the playlist if it doesn't already exist
        console.log(1111111111111111)
        this.fav_playlist.push(newSong);
      }
    }
  }
  
  module.exports = UserSchema;