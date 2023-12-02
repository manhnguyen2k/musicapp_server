const auth = require('../../config/firestore');

	const  decodeToken = async (req, res, next)=> {
		//console.log(auth.auth)
		const token = req.headers?.authorization.split(' ')[1];
		console.log(token)
		try {
			const decodeValue = await auth.auth.verifyIdToken(token);
			console.log(decodeValue)
			if (decodeValue) {
				req.user = decodeValue;
				return next();
			}
			return res.json({ message: 'Un authorize' });
		} catch (e) {
			console.error(e)
			return res.json({ message: e });
		}
	}


module.exports = decodeToken;
