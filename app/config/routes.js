module.exports = [
    // DEMO CONFIGURATIONS FOR A GROUP ##########
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

    {
        group: '/',

        endPoints: [
            {
                verb: 'get',
                path: '/',
                controller: 'default/index',
                callback: 'homepage',
            }
        ],
    }
];
