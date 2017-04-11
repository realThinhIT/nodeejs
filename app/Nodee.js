// ######################################################
// CORE: Nodee
// ######################################################

import mongoose         from 'mongoose';

import globalConfig     from './config/global';
import jsonConfig       from './config/render-engine/json-config';
import hbsConfig        from './config/render-engine/hbs-config';
import dbConfig         from './config/database';

import middlewareGroups from './config/middlewares';
import errorCodes       from './config/params/error-codes';
import detailCodes      from './config/params/detail-codes';
import consts           from './config/params/consts';

import log              from './modules/nodee/plog';
import pcallback        from './modules/nodee/pcallback';
import presponse        from './modules/nodee/presponse';
import pmongooserr      from './modules/nodee/pmongooserr';
import pobject          from './modules/nodee/pobject';
import pdate            from './modules/nodee/pdate';
import pvalidator       from './modules/nodee/pvalidator';
import prandom          from './modules/nodee/prandom';
import ppopulate        from './modules/nodee/ppopulate';

export default {
    config: {
        global: globalConfig,
        db: dbConfig,
        renderMethod: {
            hbs: hbsConfig,
            json: jsonConfig,
        },
    },
    module: {
        mongoose: mongoose,

        plog: log(globalConfig.LOG_ENABLE),
        pcallback: pcallback,
        presponse: presponse,
        pmongooserr: pmongooserr,
        pobject,
        pdate: pdate,
        pvalidator: pvalidator,
        prandom: prandom,
        ppopulate: ppopulate
    },
    param: {
        error: errorCodes,
        detail: detailCodes,
        const: consts
    },
    middleware: middlewareGroups,
    db: {},
    model: {}, // models are auto included
};
