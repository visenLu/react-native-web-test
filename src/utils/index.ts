// 该文件主要写一个公共的工具方法
import {
    Dimensions,
    Platform,
    StatusBar,
    CameraRoll,
} from 'react-native';
import { Toast } from 'antd-mobile';
// ************************************************ dva相关 *************************************************
import Config from 'react-native-config';
import {getAppJSON, postAppJSON } from '../netWork';
import axios from 'axios';

export { connect } from 'react-redux';

export const createAction = type => (payload?) => ({ type, payload });
export const createIdAction = type => (payload?) => {
    if (!payload || !payload.modelId) {
        return { type, payload };
    } else {
        const modelId = payload.modelId;
        delete payload.modelId;
        return { type, payload, modelId };
    }
};
// export function createAction(type, payload = {}) {
//     return {
//         type,
//         payload
//     }
// }

// ************************************************ 屏幕适配相关 *************************************************
export const width = Dimensions.get('window').width;      // 设备的宽度
export const height = Dimensions.get('window').height;    // 设备的高度
export const sceenHeight = Platform.OS === 'android' ? height - StatusBar.currentHeight : height;
// 判断是否是iPhone X
export const isiPhoneX = (width === 375 && height === 812 && Platform.OS === 'ios') ? true : false;
// navigationBar height
export const naviBarHeight = Platform.OS === 'android' ? 56 + StatusBar.currentHeight : (isiPhoneX ? 84 : 64);

// 当导航栏内容不包含状态栏时使用iPhoneXMarginTopStyle适配iPhone X
export const iPhoneXMarginTopStyle = {
    marginTop: isiPhoneX ? 44 : (Platform.OS === 'ios' ? 20 : 0), // 处理ios状态栏,普通ios设备是20,iPhone X是44
};

// 当导航栏内容包含状态栏时使用iPhoneXPaddingTopStyle适配iPhone X
export const iPhoneXPaddingTopStyle = {
    paddingTop: isiPhoneX ? 44 : (Platform.OS === 'ios' ? 20 : 0), // 处理ios状态栏,普通ios设备是20,iPhone X是44
};

// ************************************************ 屏幕适配相关 *************************************************

// 手机号正则
export const mobileNumberRegExp = /^1([3578][0-9]|4[01356789]|66|9[89])\d{8}$/;
// tslint:disable-next-line:max-line-length  密码正则
export const passwordRegExp = /^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~])|(?=.*?[A-Za-z])(?=.*?[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~]))[\dA-Za-z\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~]{6,20}$/;

// ************************************************ 工具方法相关 *************************************************

// 判断传入的 value 是否为  undefined 或 null  或  '', value有值,返回true,没有值,返回false
export const IS_NOTNIL = (value) => {
    if (value !== undefined && value !== null && value !== '') {
        // 非空
        return true;
    } else {
        // 空
        return false;
    }
};

export const delay = time => new Promise(resolve => setTimeout(resolve, time));

// 随机生成UUID
export const generateRandomUUID = () => {
    const d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        const result = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });
      return uuid;
};

// 获取Token
export const getToken = async () => {
    const res = await getAppJSON('v3/platform/web/token/getToken.json');
    // 本地和dva各存一份 token
    if (res.data) {
        await global.setItem('userToken', 'Bearer' + res.data);
        dvaStore.dispatch(createAction('users/saveUsersMsg')({userToken: 'Bearer' + res.data}));
        axios.defaults.headers['TokenAuthorization'] = 'Bearer' + res.data;
    } else {
        await global.setItem('userToken', 'Bearer' + generateRandomUUID());
        dvaStore.dispatch(createAction('users/saveUsersMsg')({userToken: 'Bearer' + generateRandomUUID()}));
        axios.defaults.headers['TokenAuthorization'] = 'Bearer' + generateRandomUUID();
    }
};

// 判断用户身份 是否是微店主 -1:未登录 0:普通用户 1:微店主
export const isWdHost = async () => {
    const result = await getAppJSON(Config.HOMEPAGE_ISWDHOST);
    const res =  result.data.isHost;
    await global.setItem('users', {isHost: res});
    dvaStore.dispatch(createAction('users/saveUsersMsg')({isHost: res}));
    return res;
};
// 判断用户是否登录 true：已登录  false：未登录-跳转到登录页
export const isLogin = (callFunc?) => {
    const loginStatus = dvaStore.getState().users.isLogin;
    if (!loginStatus) {
        callFunc ? callFunc() :
        dvaStore.dispatch(createAction('router/apply')({
            type: 'Navigation/NAVIGATE', routeName: 'Login',
        }));
        return false;
    } else {
        return true;
    }
};
export const universalHeader = {
  headerTintColor: '#878787',
  headerTitleStyle: { color: '#333333', alignSelf: 'center'},
  headerStyle: {backgroundColor: '#f6f6f6', justifyContent: 'center'},
};

// 获取前一个路由名称
export const getPrevRouteName = () => {
    const routerState = dvaStore.getState().router;
    const routesArrlength = dvaStore.getState().router.routes.length;
    if (routerState.index === 0) {
        return null;
    } else {
        return routerState.routes[routesArrlength - 2].routeName;
    }
};

// 传入 时间戳 转换成 'yyyy-MM-dd HH:mm:ss' 这种格式
export const timestampToTime = (timestamp) => {
    const date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const D = date.getDate() + ' ';
    const h = date.getHours() + ':';
    const m = date.getMinutes() + ':';
    const s = date.getSeconds();
    return Y + M + D + h + m + s;
};

// 存储图片
// Android 上：tag 是本地地址，例如："file:///sdcard/img.png"
export const saveImg = (tag, type?) => {
    const promise = CameraRoll.saveToCameraRoll(tag, type);
    promise
        .then((result) => {
            Toast.success('保存成功!', 2);
         })
        .catch((error) => {
            Toast.fail('保存失败!', 2);
        });
};

// 防止快速多次点击
let isClicked = false;
export const doubleClick = ( interval= 800) => {
    if (!isClicked) {
        isClicked = true;
        setTimeout(() => {
            isClicked = false;
        }, interval);
        return false;
    } else {
        return true;
    }
};

export const cutImgUrl = (url: string, cutWidth?: number, cutHeight?: number) => {
    if (Config.API_URL === 'http://mobiletest.ehaier.com:38080/') {
        return url;
    }
    const pattern = /cdn[23][0-9].ehaier.com/;
    if (!pattern.test(url)) {
        return url;
    }
    const cutH = cutHeight || cutWidth || sceenHeight;
    const cutW = cutWidth || width;
    const supportW = [80, 100, 120, 150, 160, 180, 200, 225, 240, 250, 300, 360, 400, 450, 500, 750];
    const supportH = [80, 100, 140, 150, 160, 180, 200, 245, 280, 300, 320, 360, 400, 490, 600];
    const supCutW = supportW.find((w) => w >= cutW );
    const supCutH = supportH.find((h) => h >= cutH );
    if (supCutW && supCutH) {
        return `${url}@${supCutW}_${supCutH}`;
    } else {
        return url;
    }
};
