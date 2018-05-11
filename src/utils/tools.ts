import { getAppJSON, getJSONP } from '../netWork';
import { IBannerItem } from '../interface/index';
import { NavigationScreenProp } from 'react-navigation';
import Config from 'react-native-config';
import { createAction } from './index';
import { Platform, Text, Alert, PermissionsAndroid } from 'react-native';
import { Modal as AntModal } from 'antd-mobile';
import AndroidOpenSettings from 'react-native-android-open-settings';
import { IS_NOTNIL } from '../utils';

const malert = AntModal.alert;
const locationUrl = '/v3/geocode/regeo?key=812fde4a1680f0a8da6f4224d7859790&location=';
const locationBaseUrl = 'http://restapi.amap.com';
const getAddressIdUrl = 'v3/mstore/sg/getAddressId.html?provinceName=';

interface IAddress {
    cityId: string;
    provinceId: string;
    regionId: string;
    streetId: string;
}

export function stringToJson(input) {
    let result = [];

    input = input.replace(/^\[/, '');
    input = input.replace(/\]$/, '');

    input = input.replace(/},{/g, '};;;{');
    input = input.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
    // remove non-printable and other non-valid JSON chars
    input = input.replace(/[\u0000-\u0019]+/g, "");

    input = input.split(',');

    input.forEach(function (element) {
        // Log(JSON.stringify(element));
        result.push(JSON.parse(element));
    }, this);

    return result;
}

export async function getStreetName(detail: object, callback: (address: any) => void) {
    const { info, pois } = await getAppJSON('/v3/place/text?key=812fde4a1680f0a8da6f4224d7859790&children=1&offset=1&page=1&extensions=base', detail, {}, false, locationBaseUrl);
    if (info === 'OK' && pois.length > 0) {
        const { info: code, regeocode: { addressComponent: { township } } } = await getAppJSON(`${locationUrl}${pois[0].location}`, {}, {}, true, locationBaseUrl);
        if (code === 'OK') {
            callback(township);
        } else {
            callback('error');
        }
    } else {
        callback('error');
    }
}

export async function getLocation(callback: (address: any) => void) {
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const initialPosition = position;
            const { longitude, latitude } = initialPosition.coords;
            const json = await getAppJSON(`${locationUrl}${longitude},${latitude}`, {}, {}, true, locationBaseUrl);
            const { addressComponent } = json.regeocode;
            const url = `${getAddressIdUrl}${addressComponent.province}&cityName=${addressComponent.city}&regionName=${addressComponent.district}&streetName=${addressComponent.township}&gbCode=${addressComponent.adcode}`;
            const addressJson = await getAppJSON(url);
            const maddress = {
                provinceId: addressJson.data.provinceId,
                cityId: addressJson.data.cityId,
                areaId: addressJson.data.regionId,
                streetId: addressJson.data.streetId,
                provinceName: addressComponent.province,
                cityName: addressComponent.city,
                areaName: addressComponent.district,
                streetName: addressComponent.township,
                regionName: addressComponent.district + '/' + addressComponent.streetNumber.street,
                longitude,
                latitude,
            };
            callback(maddress);
        },
        (error) => {Log('定位失败'), callback(null); },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

    // navigator.geolocation.getCurrentPosition(async (position) => {
    //     const initialPosition = position;
    //     const { longitude, latitude } = initialPosition.coords;
    //     const json = await getAppJSON(`${locationUrl}${longitude},${latitude}`, {}, {}, true, locationBaseUrl);
    //     const { addressComponent } = json.regeocode;
    //     const url = `${getAddressIdUrl}${addressComponent.province}&cityName=${addressComponent.city}&regionName=${addressComponent.district}&streetName=${addressComponent.township}&gbCode=${addressComponent.adcode}`;
    //     const addressJson = await getAppJSON(url);
    //     const maddress = {
    //         provinceId: addressJson.data.provinceId,
    //         cityId: addressJson.data.cityId,
    //         areaId: addressJson.data.regionId,
    //         streetId: addressJson.data.streetId,
    //         provinceName: addressComponent.province,
    //         cityName: addressComponent.city,
    //         areaName: addressComponent.district,
    //         streetName: addressComponent.township,
    //         regionName: addressComponent.district + '/' + addressComponent.streetNumber.street,
    //     };
    //     callback(maddress);
    // },
    //     (error) => {
    //         getLocation(callback);
    //         Log('====================================');
    //         Log('输出错误信息');
    //         Log('====================================');
    //     });
}
export async function goBanner(item: IBannerItem, navigation?: NavigationScreenProp) {
    // const tempArr = item.link.split('&');
    Log('goBanner=========', item);
    const relationId = item.bannerId;
    const link = item.url || item.link;
    const tempArr = link.split('&');
    switch (item.linkType) {
        case -1: // 日常活动  -1：日常活动（根据relationId跳转）
            const params = {
                bannerId: item.relationId,
                isHost: '1',
                backUrl: '',
            };
            const { data } = await getAppJSON('v3/mstore/sg/activity/toActivityPage.html', params);
            Log();
            Log();
            Log();
            Log();
            const { layout } = data;
            navigation.navigate('CustomWebView', { customurl: `${Config.H5_SERVER_URL}bannerDaily/${item.relationId}/${layout}//`, flag: true, headerTitle: '日常活动' });
            break;
        case 0: // 主题活动
            if (item.title === '微学堂') {
                Log();
                dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'CustomWebView', params: { customurl: `${Config.H5_SERVER_URL}microSchool`, flag: true, headerTitle: '微学堂' } }));
            } else {
                dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'CustomWebView', params: { customurl: `${Config.H5_SERVER_URL}bannerTheme/${item.relationId}//`, flag: true, headerTitle: '主题活动' } }));
            }
            //navigation.navigate('CustomWebView', );
            break;
        case 1: // 单品页
            const productId = tempArr[0].slice(tempArr[0].indexOf('=') + 1);
            // navigation.navigate('GoodsDetail', { productId });
            navigation ? navigation.navigate('GoodsDetail', { productId }) :
                navigation = dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'GoodsDetail', params: { productId } }));
            break;
        case 2: // 领券中心
            navigation ? navigation.navigate('CouponCenter') :
                navigation = dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'CouponCenter' }));
            break;
        case 3: // 游戏页
            const arr = item.link.split('=');
            const url = `${Config.H5_SERVER_URL}game/${arr[1]}//`;
            // navigation.navigate('CustomWebView', { customurl: url});
            navigation ? navigation.navigate('CustomWebView', { customurl: url, flag: true, headerTitle: '游戏中心' }) :
                navigation = dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'CustomWebView', params: { customurl: url, flag: true, headerTitle: '游戏中心' } }));
            break;
        case 4: // 活动页
            let activityurl = '';
            let title = '';
            if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) === '日常活动') {
                activityurl = `${Config.H5_SERVER_URL}bannerDaily/${tempArr[1].slice(tempArr[1].indexOf('=') + 1)}///`;
                title = '日常活动';
            } else if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) === '主题活动') {
                activityurl = `${Config.H5_SERVER_URL}bannerTheme/${tempArr[1].slice(tempArr[1].indexOf('=') + 1)}//`;
                title = '主题活动';
            }
            navigation ? navigation.navigate('CustomWebView', { customurl: activityurl, flag: true, headerTitle: title }) :
                navigation = dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'CustomWebView', params: { customurl: activityurl, flag: true, headerTitle: title } }));
            break;
        case 5: // 自定义类型页
            // if (link.indexOf('m.ehaier.com/www/index.html') !== -1) {
            //     var url = link.slice(link.indexOf('#/'));
            //     window.location.hash=url;
            // }else{
            //     window.emc.presentH5View(link, "");
            // }
            dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'CustomWebView', params: { customurl: item.link, flag: true, headerTitle: item.title } }));
            break;
        case 6: // 众筹
            const zcUrl = `${Config.H5_SERVER_URL}crowdFunding//`;
            dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'CustomWebView', params: { customurl: zcUrl, flag: true, headerTitle: '顺逛众筹' } }));
            break;
        case 7: // 新品
            if (!link) {
                const newSendUrl = `${Config.H5_SERVER_URL}newSend`;
                dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'CustomWebView', params: { customurl: newSendUrl, flag: true, headerTitle: '新品众筹' } }));
                break;
            } else {
                const storeId = await global.getItem('storeId');
                dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'GoodsDetail', params: { productId: link, storeId } }));
                break;
            }
        case 8: // 社群
            if (!link) {
                dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'CustomWebView', params: { customurl: `${Config.H5_SERVER_URL}topic/qhot`, flag: true, headerTitle: '顺逛社群' } }));
            } else {
                const mid = tempArr[0].slice(tempArr[0].indexOf('=') + 1);
                const mflag = tempArr[0].slice(tempArr[1].indexOf('=') + 1);
                dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'CustomWebView', params: { customurl: `${Config.H5_SERVER_URL}noteDetails/${mid}/${mflag}/`, flag: true, headerTitle: '话题详情' } }));
            }
            break;
        default:
            break;
    }
}

export function navigationPush(routeName, params?) {
    dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName, params }));
}

export function clickAdImage(advertisement, propsStoreId: any = '') {
    const { type, url } = advertisement;
    const typeStr = '' + type;
    if (typeStr && url) {
        const {
            productId,
            storeId,
            o2oType,
            fromType,
            fromUrl,
            id,
            gameId,
            activityType,
            bannerId,
            memberId,
            isShortStory,
            url: urlAlias,
            link: linkAlias,
        } = url;
        const link = urlAlias || linkAlias;
        let tempArr = [];
        if (link) {
            tempArr = link.split('&');
        }
        switch (typeStr) {
            case '1': // 单品页
                navigationPush('GoodsDetail', {
                    productId,
                    storeId: storeId ? storeId : propsStoreId,
                    o2oType,
                    fromType,
                    fromUrl,
                });
                break;
            case '2': // 领券中心&优惠券详情页
                id ? navigationPush('CouponCenter', {
                    cId: id,
                    userID: propsStoreId,
                    type: 2,
                }) : navigationPush('CouponCenter');
                break;
            case '3': // 游戏页
                const gameUrl = `${Config.H5_SERVER_URL}game/${gameId}//`;
                navigationPush('CustomWebView', {
                    customurl: gameUrl, flag: true, headerTitle: '游戏中心',
                });
                break;
            case '4': // 秒杀活动页
                if ('日常活动' === activityType) {
                    const activityurl = `${Config.H5_SERVER_URL}bannerDaily/${bannerId}///`;
                    navigationPush('CustomWebView', {
                        customurl: `${Config.H5_SERVER_URL}bannerDaily/${bannerId}///`,
                        flag: true,
                        headerTitle: '日常活动',
                    });
                } else if ('主题活动' === activityType) {
                    const activityurl = `${Config.H5_SERVER_URL}bannerTheme/${bannerId}//`;
                    navigationPush('CustomWebView', {
                        customurl: activityurl, flag: true, headerTitle: '主题活动',
                    });
                }
                break;
            case '5': // 自定义类型页
                navigationPush('CustomWebView', {
                    customurl: link, flag: true, headerTitle: '自定义活动',
                });
                break;
            case '6': // 众筹
                navigationPush('CustomWebView', {
                    customurl: `${Config.H5_SERVER_URL}crowdFunding//`, flag: true, headerTitle: '顺逛众筹',
                });
                break;
            case '7': // 新品
                if (urlAlias) {
                  navigationPush('CustomWebView', {
                    customurl: `${Config.H5_SERVER_URL}productDetail/${urlAlias}///${propsStoreId}/`, flag: true, headerTitle: '新品众筹',
                  });
                } else {
                    navigationPush('CustomWebView', {
                        customurl: `${Config.H5_SERVER_URL}newSend`, flag: true, headerTitle: '新品众筹',
                    });
                }
                break;
            case '8': // 社群
                const mid = id;
                const mflag = isShortStory;
                if (mflag === '0' || mflag === '1') {
                    navigationPush('CustomWebView', {
                      customurl: `${Config.H5_SERVER_URL}noteDetails/${mid}/${mflag}/`, flag: true, headerTitle: '话题详情',
                    });
                } else {
                    navigationPush('CustomWebView', {
                      customurl: `${Config.H5_SERVER_URL}topic/qhot`, flag: true, headerTitle: '顺逛社群',
                    });
                }
                break;
            default:
                break;
        }
    }
}
export function goGoodsDetail(productId: number, storeId: number, productFullName?: string, productTitle?: string, price?: string, swiperImg?: string) {
    // const storeID = '';
    dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'GoodsDetail', params: { productId, storeId, productFullName, productTitle, price, swiperImg } }));
}
export async function getLocationPermisson() {
    // this.props.navigation.navigate('TestView', { titleName: '地址界面'})
    if (Platform.OS === 'ios') {
    } else {
        const locationPmt = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (!locationPmt) { // 如果安卓定位权限是关闭状态
            // 开始申请权限
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: '',
                message: '顺逛需要您打开地理定位权限',
            });
            if (granted) { // 如果用户同意了申请权限
                getLocation((address) => {
                    if (IS_NOTNIL(address)) {
                        const maddress = Object.assign({}, address);
                        const { provinceName, cityName } = address;
                        if (provinceName.endsWith('市')) {
                            maddress.provinceName = provinceName.substring(0, provinceName.length - 1);
                        }
                        if (cityName.length === 0) {
                            maddress.cityName = address.provinceName;
                        }
                        dvaStore.dispatch(createAction('address/changeAddress')(maddress));
                    }
                });
            }
        }
    }
}
// export function _requestPermission() {
//     // example
//     Permissions.request('location', 'whenInUse').then(response => {
//         if (response === 'restricted') {
//             if (Platform.OS === 'android') {
//                 Alert.alert(
//                     null,
//                     `顺逛需要您打开地理定位权限`,
//                     [
//                       {text: '取消', onPress: () => console.log('Ask me later pressed')},
//                       {text: '确认', onPress: () => AndroidOpenSettings.appDetailsSettings()},
//                     ],
//                   );
//             } else {
//                 Alert.alert(
//                     null,
//                     `顺逛需要您打开地理定位权限`,
//                     [
//                       {text: '取消', onPress: () => console.log('Ask me later pressed')},
//                       {text: '确认', onPress: () => Permissions.openSettings().then(() => null)},
//                     ],
//                   );
//             }
//         }
//     });
// }
