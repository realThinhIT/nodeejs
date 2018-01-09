// ######################################################
// MIDDLEWARE: authentication/require-login
// ######################################################

import Nodee from '../../nodee';
const { LoginToken } = Nodee.Models;
const { ErrorCode, DetailCode } = Nodee.Config;
const { AuthenticationHelper } = Nodee.Helpers;
const { Exception } = Nodee.Core;

// #############################################
// MODIFY THIS!
// after finish verifying, send data 
// or an Nodee.Core.Exception in case of failure 
// to pass to the controller.
// #############################################

// execute before controller
export default async (req, res) => {
  // insert middleware logic here
  let loginInfo;
  try {
    loginInfo = await AuthenticationHelper.getAuthorizationHeader(this.req);

    if (loginInfo.type !== 'bearer') {
      throw new Error();
    }
  } catch (e) {
    throw new Exception(
      'invalid authentication type', 
      ErrorCode.http.BAD_REQUEST, 
      DetailCode.auth.INVALID_AUTH_TYPE
    );
  }

  let user;
  try {
    user = await (new LoginToken()).findUserByLoginToken(loginInfo.token);
  } catch (e) {
    throw new Exception(
      'invalid access token, token has been disabled or token has expired', 
      ErrorCode.http.INVALID_CREDENTIALS, 
      e.code
    );
  }

  if (user.usergroup !== 1) {
    throw new Exception(
      'you must be an admin to get access to this functionality', 
      ErrorCode.http.INVALID_CREDENTIALS, 
      DetailCode.auth.PERMISSION_DENIED
    );
  }

  return {};
};