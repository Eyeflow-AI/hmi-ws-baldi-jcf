import express from 'express';
import { isAuthenticated, isAuthorized } from './middleware';
import {
  Login
  , GetTokenData
  , GetAccessControlData
} from './pages';
// import GetTokenData from './getTokenData';

const router = express.Router();


router.post('/login', Login);
router.get('/verify-token', isAuthenticated, GetTokenData);
router.get('/access-control-data', isAuthenticated, GetAccessControlData);

// router.get('/user', isAuthenticated, Auth.listUser);
// router.post('/user', isAuthenticated, isAuthorized(['userManagement']), Auth.createUser);
// router.delete('/user', isAuthenticated, isAuthorized(['userManagement']), Auth.deleteUser);
// router.put('/user/role', isAuthenticated, isAuthorized(['userManagement']), Auth.changeUserRole);
// router.put('/user/password', isAuthenticated, isAuthorized(['userManagement']), Auth.changePassword);
// router.put('/user/reset-password', isAuthenticated, isAuthorized(['userManagement']), Auth.resetPassword);


export default router;
