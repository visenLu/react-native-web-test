import React from 'react';
import { create } from 'dva-core';
import { Provider } from 'react-redux';
import {
    createReactNavigationReduxMiddleware,
  } from 'react-navigation-redux-helpers';
// import { createLogger } from 'redux-logger';
import { Toast } from 'antd-mobile';

// 导入所有model
import mainModel from './mainModel';
import loginModel from './loginModel';
// import navigationModel from './navigationModel';
import goodsDetailModel from './goodsDetailModel';
import addressModel from './addressModel';
import homeModel from './homeModel';
import mineModel from './mineModel';
import orderModel from './orderModel';
import usersModel from './usersModel';
import receiptModel from './receiptModel';
import cartModel from './cartModel';
import payModel from './payModel';
import advertisementModel from './advertisementModel';
import isAuthenticationModel from './isAuthenticationModel';

import investmentModel from './investmentModel';
import storeModel from './storeModel';

// import createCallback from 'dva-callback';


// 1. Initialize
const dva = (options) => {
    const app = create(options);
    // HMR workaround
    // tslint:disable-next-line:curly
    if (!global.registered) options.models.forEach(model => app.model(model));
    global.registered = true;


    // app.use(createCallback({alias: 'callback'}));

    app.start();

    const store = app._store;
    // 外面传进来的组件作为参数放到Provider组件里面
    app.start = container => () => (
        <Provider store={store}>
            {container}
        </Provider>
    );
    app.getStore = () => store;
    // 把store挂到global上
    global.dvaStore = store;
    return app;
};

// 如何组成中间件
// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
// const middleware = createReactNavigationReduxMiddleware(
//     'root',
//     state => state.nav,
// );

const app = dva({
    initialState: {},
    // 加载maodel
    models: [
        // navigationModel,
        mainModel,
        loginModel,
        goodsDetailModel,
        addressModel,
        homeModel,
        mineModel,
        orderModel,
        usersModel,
        receiptModel,
        cartModel,
        payModel,
        advertisementModel,
        investmentModel,
        storeModel,
        isAuthenticationModel,



    ],
    onAction: [
    //     createLogger({
    //     stateTransformer: state => {
    //         const logState = Object.assign({}, state);
    //         if (logState && logState.goodsDetail && logState.goodsDetail.toJS) {
    //             logState.goodsDetail = logState.goodsDetail.toJS();
    //         }
    //         return logState;
    //     },
    // }),
    ],
    // dva 里的全局错误处理
    onError(e) {
        Log('onError', e);
    },
});

// let canHiddenLoading = false;
// let hiddenLoading = false;
// export const showLoading = (doLoading) => {
//     doLoading ? Toast.loading('加载中') : Toast.hide();
//     Log(dvaStore);
//     hiddenLoading = !doLoading;
//     if (!hiddenLoading) {
//         canHiddenLoading = false;
//         dvaStore.dispatch({type: 'mainReducer/loadingChange', payload: { doLoading: !hiddenLoading }});
//         setTimeout(() => {
//             canHiddenLoading = true;
//             // tslint:disable-next-line:max-line-length
//             hiddenLoading && dvaStore.dispatch({type: 'mainReducer/loadingChange', payload: { doLoading: !hiddenLoading }});
//         }, 2200);
//     } else {
//         // tslint:disable-next-line:max-line-length
//         canHiddenLoading && dvaStore.dispatch({type: 'mainReducer/loadingChange', payload: { doLoading: !hiddenLoading }});
//     }
// };

// export const dvaStore = app._store;



export default app;
