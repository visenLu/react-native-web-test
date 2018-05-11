import { createAction, isLogin } from '../utils';
import { AsyncStorage, DeviceEventEmitter } from 'react-native';
import { fetchUnread } from './homeModel';
// import SplashScreen from 'react-native-splash-screen';
import { ShowAdType } from '../interface';
import moment from 'moment';
import { Toast } from 'antd-mobile';
import RNFS from 'react-native-fs';


export default {
    namespace: 'mainReducer',
    state: {
        doLoading: false,
        showAdType: ShowAdType.None,
        firstLoading: false,
        unread: 0, // 未读消息
    },
    reducers: {
        stateChange(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    effects: {
        *appBegin({ payload }, { call, put, take }) {
            try {
                // 每次启动应用,读取本地存储的用户信息
                const userMsg = yield call(global.getItem, 'User');

                // 存储到dva中
                yield put(createAction('users/saveUsersMsg')({...userMsg}));
                DeviceEventEmitter.emit('loginSuccess', {doNotFetchAdvertisement: true});
                yield put(createAction('adModel/loadAd')());
                yield take('adModel/loadAd/@@end');

                // 查看本地是否存储的有first字段,第一次安装应用result返回空
                // const result = yield call(AsyncStorage.getItem, 'first');
                yield put(createAction('stateChange')({ firstLoading: !isLogin(() => Log('==不想跳转登录页==')) }));
                yield put(createAction('showAdView')());

                // 检查服务器广告页和视频接口是否更新
                yield put(createAction('adModel/checkSeverAd')());
            } catch (error) {
                Log(error);
                // SplashScreen.hide();
            }
        },
        *showAdView({ payload }, { call, put, select }) {
            try {
                const { adModel: { adData, videoUrl }, mainReducer: { firstLoading } } = yield select(state => state);
                if (videoUrl) {
                    yield put(createAction('stateChange')({ showAdType: ShowAdType.Video }));
                } else if (firstLoading) {
                    yield put(createAction('stateChange')({ showAdType: ShowAdType.Guide }));
                    // SplashScreen.hide();
                } else if (adData && adData.length > 0) {
                    yield put(createAction('stateChange')({ showAdType: ShowAdType.Image }));
                } else { // 首页广告信息弹窗
                    yield put(createAction('home/fetchAdvertisement')());
                }

                // 有视频的时候在视频加载完成时在隐藏SplashScreen
                if (!videoUrl) {
                    // SplashScreen.hide();
                }

            } catch (error) {
                Log(error);
                // SplashScreen.hide();
            }
        },
        *adViewNext({ payload }, { call, put, select }) {
            try {
                // Toast.hide(); // 奇怪的用户未登录toast 不显示却挡住了引导页导致点不了
                const { adModel: { adData, videoUrl }, mainReducer: { firstLoading, showAdType } } = yield select(state => state);
                const preShowType = showAdType;
                if (preShowType === ShowAdType.Video) {
                    // 存储视频今天是否播放的状态
                    const todayStr = moment().format('YYYY-MM-DD');
                    AsyncStorage.setItem('videoUrlSeeDate', todayStr);

                    let nextShowType = ShowAdType.None;
                    if (firstLoading) {
                        nextShowType = ShowAdType.Guide;
                    } else if (adData && adData.length > 0) {
                        nextShowType = ShowAdType.Image;
                    }
                    yield put(createAction('stateChange')({ showAdType: nextShowType }));
                } else if (preShowType === ShowAdType.Guide) {
                    AsyncStorage.setItem('first', 'false');
                    yield put(createAction('stateChange')({ showAdType: ShowAdType.None }));
                } else if (preShowType === ShowAdType.Image) {
                    yield put(createAction('stateChange')({ showAdType: ShowAdType.None }));
                    yield put(createAction('home/fetchAdvertisement')());
                }
            } catch (error) {
                Log(error);
                yield put(createAction('stateChange')({ showAdType: ShowAdType.None }));
            }
        },
    },
};
