async function logout(req, res, next) {

  try {
    res.status(201).json({ ok: true });
  }
  catch (err) {
    next(err);
  };
};

export default logout;