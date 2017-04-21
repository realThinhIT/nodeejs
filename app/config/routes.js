// ROUTES CONFIGURATIONS
//
// DEMO CONFIGURATIONS FOR A GROUP ##########
// this will be the configuration for /students -> controller: v1/students.getAllStudents()
// - type: 'api' for APIs/ 'web' for webapp
//   you can define 'type' for a single endpoint 
// {
//     group: '/api',
//     type: 'api',
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
        type: 'hbs',

        endPoints: [
            {
                verb: 'all',
                path: '/',
                controller: 'frontend/index',
                callback: 'homepage',
            }
        ],
    },

    // authentication
    {
        group: '/v1/authentication',
        type: 'json',

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
    },

    // backend
    {
        group: '/v1/backend',
        type: 'json',

        endPoints: [
            // users
            {
                verb: 'post',
                path: '/users',
                controller: 'v1/backend/users',
                callback: 'create',
            },
            {
                verb: 'get',
                path: '/users',
                controller: 'v1/backend/users',
                callback: 'readAll',
            },
            {
                verb: 'get',
                path: '/users/:id',
                controller: 'v1/backend/users',
                callback: 'readOne',
            },
            {
                verb: 'put',
                path: '/users/:id',
                controller: 'v1/backend/users',
                callback: 'update',
            },
            {
                verb: 'delete',
                path: '/users/:id',
                controller: 'v1/backend/users',
                callback: 'delete',
            }
        ],
    },
];

// CRUD endPoints
            // {
            //     verb: 'post',
            //     path: '/users',
            //     controller: 'v1/backend/users',
            //     callback: 'create',
            // },
            // {
            //     verb: 'get',
            //     path: '/users',
            //     controller: 'v1/backend/users',
            //     callback: 'readAll',
            // },
            // {
            //     verb: 'get',
            //     path: '/users/:id',
            //     controller: 'v1/backend/users',
            //     callback: 'readOne',
            // },
            // {
            //     verb: 'put',
            //     path: '/users/:id',
            //     controller: 'v1/backend/users',
            //     callback: 'update',
            // },
            // {
            //     verb: 'delete',
            //     path: '/users/:id',
            //     controller: 'v1/backend/users',
            //     callback: 'delete',
            // }