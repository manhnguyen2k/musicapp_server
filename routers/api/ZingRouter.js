const express = require("express")
const router = express.Router()
const userController = require('../../controllers/userController')
const ZingController = require("../../controllers/ZingController")
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
// getSong
router.get("/song", ZingController.getSong)

// getDetailPlaylist
router.get("/detailplaylist", ZingController.getDetailPlaylist)
router.get("/playlist", userController.getPlaylist)
router.get("/playlist/songs", userController.getPlaylistSong)
router.get("/favlist", userController.getFavList)
router.post("/addplaylist", userController.createPlayList)
router.post("/addsongtofav", userController.addSongToFav)
router.delete('/deleteSongFromFav/:userId/:songId', userController.deleteSongFromFav);

// getHome
router.get("/home", ZingController.getHome)

// getTop100
router.get("/top100", ZingController.getTop100)

// getChartHome
router.get("/charthome", ZingController.getChartHome)

// getNewReleaseChart
router.get("/newreleasechart", ZingController.getNewReleaseChart)

// getInfoSong
router.get("/infosong", ZingController.getInfo)

// getArtist
router.get("/artist", ZingController.getArtist)

// getArtistSong
router.get("/artistsong", ZingController.getArtistSong)

// getLyric
router.get("/lyric", ZingController.getLyric)

// search
router.get("/search", ZingController.search)

// getListMV
router.get("/listmv", ZingController.getListMV)

// getCategoryMV
router.get("/categorymv", ZingController.getCategoryMV)

// getVideo
router.get("/video", ZingController.getVideo)

module.exports = router
