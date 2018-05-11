export default {
    namespace: 'investmentInfo',
    state: {
        frontPage: 'homePage',
   },
    reducers: {
        updateFrontPage(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    effects: {
        *loadingChange({ payload }, { call, put }) {
            yield put({ type: 'updateFrontPage', payload });
        },
    },
  };
