const db = require('../config/firestore.js');

const Playlist = require('../modal/playlist.js');
//const db = getFirestore(firebaseApp);
const UserSchema = require('../modal/user.js')
class UserController {
  getPlaylist = async (req, res, next) => {
    try {
      const collectionRef = db.collection('playlist');
      const snapshot = await collectionRef.where('createby', '==', req.query.id).get();

      const data = [];
      snapshot.forEach(doc => {
        // Lấy ID của document và thêm nó vào dữ liệu trả về
        data.push({
          id: doc.id,
          ...doc.data()
        });
      });

      //console.log(data);
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

      // Truy vấn collection "playlist" để lấy thông tin playlist
      const playlistRef = db.collection('playlist').doc(playlistId);
      const playlistDoc = await playlistRef.get();

      // Kiểm tra xem playlist có tồn tại không
      if (!playlistDoc.exists) {
        return res.status(404).json({ error: 'Playlist not found.' });
      }

      // Lấy thông tin của playlist
      const playlistData = playlistDoc.data();

      // Truy vấn collection "playlist_song" trong playlist để lấy danh sách bài hát
      const playlistSongRef = playlistRef.collection('playlist_song');
      const playlistSongSnapshot = await playlistSongRef.get();

      const playlistSongs = [];
      playlistSongSnapshot.forEach(songDoc => {
        // Lấy dữ liệu từ mỗi document trong collection "playlist_song"
        playlistSongs.push(songDoc.data());
      });

      // Kết hợp thông tin của playlist và danh sách bài hát
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
      const userId = req.query.userId; // Sử dụng params hoặc query tùy thuộc vào cách bạn truyền tham số
     // console.log(userId)
      // Kiểm tra xem userId có tồn tại không
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId in request parameters.' });
      }

      // Truy vấn user để kiểm tra xem nó có tồn tại không
      const userRef = db.collection('user').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Lấy thông tin user
      const userData = userDoc.data();

      // Trả về fav_playlist của user
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




  deleteSongFromFav = async (req, res, next) => {
    try {
      const userId = req.params.userId; // Assuming userId is in the URL params
      const songIdToDelete = req.params.songId; // Assuming songId is in the URL params
      console.log(userId )
      console.log(songIdToDelete )
      // Check if userId and songIdToDelete are provided
      if (!userId || !songIdToDelete) {
        return res.status(400).json({ error: 'Missing userId or songId in request parameters.' });
      }

      // Query user to check if it exists
      const userRef = db.collection('user').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Get user data
      const userData = userDoc.data();

      // Create UserSchema object from user data
      const user = new UserSchema(
        userData.username,
        userData.email,
        userData.fav_playlist
      );
       console.log(user)
      // Check if the song exists in the fav_playlist
      const songIndex = user?.fav_playlist.findIndex((song) => song.encodeId === songIdToDelete);


      if (songIndex === -1) {
        return res.status(404).json({ error: 'Song not found in the fav_playlist.' });
      }

      // Remove the song from fav_playlist
      user.fav_playlist.splice(songIndex, 1);

      // Update fav_playlist in Firestore
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
      // Lấy dữ liệu từ body của yêu cầu
      const requestData = req.body;

      // Kiểm tra xem dữ liệu có tồn tại không
      if (!requestData) {
        return res.status(400).json({ error: 'Missing request body data.' });
      }
      //console.log(requestData)
      // Thực hiện xử lý với dữ liệu từ body (requestData)
      // Ví dụ: Thêm dữ liệu vào Firestore
      //const result = await yourFirestoreFunction(requestData);
      const result = await addRecord('playlist', requestData);
      // res.json({ message: 'Record created successfully.', result });
      // Trả về phản hồi thành công nếu cần
      res.status(200).json({ message: 'Data received successfully.', result });
    } catch (error) {
      console.error(error);
      // Xử lý lỗi nếu cần
      res.status(500).json({ error: 'Internal server error.' });
    }
  };



  addSongToFav = async (req, res, next) => {
    try {
      const userId = req.body.id;
      const songData = req.body.songData;
      //console.log(songData)
      // Kiểm tra xem dữ liệu có đầy đủ không
      if (!userId || !songData) {
        return res.status(400).json({ error: 'Missing userId or songData in request body.' });
      }

      // Query user to check if it exists
      const userRef = db.collection('user').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Get user data
      const userData = userDoc.data();

      // Create UserSchema object from user data
      const user = new UserSchema(

        userData.username,

        userData.email,
        userData.fav_playlist
      );
      // console.log(user)
      // Add song to fav_playlist of the user
      user.addSongToPlaylist(songData);

      // Update fav_playlist in Firestore
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

  return result.id; // Trả về ID của bản ghi mới được thêm vào
}

module.exports = new UserController();
