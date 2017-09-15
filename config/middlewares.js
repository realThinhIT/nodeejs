// MIDDLEWARES CONFIGURATIONS
// 
// DEMO CONFIGURATIONS FOR A GROUP ##########
// eg: group common.middlewares that consists of the api-key
    // common: {
    //     middlewares: [
    //         'api-key'
    //     ]
    // },
// ##########################################

export default {
    common: {
        apiKeyOnly: [
            'api-key'
        ]
    },

    auth: {
        userLoginRequired: [
            'api-key',
            'auth/require-login'
        ]
    }
};