async function getList(req, res, next) {

  try {
    //TODO
    res.status(201).json({
      ok: true,
      eventList: Array.from(Array(20).keys()).map((index) => {
        let event_time = new Date();
        event_time.setHours(event_time.getHours() - index);
        index = 20 - index;
        return {
          index,
          _id: `foo-bar-${index}`,
          id: `foo-bar-${index}`,
          event_time,
          conformity: index % 2 == 0,
          thumbURL: "todo"
      }})
    });
  }
  catch (err) {
    next(err);
  };
};

export default getList;