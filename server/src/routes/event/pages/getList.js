async function getList(req, res, next) {

  try {
    //TODO
    res.status(201).json({
      ok: true,
      eventList: Array.from(Array(20).keys()).map((index) => {
        let event_time = new Date();
        event_time.setHours(event_time.getHours() - index);
        index = 20 - index;
        let statusList =  ["ok", "nok", "repaired", "unidentified"];
        return {
          index,
          _id: `foo-bar-${index}`,
          id: `foo-bar-${index}`,
          event_time,
          status: statusList[index % 4],
          thumbURL: "/assets/ItemButtonImage.svg"
      }})
    });
  }
  catch (err) {
    next(err);
  };
};

export default getList;