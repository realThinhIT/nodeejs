// ROUTES CONFIGURATIONS
//
// DEMO CONFIGURATIONS FOR A GROUP ##########
// this will be the configuration for /api/students -> controller: v1/students.getAllStudents()
// {
//     group: '/api',
//
//     endPoints: [
//         {
//             verb: 'get',
//             path: '/students',
//             controller: 'v1/students',
//             callback: 'getAllStudents',
//         }
//     ],
// }
// ##########################################

export default [
    {
        group: '/',

        endPoints: [
            {
                verb: 'all',
                path: '/',
                controller: 'default/index',
                callback: 'homepage',
            }
        ],
    },

    // authentication
    {
        group: '/v1/authentication',

        endPoints: [
            {
                verb: 'post',
                path: '/register',
                controller: 'v1/authentication/register',
                callback: 'register'
            },
            {
                verb: 'post',
                path: '/login',
                controller: 'v1/authentication/login',
                callback: 'login'
            },
            {
                verb: 'post',
                path: '/logout',
                controller: 'v1/authentication/logout',
                callback: 'logout'
            },
            // {
            //     verb: 'post',
            //     path: '/forgotPassword',
            //     controller: 'v1/authentication/forgot-password',
            //     callback: 'forgotPassword'
            // }
        ],
    }
];
