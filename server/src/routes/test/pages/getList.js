async function getList(req, res, next) {

  res.status(200).json({
    ok: true, cameras_list: [
      {
        camera_name: "1",
        frame_time: 1000,
      },
      {
        camera_name: "2",
        frame_time: 1000,
      },
      {
        camera_name: "3",
        frame_time: 1000,
      },

      {
        camera_name: "4",
        frame_time: 1000,
      },

      {
        camera_name: "4",
        frame_time: 1000,
      },

      {
        camera_name: "4",
        frame_time: 1000,
      },
    ]
  });
};

export default getList;