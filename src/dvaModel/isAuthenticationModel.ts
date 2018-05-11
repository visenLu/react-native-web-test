//isAuthenticationModel
import { getAppJSON} from '../netWork';
import { Toast } from 'antd-mobile';
import { createAction } from '../utils';
import Config from 'react-native-config';

interface IsAuthentication {
    isAuthentication: boolean;
    isHaierStaffAuthentication: boolean;
    data:object;
    haierStaffData: object;
}

export default {
  namespace: 'authenticationModel',
  state: {
    isAuthentication: false,
    isHaierStaffAuthentication : false,
    data:{},
    haierStaffData: {},
  },
  reducers: {
     identityAuthentication(state, { payload }): IsAuthentication {
          return { ...state, ...payload };
      },
      HaierStaffAuthentication(state, { payload }): IsAuthentication {
          return { ...state, ...payload };
      },
  },
  effects: {
      *authenticationChange({ payload }, { call, put }) {
        // try {
        //   // yield put({ type: 'loadingChange', payload: { isLoading: true } });
        //   yield put(createAction('loadingChange')({ isLoading: true }));
        //   // tslint:disable-next-line:max-line-length
        //   const url = `/v3/platform/web/member/captchaLogin.json?userName=${payload.name}&password=${payload.password}&captcha=&isNew=1&noLoading=true`;
        //   const data =  yield call(getAppJSON, url);
        //   // Log(data);
        //   if (!data.errorCode) {
        //       Toast.success('登录成功', 3);
        //   } else {
        //     Toast.fail(data.message, 3);
        //   }
        //   yield put(createAction('loadingChange')({ isLoading: false }));
        //   yield put(createAction('user/stateChange')({ data }));
        // } catch (error) {
        //   console.error(error);
        //   Toast.fail('登录发生错误', 3);
        // }
        try{
            const url = 'v3/kjt/bank/isRealNameAuth.json';
            const res = yield call(getAppJSON,url);
            Log(res)
            if(res.success){
              if(res.data.identity!=null){ //已认证
                yield put(createAction('identityAuthentication')({isAuthentication:true}))
                yield put(createAction('identityAuthentication')({data:res.data.identity}))
              }else{
                yield put(createAction('identityAuthentication')({isAuthentication:false}))
              }
              if(res.data.empInfo!=null){
                yield put(createAction('HaierStaffAuthentication')({isHaierStaffAuthentication:true}))  
                yield put(createAction('HaierStaffAuthentication')({haierStaffData:res.data.empInfo}))  
              }else{
                yield put(createAction('HaierStaffAuthentication')({isHaierStaffAuthentication:false}))   
              }
            }else{
              Toast.info(res.message);
            }
          }catch (error) {
            Log('实名认证错误：'+error)
          }
      },
   
  },
};
