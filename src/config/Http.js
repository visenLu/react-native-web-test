import { Toast } from 'antd-mobile';
import config from './index';
import { createAction, connect, generateRandomUUID } from '../utils';
import Config from "react-native-config/index";

const showLoading = (doLoading) => {
    doLoading ? Toast.loading('加载中...') : Toast.hide();
};

let loading = false;

function fetchWithOutOfTime(url, reqSetting, overtime = 10000) {
    let fetchPromise = new Promise((resolve, reject) => {
        resolve(fetch(url, reqSetting));
    });
    let timeoutPromise = new Promise(function(resolve, reject){
        setTimeout(()=>{
            resolve({code: 408, msg: "请求超时!"});
        }, overtime)
    });
    return Promise.race([fetchPromise, timeoutPromise]);
}
function fetchPWithOutOfTime(url, reqSetting, overtime = 10000) {
    let fetchPromise = new Promise((resolve, reject) => {
        resolve(fetch(url, reqSetting));
    });
    let timeoutPromise = new Promise(function(resolve, reject){
        setTimeout(()=>{
            resolve({code: 408, msg: "请求超时!"});
        }, overtime)
    });
    return Promise.race([fetchPromise, timeoutPromise]);
}

/********** 基础请求 ************/
// fetch 请求
export async function fetchService(url, settings, overtime, hiddenLoading) {
    loading = true;
    setTimeout(() => {
        if (loading) {
            !hiddenLoading && showLoading(false);
            !hiddenLoading && showLoading(true);
        }
    }, 300);
    const userToken = await global.getItem('userToken');
    const reqSetting = {
        ...settings,
        headers: {
            Accept: 'application/json',
            ...settings.headers,
            TokenAuthorization: userToken,
        },
    };
    const resp = await fetchWithOutOfTime(url, reqSetting, overtime);
    loading = false;
    !hiddenLoading && showLoading(false);
    if(resp.code && resp.code == 408){
        const error = new Error(`${url} 请求超时!`);
        error.code = 408;
        error.text = "请求超时!";
        Toast.fail("请求超时!", 1);
        throw error;
    }else{
        if (!resp.ok) {
            const error = new Error(`${url} is not OK!`);
            error.code = resp.status;
            error.text = resp.statusText;
            // Toast.fail('数据请求失败',2);
            throw error;
        }
        // console.log(`${url} response status:${resp.status}`)
        return resp;
    }
}
// fetch 跨域请求
export async function fetchJsonP(url, settings, overtime, hiddenLoading) {
    loading = true;
    setTimeout(() => {
        if (loading) {
            !hiddenLoading && showLoading(false);
            !hiddenLoading && showLoading(true);
        }
    }, 300);
    const userToken = await global.getItem('userToken');
    const reqSetting = {
        ...settings,
        headers: {
            Accept: 'application/json',
            ...settings.headers,
            TokenAuthorization: userToken
        },
    };
    const resp = await fetchPWithOutOfTime(url, reqSetting, overtime);
    loading = false;
    !hiddenLoading && showLoading(false);
    if(resp.code && resp.code == 408){
        const error = new Error(`${url} 请求超时!`);
        error.code = 408;
        error.text = "请求超时!";
        Toast.fail("请求超时!", 1);
        throw error;
    }else {
        if (!resp.ok) {
            const error = new Error(`${url} is not OK!`);
            error.code = resp.status;
            error.text = resp.statusText;
            // Toast.fail('数据请求失败',2);
            throw error;
        }
        return JSON.parse(resp._bodyText.substring(5, resp._bodyText.length - 1));
    }
}
/********** 基础请求 ************/

/********** 直接使用的请求 ************/
// 普通 GET 请求
export async function GET(url, query, settings, hiddenLoading, hiddenErrorMsg) {
    let tmp = url;
    if(query){
        tmp = (url.indexOf('?') === -1) ? url + '?' : url + '&';
        for (const [key, value] of Object.entries(query)) {
            tmp = tmp + key + '=' + value + '&';
        }
        tmp = tmp.substring(0, tmp.length - 1);
    }
    const resp = await fetchService(tmp, {
        ...settings,
        method: 'GET',
    }, hiddenLoading);
    const result = await resp.json();
    console.log(`\n\n==========HTTP-GET-START==========\nURL:${tmp}`);
    console.log(result);
    console.log('\n\n');
    if (result.success === false && !hiddenErrorMsg) {
        result.message ? Toast.fail(result.message, 2) : Toast.fail('服务器错误');
    }
    return result;
}
// GET 跨域请求
export async function GET_P(url, query, setting, hiddenLoading, hiddenErrorMsg) {
    let tmp = url;
    if(query){
        tmp = (url.indexOf('?') === -1) ? url + '?' : url + '&';
        for (const [key, value] of Object.entries(query)) {
            tmp = tmp + key + '=' + value + '&';
        }
        tmp = tmp.substring(0, tmp.length - 1);
    }
    const resp = await fetchJsonP(tmp, {
        ...settings,
        method: 'GET',
    }, hiddenLoading);
    console.log(`\n\n==========HTTP-GET_P==========\nURL:${tmp}\nBACK:${JSON.stringify(resp)}`);
    console.log('\n\n');
    if (resp.success === false && !hiddenErrorMsg) {
        resp.message ? Toast.fail(resp.message, 2) : Toast.fail('服务器错误');
    }
    return resp;
}
// POST 通过 multipart/form-data 提交
export async function POST_FORM(url, body, query, settings = {headers: { 'Content-Type': 'multipart/form-data' }})
{
    let tmp = url;
    if(query){
        tmp = (url.indexOf('?') === -1) ? url + '?' : url + '&';
        for (const [key, value] of Object.entries(query)) {
            tmp = tmp + key + '=' + value + '&';
        }
        tmp = tmp.substring(0, tmp.length - 1);
    }
    const formData = new FormData();
    for (const key in body) {
        if (body.hasOwnProperty(key)) {
            formData.append(key, body[key]);
        }
    }
    const resp = await fetchService(tmp, {
        ...settings,
        method: 'POST',
        body: formData,
    });
    const result = await resp.json();
    console.log(`==========HTTP-POST_BODY-START==========\nURL:${tmp}\nBODY:${JSON.stringify(body)}`);
    console.log(result);
    console.log('\n\n');
    if (!result.success) {
        result.message ? Toast.fail(result.message, 2) : Toast.fail('服务器错误');
    }
    return result;
}
// POST 通过 application/json 提交
export async function POST_JSON(url, body, query, settings = {headers: { 'Content-Type': 'application/json' }})
{
    let tmp = url;
    if(query){
        tmp = (url.indexOf('?') === -1) ? url + '?' : url + '&';
        for (const [key, value] of Object.entries(query)) {
            tmp = tmp + key + '=' + value + '&';
        }
        tmp = tmp.substring(0, tmp.length - 1);
    }
    const resp = await fetchService(url, {
        ...settings,
        method: 'POST',
        body: JSON.stringify(body),
    });
    const result = await resp.json();
    console.log(`==========HTTP-POST_JSON-START==========\nURL:${tmp}\nBODY:${JSON.stringify(body)}`);
    console.log(result);
    console.log('\n\n');
    if (!result.success) {
        result.message ? Toast.fail(result.message, 2) : Toast.fail('服务器错误');
    }
    return result;
}

/********** 直接使用的请求 ************/