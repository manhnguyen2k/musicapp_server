const { ZingMp3 } = require("zingmp3-api-full")
//import {getSong,getDetailPlaylist,getHome,getTop100,getChartHome,getNewReleaseChart,getInfo,getArtist,getArtistSong,getLyric,search,getListMV,getCategoryMV,getVideo} from 'zingmp3-api-full'
class ZingController {

  getSong(req, res) {
    ZingMp3.getSong(req.query.id).then((data) => {
      res.json(data)
    })
  }

  getDetailPlaylist(req, res) {
    ZingMp3.getDetailPlaylist(req.query.id).then((data) => {
      res.json(data)
    })
  }

  getHome(req, res) {
    ZingMp3.getHome().then((data) => {
     //console.log(req)
      res.json(data)
    })
  }

  getTop100(req, res) {
    ZingMp3.getTop100().then((data) => {
      res.json(data);
    })
  }

  getChartHome(req, res) {
    ZingMp3.getChartHome().then((data) => {
      res.json(data);
    })
  }

  getNewReleaseChart(req, res) {
    ZingMp3.getNewReleaseChart().then((data) => {
      res.json(data)
    })
  }

  getInfo(req, res) {
    ZingMp3.getInfoSong(req.query.id).then((data) => {
      res.json(data);
    })
  }

  getArtist(req, res) {
    ZingMp3.getArtist(req.query.name).then((data) => {
      res.json(data)
    })
  }

  getArtistSong(req, res) {
    ZingMp3.getListArtistSong(req.query.id, req.query.page, req.query.count).then((data) => {
      res.json(data)
    })
  }

  getLyric(req, res) {
    ZingMp3.getLyric(req.query.id).then((data) => {
      res.json(data)
    })
  }

  search(req, res) {
    //console.log(req.query.keyword)
    const searchData = sanitizeSearchQuery(req.query.keyword.toLowerCase())
    console.log(searchData)
    ZingMp3.search(searchData).then((data) => {
      console.log(data)
      res.json(data)
    })
  }

  getListMV(req, res) {
    ZingMp3.getListMV(req.query.id, req.query.page, req.query.count).then((data) => {
      res.json(data)
    })
  }

  getCategoryMV(req, res) {
    ZingMp3.getCategoryMV(req.query.id).then((data) => {
      res.json(data)
    })
  }

  getVideo(req, res) {
    ZingMp3.getVideo(req.query.id).then((data) => {
      res.json(data)
    })
  }

}
function sanitizeSearchQuery(searchQuery) {
  return searchQuery.replace(/[^\w\s]/gi, '');
}
module.exports = new ZingController
