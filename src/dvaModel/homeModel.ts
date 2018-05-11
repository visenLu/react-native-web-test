import {postAppJSON, getAppJSON} from '../netWork';
import Config from 'react-native-config';
import {createAction, IS_NOTNIL} from '../utils/index';

import URL from './../config/url';
import {GET, GET_P, POST_FORM, POST_JSON} from './../config/Http';
import {DeviceEventEmitter} from 'react-native';

export const fetchPriceByProductList = async (params) => {
    try {
        const respComission = await postAppJSON(Config.ASYNC_ACCESS_PRICE1,
            params, Config.API_SEARCH_URL);

        return respComission;
    } catch (error) {
        Log('输出error' + error);
    }
};

export const fetchUnread = async () => {
    try {
        // // 请求首页尾部数据,存储在常量footer中
        const json = await getAppJSON(Config.UNRED_MESSAGE);
        return json.data;
    } catch (error) {
        Log('输出error' + error);
    }
};
export const fetchDefaultSearch = async () => {
    try {
        // const json   = await getAppJSON(`${Config.DEFAULTSEARCH_WORDS}?platform=3`);
        const json = await GET(URL.hot_word, {platform: 3});
        return json.data;
    } catch (error) {
        Log('输出error' + error);
    }
};

export const addPosition = async () => {
    try {
        const json = await getAppJSON('v3/mstore/sg/addPositionToCookie.json?provinceId=16&cityId=173&areaId=2450&regionName=崂山区/中韩街道diao&streetId=12036596&noLoading=true');
        return json;
    } catch (error) {
        Log('输出error' + error);
    }
};
export const fetchPosition = async () => {
    try {
        const json = await getAppJSON('v3/mstore/sg/getPositionFromCookie.json');
        return json;
    } catch (error) {
        Log('输出error' + error);
    }
};
export interface ITop {
    askEvery: any;
    crowdFunding: any;
    good: any;
    midActivtyList: any[];
    midBannerList: any[];
    midCommList: any[];
    mustBuy: any;
    topBannerList: any[];
    wiki: any;
}
const initTopData: ITop = {
    askEvery: {},
    crowdFunding: [],
    good: {},
    midActivtyList: [],
    midBannerList: [],
    midCommList: [],
    mustBuy: {},
    topBannerList: [],
    wiki: {},
};
const initState = {
    topData: initTopData,
    bottomData: {},
    floorsData: {floors: [], fCommunity: undefined},
    middleImageConfig: {},
    msgCenter: {},
    flashSales: {},
    advertisement: {},
    iconConfig: {},
    bottomIconConfig: {
        iconImageConfig: {},
        iconFontConfig: {},
    },
    navBarStyle: {
        BarStyleLight: true,
        NavBgColor: 'rgba(255, 255, 255,0)',
    },
    defaultSearchHotWord: '',
};
export default {
    namespace: 'home',
    state: initState,
    reducers: {
        changeFloorData(state, {payload}): any {
            return {...state, ...payload};
        },
        changeHomeTop(state, {payload}): any {
            return {...state, ...payload};
        },
        changeMiddleImageConfig(state, {payload}): any {
            return {...state, ...payload};
        },
        changeHomeBottom(state, {payload}): any {
            return {...state, ...payload};
        },
        changeMsgCenter(state, {payload}): any {
            return {...state, ...payload};
        },
        changeFlashSales(state, {payload}): any {
            return {...state, ...payload};
        },
        changeAdvertisement(state, {payload}): any {
            return {...state, ...payload};
        },
        changeIconConfig(state, {payload}): any {
            return {...state, ...payload};
        },
        changeBottomIconConfig(state, {payload}): any {
            return {...state, ...payload};
        },
        changeNavBarStyle(state, {payload}): any {
            return {...state, navBarStyle: {...payload}};
        },
        clearAdvertisement(state, {payload}): any {
            // Log('clearAdvertisement -> state: ', { ...state, ...payload });
            return {...state, ...payload};
        },
        changeDefaultSearchHotWord(state, {payload}): any {
            return {...state, ...payload};
        },
    },
    effects: {
        // 首页头部接口请求
        *fetchTopData({payload}, {call, put}) {
            try {
                const {data} = yield call(getAppJSON, Config.HOMEPAGE_TOP);
                yield put(createAction('changeHomeTop')({
                    topData: data,
                }));
            } catch (error) {
                Log(error);
            }
        },
        // 首页底部图标配置
        *fetchBottomIconConfig({payload}, {call, put}) {
            try {
                const {data = []} = yield call(getAppJSON, `${Config.ACTIVITY_ICON_TABS_NEW}?iconType=2`);
                if (IS_NOTNIL(data)) {
                    yield put(createAction('changeBottomIconConfig')({bottomIconConfig: data}));
                }
            } catch (error) {
                Log(error);
            }
        },
        // 首页中部图标配置
        *fetchIconConfig({payload}, {call, put}) {
            try {
                const {data = []} = yield call(getAppJSON, `${Config.ACTIVITY_ICON_TABS_NEW}?iconType=1`);
                yield put(createAction('changeIconConfig')({iconConfig: data}));
            } catch (error) {
                Log(error);
            }
        },
        // 首页中通图配置
        *fetchMiddleImageConfig({payload}, {call, put}) {
            try {
                const {data} = yield call(getAppJSON, Config.ACTIVITY_BG);
                yield put(createAction('changeMiddleImageConfig')({
                    middleImageConfig: data,
                }));
            } catch (error) {
                Log(error);
            }
        },
        // 尾部视图接口请求
        *fetchBottomData({payload}, {call, put}) {
            try {
                const {address} = dvaStore.getState();
                const paramsfirst = `&streetId=${address.streetId}&storeId=20219251&noLoading=true`;
                const params = `${address.provinceId}&cityId=${address.cityId}&districtId=${address.areaId}${paramsfirst}`;
                const str = `${Config.FAXIAN_INIT}?d=1&provinceId=${params}`;

                console.log("str", str);
                console.log("Config.API_SEARCH_URL", Config.API_SEARCH_URL);
                const data = yield call(
                    getAppJSON,
                    str,
                    {},
                    {},
                    true,
                    Config.API_SEARCH_URL,
                );
                console.log("fetchBottomData", data);
                const products = [];
                if (data.isCanSyncGetPrice) {
                     const footerDataSource = yield call(fetchPriceByProductList, data.traceId);
                    if (footerDataSource.firstVo) {
                        products.push(footerDataSource.firstVo);
                    }
                    if (footerDataSource.secondList) {
                        for (const item of footerDataSource.secondList) {
                            products.push(item);
                        }
                    }
                    if (footerDataSource.normalList) {
                        for (const item of footerDataSource.normalList) {
                            products.push(item);
                        }
                    }
                } else {
                    if (data.firstVo) {
                        products.push(data.firstVo);
                    }
                    if (data.secondList) {
                        for (const item of data.secondList) {
                            products.push(item);
                        }
                    }
                    if (data.normalList) {
                        for (const item of data.normalList) {
                            products.push(item);
                        }
                    }
                }
                console.log("changeHomeBottom", products);
                yield put(createAction('changeHomeBottom')({bottomData: products}));
            } catch (error) {
                // Log('====================================');
                // Log();
                // Log('====================================');
                // Log(error);
            }
        },
        // 限时抢购接口请求
        *fetchFlashSales({payload}, {call, put}) {
            try {
                const {address} = dvaStore.getState();
                const url = `${Config.HOMEPAGE_FALSHSALES}?provinceId=${address.provinceId}&cityId=${address.cityId}&districtId=${address.areaId}&streetId=${address.streetId}`;
                const {data} = yield call(
                    getAppJSON,
                    url,
                );
                yield put(createAction('changeFlashSales')({
                    flashSales: data,
                }));
                DeviceEventEmitter.emit('flashSaleFresh', {flashSales: data});
            } catch (error) {
                Log(error);
            }
        },
        // 顺逛公告接口请求
        *fetchMsgCenter({payload}, {call, put}) {
            try {
                const {data} = yield call(getAppJSON, Config.MESSAGECENTER_INIT);
                yield put(createAction('changeMsgCenter')({
                    msgCenter: data,
                }));
            } catch (error) {
                Log(error);
            }
        },
        *fetchFloors({payload}, {call, put}) {
            try {
                const res = yield call(
                    getAppJSON,
                    Config.HOME_FLOOR,
                    {},
                    undefined,
                    true
                );
                const {data} = res;
                if (IS_NOTNIL(data)) {
                    yield put(createAction('changeFloorData')({floorsData: data}));
                }
            } catch (error) {
                Log(error);
            }
        },
        // 首页广告弹窗请求
        *fetchAdvertisement({payload}, {call, put}) {
            try {
                const res = yield call(
                    getAppJSON,
                    Config.GET_NEW_PERSON,
                );
                const {data} = res;
                // Log('home model -> advertisement array: ', data);
                if (data && Object.keys(data).length > 0 &&
                    ((data.bannerInfotJson && data.bannerInfotJson.length > 0) ||
                    (data.bannerNewGriftJson && data.bannerNewGriftJson.length > 0))) {
                    yield put(createAction('changeAdvertisement')({
                        advertisement: data,
                    }));
                }
            } catch (error) {
                Log(error);
            }
        },
    },
};
