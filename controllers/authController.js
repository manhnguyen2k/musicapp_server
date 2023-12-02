const { admin } = require('../config/firestore');

class AuthController {
  logIn = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
     
    } catch (error) {
      console.error("Error Login: ", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = new AuthController();
