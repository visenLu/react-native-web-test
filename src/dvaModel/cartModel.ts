import { getAppJSON } from '../netWork';
import { Toast } from 'antd-mobile';

const initState = {
  totalCount: 0,
    cartSum: 0,
    cartList: [],
    selectedList: [],
};

export default {
  namespace: 'cartModel',
  state: initState,
  reducers: {
    saveCarts(state, action) {
      return {
        ...state,
        cartList: action.payload,
      };
    },
    clearCartInfo(state, action) {
      return initState;
    },
    saveSelect(state, action) {
      return {
        ...state,
        selectedList: action.payload,
      };
    },
    saveTotalCount(state, action) {
      return {
        ...state,
        totalCount: action.payload.totalCount,
        cartSum: action.payload.cartSum,
      };
    },
  },
  effects: {
    *fetchCartList({payload}, {call, put}) {
      try {
        const { success, message, data: { carts }, totalCount } = yield call(getAppJSON, 'v3/h5/cart/list.html', payload, {}, true);
        if (success) {
          let cartSum = 0;
          carts ? carts.forEach(({ number }) => cartSum += number ) : null;
          yield put({
            type: 'saveCarts',
            payload: carts || [],
          });
          yield put({
            type: 'saveTotalCount',
            payload: { cartSum,  totalCount: totalCount || 0 },
          });
        } else {
          Toast.info(message, 2);
        }
      } catch (error) {
        Log(error);
      }
    },
  },
};
