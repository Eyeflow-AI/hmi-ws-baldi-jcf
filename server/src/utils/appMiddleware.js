import Mongo from '../components/mongo.js';

const appMiddleware = () => (req, res, next) => {
  req.app = {
    requestId: Mongo.ObjectId(),
    auth: {}
  };
  next();
};

export default appMiddleware;