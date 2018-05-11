import { postAppJSON, getAppJSON } from '../netWork';
import { Toast } from 'antd-mobile';
import { createAction } from '../utils/index';


export default {
  namespace: 'receiptModel',
  state: {
    listLoading: false,
    ordersCommitWrapM:{
      memberInvoices:{
      }
    },
  },
  reducers: {
    saveReceipt(state, action) {
      return {
        ...state,
        ordersCommitWrapM: action.payload,
      };
    },
  },
  effects: {
    *fetchReceipt({ payload }, { call, put }) {
      let url = 'v3/h5/sg/order/toInvoice.html';
      try {
        const resp = yield call(getAppJSON,url, payload);
        // Log('resp=======',resp);
        
        if(resp.success){
          yield put(createAction('saveReceipt')(resp.data.ordersCommitWrapM||
            {memberInvoices:{}})
          );
          // yield put(createAction('order/fetchPageInfo')({isFromInvoices:1}));
        }else{
            Toast.info(`message:${resp.message};errorCode:&${resp.errorCode}`)
        }
      } catch (error) {
        Log('error=======',error);
      }
    },
    *commitReceipt({ payload:{params, skku, attrValueNames , o2oAttrId} }, { call, put }) {
      let url = 'v3/h5/sg/order/submitInvoice.html?';
      for (const [key, value] of (Object as any).entries(params)) {
        url = url + key + '=' + value + '&';
      };
      try {
        // const resp = yield call(postAppJSON,'v3/h5/sg/order/submitInvoice.html', payload,'http://mobiletest.ehaier.com:38080/');
        const resp = yield call(postAppJSON,url, params);
        // Log('resp=======',resp);

        if(resp.success){
          Toast.info('提交发票成功',2);
          yield put(createAction('router/apply')({type:'Navigation/BACK'}));
          yield put(createAction('order/fetchPageInfo')({isFromInvoices:1,skku, attrValueNames , o2oAttrId}));
        }else{
            Toast.info(`message:${resp.message};errorCode:&${resp.errorCode}`)
        }
      } catch (error) {
        Log('error=======',error);
      }
    },
  },
};
