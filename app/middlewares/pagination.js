// ######################################################
// MIDDLEWARE: pagination
// ######################################################

let middleware = {};

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status, detailCode)
// to pass to the controller.
// ################################

// execute before controller
middleware.beforeAction = (req, res, done) => {
    // insert middleware logic here

    let pagination = {};

    pagination.select = {
        skip: parseInt(req.query.itemsPerPage) * (parseInt(req.query.page) - 1),
        limit: (parseInt(req.query.itemsPerPage)) ? parseInt(req.query.itemsPerPage) : null
    };

    if (req.query.sortBy != null) {
        pagination.select.sort = {};
        pagination.select.sort[req.query.sortBy] = (req.query.sort != null) ? ( (req.query.sort === 'ASC') ? 1 : -1 ) : -1; 
    }

    if (req.query.q != null) {
        let condition = {};
        
        pagination.search = function (fields) {
            if (fields instanceof Array) {
                condition = {
                    $or: [

                    ]
                }

                let i = 0;

                fields.forEach(function (field) {
                    condition.$or[i] = {};
                    condition.$or[i][field] = new RegExp(req.query.q, 'i');
                    i++;
                });
            } else {
                condition = {};
            }

            return condition;
        }
    }

    return done(true, pagination, 200);
};

// ################################

export default middleware;
