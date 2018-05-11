import { Iusers } from '../interface';
import { createAction, isLogin, IS_NOTNIL } from '../utils';
import { fetchUnread } from './homeModel';

const initialState = {
  CommissionNotice: true,
  ReflectedNotice: true,
  mobile : '',
  rankName : '',
  cartNumber : '',
  sessionKey : '',
  userId : '',
  token : '',
  userName : '',
  mid : '',
  avatarImageFileId : '',
  nickName : '',
  gender : '',
  email : '',
  birthday : '',
  sessionValue : '',
  loginName : '',
  ucId : '',
  accessToken : '',
  // userToken: '2e630712-3ae9-4e25-be38-013ba7092986293',
  userToken: '',
  isLogin: false,
  isHost: -1, // 是否是微店主 -1:未登录 0:普通用户 1:微店主
  unread: 0,
};
export default {
  namespace: 'users',
  state: initialState,
  reducers: {
      changeCommissionNotice(state, { payload }): any {
          const { CommissionNotice } = payload;
          return { ...state,  CommissionNotice};
      },
      changeReflectedNotice(state, { payload }): any {
          const { ReflectedNotice } = payload;
          return { ...state, ReflectedNotice};
      },
      saveUsersMsg(state, { payload }): Iusers {
          return { ...state, ...payload };
      },
      clearUserLoginInfo(): Iusers {
        // global.removeItem('userToken');
        return initialState;
      },
      stateChange(state, { payload }) {
        return { ...state, ...payload };
      },
  },
  effects: {
        *getUnreadMessage({ payload }, { call, put }) {
            try {
                if (isLogin(() => Log('====☹️☹️没登录☹️☹️====='))) {
                    const unread = yield call(fetchUnread);
                    if (IS_NOTNIL(unread)) {
                        yield put(createAction('stateChange')({ unread }));
                    }
                }
            } catch (error) {
                Log(error);
            }
        },
  },
};
