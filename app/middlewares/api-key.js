// ######################################################
// MIDDLEWARE: API KEY AUTHENTICATION
// ######################################################

import Nodee from 'nodee';
const { GlobalConfig, ErrorCode, DetailCode } = Nodee.Config;
const { Exception } = Nodee.Core;

// #############################################
// MODIFY THIS!
// after finish verifying, send data 
// or an Nodee.Core.Exception in case of failure 
// to pass to the controller.
// #############################################

export default async (req, res) => {
  // insert middleware logic here
  if (req.get('X-Api-Key') !== GlobalConfig.API_KEY) {
    throw new Exception('invalid api key', ErrorCode.http.INVALID_CREDENTIALS, DetailCode.auth.INVALID_API_KEY);
  }

  return {};
};