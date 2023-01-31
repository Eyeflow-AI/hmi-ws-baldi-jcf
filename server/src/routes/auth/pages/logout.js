import verifyToken from "../utils/verifyToken";


async function logout(req, res, next) {

  try {
    let { token } = req.body.auth;
    if (token) {
      let verifiedToken = verifyToken(token);
      if (verifiedToken) {
        res.status(201).json({ ok: true });
      }
      else {
        let err = new Error('Token not valid');
        next(err)
      }
    }
  }
  catch (err) {
    next(err);
  };
};

export default logout;