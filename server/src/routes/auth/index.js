import express from 'express';
import { isAuthenticated, isAuthorized } from './middleware';
import {
  Login
  , LoginByIp
  , GetTokenData
  , GetAccessControlData
  , GetUsersList
  , Logout
  , CreateUser
  , DeleteUser
  , PutUserRole
  , ResetPassword
  , CreateRole
  , EditRole
  , DeleteRole
} from './pages';
// import GetTokenData from './getTokenData';

const router = express.Router();

router.post('/login', Login);
router.post('/login/ip', LoginByIp);
router.post('/logout', isAuthenticated, Logout);
router.get('/verify-token', isAuthenticated, GetTokenData);
router.post('/user', isAuthenticated, CreateUser);
router.get('/access-control-data', isAuthenticated, GetAccessControlData);
router.get('/users-list', isAuthenticated, GetUsersList);
router.delete('/user', isAuthenticated, DeleteUser);
router.put('/user/role', isAuthenticated, PutUserRole);
router.put('/user/reset-password', isAuthenticated, ResetPassword);


router.post('/role', isAuthenticated, isAuthorized(['master', 'userManagement']), CreateRole);
router.put('/role', isAuthenticated, isAuthorized(['master', 'userManagement']), EditRole);
router.delete('/role', isAuthenticated, isAuthorized(['master', 'userManagement']), DeleteRole);
// router.get('/user', isAuthenticated, Auth.listUser);
// router.post('/user', isAuthenticated, isAuthorized(['userManagement']), Auth.createUser);
// router.delete('/user', isAuthenticated, isAuthorized(['userManagement']), Auth.deleteUser);
// router.put('/user/role', isAuthenticated, isAuthorized(['userManagement']), Auth.changeUserRole);
// router.put('/user/password', isAuthenticated, isAuthorized(['userManagement']), Auth.changePassword);
// router.put('/user/reset-password', isAuthenticated, isAuthorized(['userManagement']), Auth.resetPassword);

export { isAuthenticated, isAuthorized };
export default router;
