// ######################################################
// MIDDLEWARE: _example
// ######################################################

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status, detailCode)
// to pass to the controller.
// ################################

// execute before controller
export default async (req, res, done) => {
    // insert middleware logic here

    return done(true, {}, 200);
};