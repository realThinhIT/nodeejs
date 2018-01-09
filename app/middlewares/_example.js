// ######################################################
// MIDDLEWARE: _example
// ######################################################

import Nodee from '../nodee';
const { Exception } = Nodee.Core;

// #############################################
// MODIFY THIS!
// after finish verifying, send data 
// or an Nodee.Core.Exception in case of failure 
// to pass to the controller.
// #############################################

export default async (req, res, done, previous) => {
  // insert middleware logic here

  if (false) {
    throw new Exception();
  }

  return {};
};