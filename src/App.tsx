/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import * as React from 'react';
import {
  Dimensions,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import RootContainer from './container/RootNavi';
import dva from './dvaModel';
import { isiPhoneX, getToken, isWdHost, cutImgUrl } from './utils';
import storage from './utils/storage';
import { getLocationPermisson } from './utils/tools';
// app entry
const { height, width } = Dimensions.get('window');
EStyleSheet.build({
  $rem: width / 375.00,
  $xBottom: isiPhoneX ? 33 : 0,
  $darkblue: '#2979FF',
  $darkred: '#FF6026',
  $darkblack: '#333333',
  $black: '#666666',
  $gray: '#999999',
  $lightblack: '#E4E4E4',
  $lightgray: '#EEEEEE',
  $fontSize1: '10rem',
  $fontSize2: '12rem',
  $fontSize3: '14rem',
  $fontSize4: '16rem',
  $fontSize5: '17rem',
});
const Log = (...params: any[]) => { // 全局Log
  if (__DEV__) {
    // console.log(params);
  }
};

// 验证后台返回数据是否为 undefined 或 null  或  ''
const IS_NOTNIL = (value) => {
  if (value !== undefined && value !== null && value !== '') {
    // 非空
    return true;
  } else {
    // 空
    return false;
  }
};

const AsyncGetToken = async () => {
  await getToken(); // 获取登录相关的token
};
const AsyncIsHost = async () => {
  await isWdHost(); // 获取用户登录状态
};
AsyncGetToken();
AsyncIsHost();
getLocationPermisson();
// 全局变量
global.Log = Log;
global.IS_NOTNIL = IS_NOTNIL;
global.rem = width / 375.00;
global.mobileNumberRegExp = /^1([3578][0-9]|4[01356789]|66|9[89])\d{8}$/; // 全局手机号码校验正则
global.passwordRegExp = /^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~])|(?=.*?[A-Za-z])(?=.*?[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~]))[\dA-Za-z\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~]{6,20}$/; // 全局密码校验正则
global.storage = storage;
global.cutImgUrl = cutImgUrl;

export default dva.start(<RootContainer />);
