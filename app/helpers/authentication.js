import NodeeModel from 'nodee/nodee-model';
const { PCallback } = NodeeModel.Utils;

export default {
  async getAuthorizationHeader(req, callback) {
    let authorization = (req.headers.authorization) ? req.headers.authorization : ' ';
    let parts = authorization.split(' ');
    let authorizationType    = parts[0].toLowerCase();
    let authorizationContent = parts[1];

    if (authorizationType === 'basic') {
      if (authorizationContent) {
        authorizationContent = Buffer.from(authorizationContent, 'base64').toString('ascii');
      } else {
        authorizationContent = ':';
      }
      authorizationContent = authorizationContent.split(':');

      let username = authorizationContent[0];
      let password = authorizationContent[1];

      let result = {
        type: 'basic',
        username: (username) ? username : '',
        password: (password) ? password : ''
      };

      PCallback(callback)(undefined, result);
      return result;
    } else if (authorizationType === 'bearer') {
      let result = {
        type: 'bearer',
        token: (authorizationContent) ? authorizationContent : ''
      };

      PCallback(callback)(undefined, result);
      return result;
    } else {
      PCallback(callback)(new Error('authorization type is invalid'));
      throw new Error('authorization type is invalid');
    }
  }
};
