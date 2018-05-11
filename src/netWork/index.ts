import {Toast} from 'antd-mobile';
import Config from 'react-native-config';
import {createAction, connect, generateRandomUUID} from '../utils';

const showLoading = (doLoading): void => {
    doLoading ? Toast.loading('加载中...') : Toast.hide();
};

let loading = false;

export async function fetchService(url, setting, baseusrl = Config.API_URL, hiddenLoading?) {
    // Log(dvaStore);
    loading = true;
    setTimeout(() => {
        if (loading) {
            !hiddenLoading && showLoading(false);
            !hiddenLoading && showLoading(true);
        }
    }, 300);
    const userToken = await global.getItem('userToken');
    // Log(`-----------${userToken}------------`);
    // Log(`-----------${userToken}------------`);
    // const userToken = dvaStore.getState().users.userToken;
    const reqSetting = {
        ...setting,
        headers: {
            Accept: 'application/json',
            ...setting.headers,
            // TokenAuthorization: 'Bearer751b512a-c6bb-4ca8-9ce3-f172f060a418952',
            // TokenAuthorization: 'Bearer2e630712-3ae9-4e25-be38-013ba7092986293',
            // TokenAuthorization: 'Bearer2e630712-3ae9-4e25-be38-013ba7092986293', // 测试服务器
            // TokenAuthorization: userToken ? userToken : 'Bearer' + generateRandomUUID(), // 万一没有从本地拿出来token 随机生成一个token
            // TokenAuthorization: 'Bearerb69b4a84-d149-40fd-b2f3-f44c093c8cfe242',
            TokenAuthorization: userToken,
        },
    };

    // Log(reqSetting);
    const resp = await fetch(
        baseusrl + url,
        reqSetting,
    );
    loading = false;
    console.log('--------旧请求接口----------\nURL:');
    console.log(baseusrl + url);
    !hiddenLoading && showLoading(false);
    if (!resp.ok) {
        const error: any = new Error(`${baseusrl}${url} is not OK!`);
        error.code = resp.status;
        error.text = resp.statusText;
        // Toast.fail('数据请求失败',2);
        throw error;
    } else {
        if (url === 'v3/platform/web/token/getToken.json') {
            // Log(resp);
        }
        Log('respond ok');
    }
    return resp;
}
export async function fetchJsonP(url, setting, baseusrl = Config.API_URL, hiddenLoading?) {
    // Log(dvaStore);
    loading = true;
    const userToken = await global.getItem('userToken');
    setTimeout(() => {
        if (loading) {
            !hiddenLoading && showLoading(false);
            !hiddenLoading && showLoading(true);
        }
    }, 300);
    const reqSetting = {
        ...setting,
        headers: {
            Accept: 'application/json',
            ...setting.headers,
            // TokenAuthorization: 'Bearer751b512a-c6bb-4ca8-9ce3-f172f060a418952',
            // TokenAuthorization: 'Bearer2e630712-3ae9-4e25-be38-013ba7092986293',
            // TokenAuthorization: 'Bearerb69b4a84-d149-40fd-b2f3-f44c093c8cfe242',
            // TokenAuthorization: 'Bearer2e630712-3ae9-4e25-be38-013ba7092986293', // 测试服务器
            TokenAuthorization: userToken,
        },
    };

    Log(reqSetting);
    const resp = await fetch(
        baseusrl + url,
        reqSetting,
    );
    loading = false;
    console.log('--------旧请求接口----------\nURL:');
    console.log(baseusrl + url);
    !hiddenLoading && showLoading(false);
    if (!resp.ok) {
        const error: any = new Error(`${baseusrl}/${url} is not OK!`);
        error.code = resp.status;
        error.text = resp.statusText;
        // Toast.fail('数据请求失败',2);
        throw error;
    } else {
        Log('respond ok');
    }
    // return JSON.parse(resp._bodyText.substring(5, resp._bodyText.length - 1));
    return resp.json();
}

export async function postAppForm(url, data, setting = {
    headers: {'Content-Type': 'multipart/form-data'}
}) {
    const formData = new FormData();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formData.append(key, data[key]);
        }
    }
    const resp = await fetchService(url, {
        ...setting,
        method: 'POST',
        body: formData,
    });
    const result = await resp.json();
    if (!result.success) {
        result.message ? Toast.fail(result.message, 2) : Toast.fail('服务器错误');
    }
    return result;
}
export async function postForm(url, data, setting = {
    headers: {'Content-Type': 'multipart/form-data'},
}) {
    let tmp = (url.indexOf('?') === -1) ? url + '?' : url + '&';
    for (const [key, value] of (Object as any).entries(data)) {
        tmp = tmp + key + '=' + value + '&';
    }
    tmp = tmp.substring(0, tmp.length - 1);
    const resp = await fetchService(tmp, {
        ...setting,
        method: 'POST',
    });
    const result = await resp.json();
    if (!result.success) {
        result.message ? Toast.fail(result.message, 2) : Toast.fail('服务器错误');
    }
    return result;
}

export async function postAppJSON(url: string, data?: object, mbaseUrl?: string, setting: any = {
    headers: {'Content-Type': 'application/json'},
}) {
    const resp = await fetchService(url, {
        ...setting,
        method: 'POST',
        body: JSON.stringify(data),
    }, mbaseUrl);
    const result = await resp.json();
    if (!result.success) {
        result.message ? Toast.fail(result.message, 2) : Toast.fail('服务器错误');
    }
    return result;
}

export async function getAppJSON(url: string,
                                 data: object = {},
                                 setting?: object,
                                 hiddenLoading?: boolean,
                                 customBaseUrl?: string,
                                 hiddenErrorMsg?: boolean,) {
    let tmp = (url.indexOf('?') === -1) ? url + '?' : url + '&';
    for (const [key, value] of (Object as any).entries(data)) {
        tmp = tmp + key + '=' + value + '&';
    }
    tmp = tmp.substring(0, tmp.length - 1);
    console.log('getAppJSON========url===', tmp);
    const resp = await fetchService(tmp, {
        ...setting,
        method: 'GET',
    }, customBaseUrl, hiddenLoading);
    const result = await resp.json();
    console.log('result===========', result);
    // if (result.success === false && !hiddenErrorMsg) {
    //   result.message ? Toast.fail(result.message, 2) : Toast.fail('服务器错误');
    // }
    if (result.success === false) {
        console.log('resultErr===========', tmp);

        result.message ? Toast.fail(result.message, 2) : Toast.fail('服务器错误');
    }
    return result;
}

export async function getJSONP(url: string,
                               data: object = {},
                               setting?: object,
                               hiddenLoading?: boolean,
                               customBaseUrl?: string,) {
    let tmp = (url.indexOf('?') === -1) ? url + '?' : url + '&';
    for (const [key, value] of (Object as any).entries(data)) {
        tmp = tmp + key + '=' + value + '&';
    }
    tmp = tmp.substring(0, tmp.length - 1);
    const resp = await fetchJsonP(tmp, {
        ...setting,
        method: 'GET',
    }, customBaseUrl, hiddenLoading);
    console.log('resp===========', resp);
    if (!resp.success) {
        resp.message ? Toast.fail(resp.message, 2) : Toast.fail('服务器错误');

    }
    return resp;
}

export async function getDetailJSON(url: string, data: object = {}, setting?: object, hiddenLoading?: boolean) {
    return await getAppJSON(url, data, setting, hiddenLoading, Config.API_DETAIL_URL);
}

export async function getDetailNoLoading(url: string, data: object = {}, setting?: object) {
    return await getAppJSON(url, data, setting, true, Config.API_DETAIL_URL);
}

export async function getAppNoLoading(url: string, data: object = {}, setting?: object) {
    return await getAppJSON(url, data, setting, true);
}