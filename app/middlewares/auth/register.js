// ######################################################
// MIDDLEWARE: authentication/register
// ######################################################

import Nodee from '../../nodee';
const { ErrorCode, DetailCode } = Nodee.Config;
const { Exception } = Nodee.Core;

// #############################################
// MODIFY THIS!
// after finish verifying, send data 
// or an Nodee.Core.Exception in case of failure 
// to pass to the controller.
// #############################################

// execute before controller
export default (req, res) => {
  // insert middleware logic here
  if (!req.body) {
    throw new Exception(
      'user registration info is empty', 
      ErrorCode.http.BAD_REQUEST, 
      DetailCode.register.INFO_EMPTY
    );
  }

  return {};
};
