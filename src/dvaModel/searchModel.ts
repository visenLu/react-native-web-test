import {postAppJSON, getAppJSON} from '../netWork';
import Config from 'react-native-config';

import URL from './../config/url';
import { GET, GET_P, POST_FORM, POST_JSON } from './../config/Http';

export const fetchHotSearch = async () => {
    try {
        // 旧接口
        // const json   = await getAppJSON('v3/mstore/sg/search/hotSearch.html?platform=3');
        // 热搜列表
        const json = await GET(URL.hot_list, {platform: 3});
        return json.data;
    } catch (error) {
        Log('输出error' + error);
    }
};