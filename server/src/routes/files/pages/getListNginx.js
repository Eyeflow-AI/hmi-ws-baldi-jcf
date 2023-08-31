import axios from 'axios';

async function getListNginx(req, res, next) {
  try {
    let dirPath = req.query.dirPath;
    let host = req.query.host;
    let port = req.query.port;
    if (dirPath && host && port) {
      let url = `${host}:${port}${dirPath}`;
      console.log({ host, port, dirPath, url })
      axios.get(url)
        .then(response => {
          console.log('Directory listing:', response.data);
          // directoryListElement.innerHTML = htmlListItems;
          res.status(200).json({ ok: true });


        })
        .catch(error => {
          console.error('Error fetching directory listing:', error);
        });
    }
  }
  catch (err) {
    next(err);
  }
};

export default getListNginx;