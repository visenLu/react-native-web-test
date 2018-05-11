import { getAppJSON } from '../netWork';
import Config from 'react-native-config';
import { createAction } from '../utils';
import { AsyncStorage } from 'react-native';
import moment from 'moment';
import RNFS from 'react-native-fs';

const initState = {
  adData: null,
  videoUrl: null,
};

export default {
  namespace: 'adModel',
  state: initState,
  reducers: {
    changeState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *loadAd({ payload }, { call, put, select }) {
      let videoUrl = null;
      let adData = null;

      //  获取本地存取的视频
      const localVideoUrl = yield call(AsyncStorage.getItem, 'adVideoUrlName');
      if (localVideoUrl) {
        const seeDate = yield call(AsyncStorage.getItem, 'videoUrlSeeDate');
        const todayStr = moment().format('YYYY-MM-DD');
        if (!seeDate || seeDate !== todayStr) {
          videoUrl = localVideoUrl;
        }

      // 需要播放未缓存就打开下面注释
      // } else {
      //   const { data: videoData } = yield call(getAppJSON, Config.AD_VIDEO, {}, {}, true);
      //   videoUrl = videoData && videoData.url ? videoData.url : '';
      }

      // 获取本地存取的图片
      const users = yield select(state => state.users);
      if (users.mid) {
        const dataJSON = yield call(AsyncStorage.getItem, 'adImgJSON');
        const data = JSON.parse(dataJSON);
        if (data && data.length > 0) {
          // 记录查看次数
          const adImgSeeTimesJSON = yield call(AsyncStorage.getItem, 'adImgSeeTimes');
          const adImgSeeTimes = JSON.parse(adImgSeeTimesJSON);
          const times = !!adImgSeeTimes ? adImgSeeTimes[users.mid] : 0;
          if (!times || times < 3) {
            adData = data;
            yield put(createAction('changeState')({ adData }));
            const jsonMap = { [users.mid]: (times + 1) };
            yield call(AsyncStorage.setItem, 'adImgSeeTimes', JSON.stringify(jsonMap));
          }
        }
      }

      yield put(createAction('changeState')({ videoUrl, adData }));
    },
    // 检查服务器广告业信息
    *checkSeverAd({ payload }, { call, put, take }) {
      try {
        yield put(createAction('loadAdVideo')());
        yield put(createAction('loadAdImg')());
      } catch (error) {
        Log(error);
      }
    },

    *loadAdImg({ payload }, { call, put, select }) {
      try {
        const users = yield select(state => state.users);
        if (users.mid) {
          const { data } = yield call(getAppJSON, Config.ADVERTISEMENT, { noLoading: true, ...payload }, {}, true);
          const dataJSON = JSON.stringify(data || []);
          const preDataJSON = yield call(AsyncStorage.getItem, 'adImgJSON');
          if (!preDataJSON || preDataJSON !== dataJSON) {
            AsyncStorage.setItem('adImgJSON', dataJSON);
            AsyncStorage.setItem('adImgSeeTimes', '');
          }
        }
      } catch (error) {
        Log(error);
      }
    },
    *loadAdVideo({ payload }, { call, put, select }) {
      try {
        const { data: videoData } = yield call(getAppJSON, Config.AD_VIDEO, {}, {}, true);
        const videoUrl = videoData && videoData.url ? videoData.url : '';
        const preVideoUrl = yield call(AsyncStorage.getItem, 'adVideoUrlName');
        if (!preVideoUrl || preVideoUrl !== videoUrl) {
          RNFS.downloadFile({ fromUrl: videoUrl, toFile: `${RNFS.DocumentDirectoryPath}/adVideo.mp4` }).promise.then(() => {
            AsyncStorage.setItem('adVideoUrlName', videoUrl);
          });
        }
      } catch (error) {
        Log(error);
      }
    },
  },
};
