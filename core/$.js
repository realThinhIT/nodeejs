// ######################################################
// CORE: MODULES
// ######################################################

// make $ variables

import mongoose         from 'mongoose';

import globalConfig     from '../config/global';
import apiConfig        from '../config/api-config';

import middlewareGroups from '../config/middlewares';
import errorCodes       from '../config/params/error-codes';
import detailCodes      from '../config/params/detail-codes';
import consts           from '../config/params/consts';

import log              from './modules/plog';
import pcallback        from './modules/pcallback';
import presponse        from './modules/presponse';
import pmongooserr      from './modules/pmongooserr';
import pobject          from './modules/pobject';
import pdate            from './modules/pdate';
import pvalidator       from './modules/pvalidator';
import prandom          from './modules/prandom';
import ppopulate        from './modules/ppopulate';

export default {
    config: {
        global: globalConfig,
        api: apiConfig,
        middleware: middlewareGroups
    },
    module: {
        plog: log(),
        pcallback: pcallback,
        presponse: presponse,
        pmongooserr: pmongooserr,
        pobject: pobject,
        mongoose: mongoose,
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
    db: {},
    model: {}, // models are auto included
};
