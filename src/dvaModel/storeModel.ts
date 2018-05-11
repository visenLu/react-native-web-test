import { createAction } from '../utils';
import { getAppJSON } from '../netWork';

export enum TitleTemplate {
  ONE = 'tit-df',
  TWO = 'tit-bp',
  THREE = 'tit-colum2',
}

export enum ListTemplate {
  ONE = 'layout-df',
  TWO = 'layout-bp',
  THREE = 'layout-colum2',
}

export default {
  namespace: 'store',
  state: {
    banner: [],
    titleTemplate: TitleTemplate.ONE,
    listTemplate: ListTemplate.TWO,
  },
  reducers: {
    loadData(state, { payload }): any {
      return { ...state, ...payload };
    },
  },
  effects: {
    *fetchBanner({ payload }, { call, put }) {
      try {
        const { success, data } = yield call(
          getAppJSON,
          'v3/mstore/sg/manage.json',
          {storeId: dvaStore.getState().users.mid},
        );
        if (success && data) {
          yield put(createAction('loadData')({
            banner: data.banner,
          }));
        }
      } catch (error) {
        Log(error);
      }
    },

  },
};
