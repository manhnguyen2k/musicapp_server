const {db} = require('../config/firestore.js');
const validator = require('validator');
const Playlist = require('../modal/playlist.js');
const unidecode = require('unidecode');
//const db = getFirestore(firebaseApp);
const UserSchema = require('../modal/user.js')
class UserController {
  createDoc = async (req, res, next)=>{
    try {
      const  docId  = req.body.docId;
  console.log(docId)
     // const userRef = db.collection('user').add;
      await db.collection('user').doc(docId).set({
        fav_playlist: [],
      });
      return res.status(200).json({
        code: 200,
        message: 'Create doc successfully',
      });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }

  getPlaylist = async (req, res, next) => {
    try {
      console.log(req.query.id)
      const collectionRef = db.collection('playlist');
      const snapshot = await collectionRef.where('createby', '==', req.query.id).get();
      const data = [];
      snapshot.forEach(doc => {
        data.push({
          id: doc.id,
          ...doc.data()
        });
      });
      console.log(data);
      return res.status(200).json({
        code: 200,
        message: 'Create playlist successfully',
        data: data
      });

    } catch (error) {
      console.error("Error getting playlists: ", error);
      res.status(500).send("Internal Server Error");
    }
  };

  getPlaylistSong = async (req, res, next) => {
    try {
      const playlistId = req.query.id;
      const playlistRef = db.collection('playlist').doc(playlistId);
      const playlistDoc = await playlistRef.get();
      if (!playlistDoc.exists) {
        return res.status(404).json({ error: 'Playlist not found.' });
      }
      const playlistData = playlistDoc.data();
      const playlistSongRef = playlistRef.collection('playlist_song');
      const playlistSongSnapshot = await playlistSongRef.get();
      const playlistSongs = [];
      playlistSongSnapshot.forEach(songDoc => {
        playlistSongs.push(songDoc.data());
      });
      const result = {
        playlist: playlistData,
        songs: playlistSongs
      };
      return res.status(200).json({
        code: 200,
        message: 'Playlist and songs retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error("Error getting playlist and songs: ", error);
      res.status(500).send("Internal Server Error");
    }
  }

  getFavList = async (req, res, next) => {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId in request parameters.' });
      }
      const userRef = db.collection('user').doc(userId);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found.' });
      }
      const userData = userDoc.data();
      return res.status(200).json({
        code: 200,
        message: 'Fav playlist retrieved successfully',
        data: { userId, fav_playlist: userData.fav_playlist }
      });
    } catch (error) {
      console.error('Error getting fav playlist:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  searchSongInFavList = async (req, res, next) => {
    try {
      const userId = req.query.userId;
      const searchQuery = req.query.searchQuery;
      console.log(searchQuery)
      const lowercaseSearchQuery = searchQuery.toLowerCase();
      const sanitizedSearchQuery = sanitizeSearchQuery(searchQuery.toLowerCase());
      console.log(sanitizedSearchQuery)
      if (!userId || !searchQuery) {
        return res.status(400).json({ error: 'Missing userId or searchQuery in request parameters.' });
      }
      const userRef = db.collection('user').doc(userId);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found.' });
      }
      const userData = userDoc.data();
      if (!searchQuery) {
        //console.log('aaaaaaaaaaaaaaaa')
        return res.status(200).json({
          code: 200,
          message: 'All favorites retrieved successfully',
          data: { userId, fav_playlist: userData.fav_playlist }
        });
      }
      const searchResults = userData.fav_playlist.filter(item =>
        unidecode(item.title.toLowerCase()).includes(lowercaseSearchQuery)
      );
      console.log(searchResults)
      return res.status(200).json({
        code: 200,
        message: 'Search results retrieved successfully',
        data: { userId, searchQuery, fav_playlist: searchResults }
      });
    } catch (error) {
      console.error('Error searching for song in favList:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };


  deleteSongFromFav = async (req, res, next) => {
    try {
      const userId = req.params.userId; 
      const songIdToDelete = req.params.songId;
      if (!userId || !songIdToDelete) {
        return res.status(400).json({ error: 'Missing userId or songId in request parameters.' });
      }
      const userRef = db.collection('user').doc(userId);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found.' });
      }
      const userData = userDoc.data();
      const user = new UserSchema(
        userData.username,
        userData.email,
        userData.fav_playlist
      );
      const songIndex = user?.fav_playlist.findIndex((song) => song.encodeId === songIdToDelete);
      if (songIndex === -1) {
        return res.status(404).json({ error: 'Song not found in the fav_playlist.' });
      }
      user.fav_playlist.splice(songIndex, 1);
      await userRef.update({ fav_playlist: user.fav_playlist });
      return res.status(200).json({
        code: 200,
        message: 'Song removed from fav_playlist successfully',
        data: { userId, songId: songIdToDelete }
      });
    } catch (error) {
      console.error('Error removing song from fav_playlist:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  createPlayList = async (req, res, next) => {
    try {
      const requestData = req.body;
      if (!requestData) {
        return res.status(400).json({ error: 'Missing request body data.' });
      }
      const result = await addRecord('playlist', requestData);
      res.status(200).json({ message: 'Data received successfully.', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };



  addSongToFav = async (req, res, next) => {
    try {
      const userId = req.body.id;
      const songData = req.body.songData;
      //console.log(songData)
      if (!userId || !songData) {
        return res.status(400).json({ error: 'Missing userId or songData in request body.' });
      }
      const userRef = db.collection('user').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found.' });
      }
      const userData = userDoc.data();
      const user = new UserSchema(
        userData.username,
        userData.email,
        userData.fav_playlist
      );
      user.addSongToPlaylist(songData);
      await userRef.update({ fav_playlist: user.fav_playlist });
      return res.status(200).json({
        code: 200,
        message: 'Song added to fav_playlist successfully',
        data: { userId, songId: songData }
      });
    } catch (error) {
      console.error('Error adding song to fav_playlist:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

}
async function addRecord(collectionName, data) {
  const collectionRef = db.collection(collectionName);
  const result = await collectionRef.add(data);
  return result.id; 
}
function sanitizeSearchQuery(searchQuery) {
  return searchQuery.replace(/[^\w\s]/gi, '');
}
module.exports = new UserController();
