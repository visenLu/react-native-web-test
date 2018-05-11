import {postAppJSON, getAppJSON, getJSONP} from '../netWork';
import Config from 'react-native-config';
import { createAction, IS_NOTNIL } from '../utils/index';
import { NavigationActions } from 'react-navigation';

export default {
    namespace: 'mine',
    state: {
        userMemberId: '',
        flagNum: false,
        myManageData: {},
        orderCountData: null,
        wdHostData: {},
        applyName: '',
        applyStatus: 2,
        gameId: 'f265383f0538834f',
        realNameAuthOpacity: 1, // 实名认证状态
    },
    reducers: {
        changeMsgCenter(state, { payload }): any {
            return { ...state, ...payload };
        },
        changeManageData(state, { payload }): any {
            return { ...state, ...payload };
        },
        changeWdHostData(state, { payload }): any {
            return { ...state, ...payload };
        },
        changeApplyStatus(state, { payload }): any {
            return { ...state, ...payload };
        },
        changeRealNameAuthStatus(state, { payload }): any {
            return { ...state, ...payload };
        },
        changeFindLatestGame(state, { payload }): any {
            return { ...state, ...payload };
        },
        changeOrderCount(state, { payload }): any {
            return { ...state, ...payload };
        },
    },
    effects: {
        // 请求消息
        *fetchMsgCenter({ payload }, { call, put }) {
            try {
            const { success, data } = yield call(
                getAppJSON,
                Config.MESSAGECENTER_INIT,
            );
            if (success) {
                // Log('zhaoxincheng>>>>>>>>fetchMsgCenter', data);
                let flagNum;
                if (data.count > 0) {
                    flagNum = true;
                } else {
                    flagNum = false;
                    // 离线消息
                    const { success: successe, data: dataInfo } = yield call(
                        getAppJSON,
                        Config.CIRCLE_GET_TUI_MESSAGE,
                    );

                    if (successe && IS_NOTNIL(dataInfo)) {
                        flagNum = true;
                    } else {
                        flagNum = false;
                    }
                }
                yield put(createAction('changeMsgCenter')({
                    flagNum,
                    userMemberId: data.memberId,
                    }));
            }
            } catch (error) {
            Log(error);
            }
        },
        // 请求mine界面数据
        *fetchManageData({ payload }, { call, put }) {
            try {
            const { data } = yield call(
                getAppJSON,
                Config.PERSONAL_CENTER,
            );
            // Log('zhaoxincheng>>>>>>>>fetchManageData', data);
            yield put(createAction('changeManageData')({
                myManageData: data !== null ? data : {},
                }));
            } catch (error) {
            Log(error);
            }
        },
        // 是否是微店主接口
        *fetchWdHostData({ payload }, { call, put }) {
            try {
            const { data } = yield call(
                getAppJSON,
                Config.HOMEPAGE_ISWDHOST,
            );
            // Log('zhaoxincheng>>>>>>>>fetchWdHostData', data);
            yield put(createAction('changeWdHostData')({
                wdHostData: data,
                }));
            } catch (error) {
            Log(error);
            }
        },
        // 舵主的申请状态
        *fetchApplyStatus({ payload }, { call, put }) {
            try {
            const { success , data } = yield call(
                getAppJSON,
                Config.GET_APPLY_MENGZHU,
            );
            // Log('zhaoxincheng>>>>>>>>fetchWdHostData', data);
            if (success) {
                if (data.isVacancy) {
                    data.status = data.levelDownMonth === data.applyMonth ? -3 : 2;
                } else if (data.status === undefined) {
                    data.status = -2;
                  }
            }
            yield put(createAction('changeApplyStatus')({
                applyName: data.name,
                applyStatus: data.status,
                }));
            } catch (error) {
            Log(error);
            }
        },
        // 实名认证状态
        *fetchRealNameAuthStatus({ payload }, { call, put }) {
            try {
            const { success , data } = yield call(
                getAppJSON,
                Config.TRUE_REALNAMEAUTH,
            );
            // Log('zhaoxincheng>>>>>>>>fetchWdHostData', data);
            if (success) {
                let realNameAuthOpacity = 1;
                if (data.isAuthByOne) { // 实名认证过
                    // '实名认证过了'
                    realNameAuthOpacity = 1;
                } else { // 未认证
                    realNameAuthOpacity = 0.5;
                }
                yield put(createAction('changeRealNameAuthStatus')({
                    realNameAuthOpacity,
                }));
              } else {
                Log('请求实名认证接口出错');
              }
            } catch (error) {
            Log(error);
            }
        },
        // 查询最新的积分抽奖游戏
        *fetchFindLatestGame({ payload }, { call, put }) {
            try {
            const { success , data } = yield call(
                getAppJSON,
                Config.FIND_GAME_ID,
            );
            // Log('zhaoxincheng>>>>>>>>FindLatestGame', data);
            if (success) {
                // 请求成功,更新id
                yield put(createAction('changeFindLatestGame')({
                    gameId: data,
                }));
            }
            } catch (error) {
            Log(error);
            }
        },
        // 请求订单数量数据
        *fetchOrderCountData({ payload }, { call, put }) {
            try {
            const { data } = yield call(
                getAppJSON,
                Config.ORDER_AMOUNT,
            );
            yield put(createAction('changeOrderCount')({
                orderCountData: data,
              }));
            } catch (error) {
                Log(error);
            }
        },
    },
};
