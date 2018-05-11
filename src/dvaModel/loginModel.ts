import { getAppJSON} from '../netWork';
import { Toast } from 'antd-mobile';
import { createAction } from '../utils';
import Config from 'react-native-config';

interface Ilogin {
  isLoading: boolean;
}

export default {
  namespace: 'loginModel',
  state: {
    isLoading: false,
  },
  reducers: {
      loadingChange(state, { payload }): Ilogin {
          return { ...state, ...payload };
      },
  },
  effects: {
      *login({ payload }, { call, put }) {
        try {
          // yield put({ type: 'loadingChange', payload: { isLoading: true } });
          yield put(createAction('loadingChange')({ isLoading: true }));
          // tslint:disable-next-line:max-line-length
          const url = `/v3/platform/web/member/captchaLogin.json?userName=${payload.name}&password=${payload.password}&captcha=&isNew=1&noLoading=true`;
          const data =  yield call(getAppJSON, url);
          // Log(data);
          if (!data.errorCode) {
              Toast.success('登录成功', 3);
          } else {
            Toast.fail(data.message, 3);
          }
          yield put(createAction('loadingChange')({ isLoading: false }));
          yield put(createAction('user/stateChange')({ data }));
        } catch (error) {
          console.error(error);
          Toast.fail('登录发生错误', 3);
        }
      },

      *loginSMS({payload}, {call, put}) {
        try {
          // yield put({ type: 'loadingChange', payload: { isLoading: true } });
          yield put(createAction('loadingChange')({ isLoading: true }));
          // tslint:disable-next-line:max-line-length
          const url = `/v3/platform/web/member/captchaForSmsLogin.json?mobile=${payload.name}`;
          const data =  yield call(getAppJSON, url);
          // Log(data);
          if (!data.errorCode) {
              Toast.success('获取短信验证码成功', 3);
          } else {
            Toast.fail(data.message, 3);
          }
          yield put(createAction('loadingChange')({ isLoading: false }));
        } catch (error) {
          console.error(error);
          Toast.fail('获取短信验证码失败', 3);
        }
      },
  },
};
