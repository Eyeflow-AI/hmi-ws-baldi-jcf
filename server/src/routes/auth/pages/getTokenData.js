function verifyToken(req, res, next) {
   let tokenExpiration = new Date(req.app.auth.tokenPayload.exp * 1000);
   res.json({ ok: true, tokenPayload: req.app.auth.tokenPayload, tokenExpiration });
};

export default verifyToken;