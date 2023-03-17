async function get(req, res, next) {

  try {
    //TODO
    let eventId = req.params.eventId;
    res.status(200).json({
      ok: true,
      event: {
        _id: eventId,
        event_time: new Date(),
        event_data: {

        }
      }
    });
  }
  catch (err) {
    next(err);
  };
};

export default get;