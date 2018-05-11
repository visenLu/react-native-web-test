import { getAppJSON, getJSONP} from '../netWork';
import { Toast } from 'antd-mobile';
import { NativeModules, Alert } from 'react-native';
import { createAction } from '../utils/index';
import Config from 'react-native-config';

export default {
  namespace: 'payModel',
  state: {
    totalFee: 0,
    payList: [],
    bankList: [],
    bankFenqiData: {},
    orderSn: '',
    orderInfo: '',
  },
  reducers: {
    saveHuabeiData(state, action) {
      return {
        ...state,
        payList: action.payload.payList,
        totalFee: action.payload.totalFee,
        orderSn: action.payload.orderSn,
      };
    },
    saveBankData(state, action) {
      return{
        ...state,
        bankList: action.payload,
      };
    },
    saveBankFenqi(state, action) {
      return{
        ...state,
        bankFenqiData: action.payload,
      };
    },
    saveHuabeiOrderInfo(state, action) {
      return {
        ...state,
        orderInfo: action.payload,
      };
    },
  },
  effects: {
    *fetchHuabeiList({payload}, {call, put}) {
      const { data, message, success } = yield call(getJSONP,
         'paycenter/pay/hbfenqi/hbCost.html?callback=CALL',
          payload, {}, false, Config.PAY_SERVER);
      if (success) {
        yield put({
          type: 'saveHuabeiData',
          payload: data || {},
        });
      } else {
        Toast.info(message, 2);
      }
    },
    *fetchBankPayInfo({payload}, {call, put, take}) {
      const { payType } = payload;
      let fenqiUrl = '';
      const { data, message, success, errorCode } = yield call(getJSONP,
         'paycenter/pay/request.html?callback=CALL&callbackUrl=v3/h5/pay/callback.html&cfgMark=',
          payload, {}, false, Config.PAY_SERVER);
      if (success && errorCode !== 13) {
        if (payType === 'ceb_fenqi') {
          fenqiUrl = data.cebfenqi.actionUrl + '?Plain=' + data.cebfenqi.plain + '&Signature=' + data.cebfenqi.sign;
        } else {
          let installNum = '';
          if (data.ccbfenqi.INSTALLNUM) {
            installNum = '&INSTALLNUM=' + data.ccbfenqi.INSTALLNUM;
          }
          fenqiUrl = data.ccbfenqi.actionUrl + '&REMARK1=' + data.ccbfenqi.REMARK1 + '&CLIENTIP=' + data.ccbfenqi.CLIENTIP + '&BRANCHID=' + data.ccbfenqi.BRANCHID
                             + '&REMARK2=' +  data.ccbfenqi.REMARK2 + '&TXCODE=' +  data.ccbfenqi.TXCODE + '&REGINFO='  +  data.ccbfenqi.REGINFO + '&CURCODE=' +  data.ccbfenqi.CURCODE
                             + '&GATEWAY=' +  data.ccbfenqi.GATEWAY + '&PROINFO=' +  data.ccbfenqi.PROINFO + '&MERCHANTID=' +  data.ccbfenqi.MERCHANTID + installNum
                             + '&ORDERID=' +  data.ccbfenqi.ORDERID + '&POSID=' +  data.ccbfenqi.POSID + '&PAYMENT=' +  data.ccbfenqi.PAYMENT + '&MAC=' +  data.ccbfenqi.MAC
                             + '&TYPE=' +  data.ccbfenqi.TYPE + '&TIMEOUT=' +  data.ccbfenqi.TIMEOUT;
        }
        yield put(createAction('router/apply')({type: 'Navigation/NAVIGATE', routeName: 'CustomWebView', params: {customurl: fenqiUrl, headerTitle: '银行卡分期'}}));
        // yield take('router/apply/@@end');
      } else {
        Alert.alert(
          '提示',
          '由于优惠活动已结束，支付金额将按照应付金额进行支付',
          [
            // {text: 'Ask me later', onPress: () => Log('Ask me later pressed')},
            {text: '取消', onPress: () => Log('Cancel Pressed'), style: 'cancel'},
            {text: '确定', onPress: () => dvaStore.dispatch({
              type: 'payModel/fetchBankPayInfo',
              payload: {...payload, joinActivity: 1},
            })},
          ],
          { cancelable: false },
        );
      }
    },
    *fetchBankFenqiList({payload}, {call, put}) {
      // orderSn=&channel=sg&payType=ccb_fenqi&version=1&memberId=29659999
      const { data, message, success } = yield call(getJSONP,
         'paycenter/pay/fenqi/cost.html?callback=CALL',
          payload, {}, false, Config.PAY_SERVER);
      if (success) {
        yield put({
          type: 'saveBankFenqi',
          payload: data || {},
        });
      } else {
        Toast.info(message, 2);
      }
    },
    *checkKJT({payload}, {call, put}) {
      const { data, message, success } = yield call(getAppJSON,
         'kjt/sg/withdrawSetting.html',
          payload, {}, false, Config.PAY_SERVER);
      if (success) {
        yield put({
          type: 'saveHuabeiData',
          payload: data || {},
        });
      } else {
        Toast.info(message, 2);
      }
    },
    *fetchBankList({payload}, {call, put}) {
      const { data, message, success } = yield call(getJSONP,
        '/paycenter/pay/payTypeList?callback=CALL&channel=sg&category=1',
        //  'paycenter/pay/hbfenqi/hbCost.html?callback=CALL',
          payload, {}, false, Config.PAY_SERVER);
      if (success) {
        yield put({
          type: 'saveBankData',
          payload: data || {},
        });
      } else {
        Toast.info(message, 2);
      }
    },
    *fetchHuabeiTradeInfo({payload}, {call, put}) {

      const { data: {orderInfo}, message, success } = yield call(getAppJSON,
         'v2/h5/pay/app/Hb/request.json?',
          payload, {}, false);
      if (success) {
        yield put({
          type: 'saveHuabeiOrderInfo',
          payload: orderInfo,
        });
        NativeModules.AlipayModule.pay([{payInfo: orderInfo}])
            .then(result => {
                alert(result);
                alert('花呗支付成功');
                Log('花呗支付成功', result);
                })
                .catch((errorCode, domain, error) => {
                // alert(errorCode);
                // alert(domain);
                // alert(error);
                // alert('支付宝支付失败');
                // Log('支付宝支付失败', error);
                });
      } else {
        Toast.info(message, 2);
      }
    },
  },
};
