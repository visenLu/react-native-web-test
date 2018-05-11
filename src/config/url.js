
import config from './index';
const API_HOST = config.API_HOST;
const API_DETAIL_HOST = config.API_DETAIL_HOST;
const API_SEARCH_HOST = config.API_SEARCH_HOST;
const SERVER_DATA_HOST = config.SERVER_DATA_HOST;
const PAY_SERVER_HOST = config.PAY_SERVER_HOST;
const API_NEWHOME_HOST = config.API_NEWHOME_HOST;

const getFullUrl = (url, host = API_HOST)=>{
    return `${host}/${url}`;
};

const HOT_LIST = `search/search/hotSearch.html`; // 热搜列表 docs: http://gitlab.test.ehaier.com/front-end/618_interface/wikis/5%E3%80%81%E7%83%AD%E8%AF%8D%E6%90%9C%E7%B4%A2
const HOT_WORD = `search/search/defaultSearch.html`; // 热词 docs: http://gitlab.test.ehaier.com/front-end/618_interface/wikis/4%E3%80%81%E9%BB%98%E8%AE%A4%E6%90%9C%E7%B4%A2%E8%AF%8D
const KEYWORD_SEARCH = `search/wdCommonSearchNew.html`; // 关键词搜索 docs: http://gitlab.test.ehaier.com/front-end/618_interface/wikis/2%E3%80%81%E6%90%9C%E7%B4%A2%E6%8E%A5%E5%8F%A3
const CATEGORY_LIST = `search/commonLoadItemNew.html`; // 分类类目列表 docs: http://gitlab.test.ehaier.com/front-end/618_interface/wikis/1%E3%80%81%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8
const FILTER_DATA = `search/wdMarketFiltrate.html`; // 筛选 docs: http://gitlab.test.ehaier.com/front-end/618_interface/wikis/6%E3%80%81%E7%AD%9B%E9%80%89
const GET_PRICE_BY_TRACEID = `search/getPriceByProductList.html`; // 后续获取价格 docs: http://gitlab.test.ehaier.com/front-end/618_interface/wikis/3%E3%80%81%E5%90%8E%E7%BB%AD%E8%8E%B7%E5%8F%96%E4%BB%B7%E6%A0%BC

const CTJJ_HEADER = `sg/cms/home/smart.json`; // 成套家具头部
const CTJJ_MENUS_CASES = `sg/cms/home/smart.json`; // 成套家具头部
const TOPIC = `sg/cms/home/storys.json`; // 话题接口 http://rap.test.ehaier.com/workspace/myWorkspace.do?projectId=10#282
const CTJJ_NEARBY = `sg/cms/home/nearby.json`; // 附近体验店

// 单品
const GOODS_DETAIL = 'item/purchase/'; //商品详情页接口
const GOODS_CHECKSTOCK = 'item/purchase/checkStock.json'; //单品页库存
const GOODS_IS_ATTRIBUTE = 'item/attribute/isShowAttr.json'; //是否展示规格参数 
const GOODS_ATTRIBUTE = 'item/attribute/getSgStoreAttribute.json'; //商品规格参数
const GOODS_EVALUATE_COUNT = 'item/evaluation/'; //商品详情评价条数
const CHECKSTOCKFORNUM = 'item/purchase/checkStockForNum.json'; //立即购买前的校验


const TOKEN_GET = 'platform/web/member/queryAccessToken.json'; //Token获取(首页的生活服务需要token)
const LIFESERVE = 'sg/cms/home/life.json';  // 生活服务首页
//结算页
const CREATORDER = 'v3/h5/order/createOrder.json'; //结算页主接口
const GETPAGEINFO = 'v3/h5/order/getPageInfo.json'; //更新结算页接口
const UPDATEPAY = 'v3/h5/order/updatePay.json';// 更新支付方式
const CHECKGIFT = 'v3/h5/order/checkGift.json'; //礼品券校验接口
const CANCELGIFT = 'v3/h5/order/cancelGift.json'; //取消礼品券
const SUBMITORDER = 'v3/h5/order/asynSubmitOrder.json'; //提交订单
const GETSTORECOUPON= 'v3/h5/order/getStoreCoupon.json'; //获取店铺券
const CHOICESTORECOUPON= 'v3/h5/order/choiceStoreCoupon.json'; //选择店铺券
const GETORDERCOUPON= 'v3/h5/order/getOrderCoupon.json';//获取平台券
const CHOICEORDERCOUPON= 'v3/h5/order/choiceOrderCoupon.json'; //选择平台券
const GETCANCHOICEDATE= 'v3/h5/order/getCanChoiceDate.json'; //获取可用预约送达时间
const CHOICEDATE= 'v3/h5/order/choiceDate'; //更新预计约送货时间
const TOINVOICE= 'v3/h5/order/toInvoice.json'; //获取发票信息
const SUBMITMEMINVOICE= 'v3/h5/order/submitMemInvoice.json'; //发票提交接口
//收获地址
const MEMBERADDRESSES= 'v3/h5/order/memberAddresses.json'; //收获地址列表
const INSERTADDRESS= 'v3/h5/order/insertAddress.json'; //新增收货地址
const DELITEADDRESS= 'v3/h5/order/deleteAddress.json';//删除收获地址
const DELETEBATCHADDRESS= '/v3/h5/order/deleteBatchAddress'; //批量删除收货地址
const UPDATEADDRESS= 'v3/h5/order/updateAddress.json'; //修改收货地址
const UPDATEDEFAULTADDRESS= 'v3/h5/order/updateDefaultAddress.json'; // 设置默认收获地址
const CHANGEADDRESS= 'v3/h5/order/changeAddress.json'; //选择收获地址
const ADDRESS= 'v3/h5/order/address.json'; //编辑收货地址获取信息

const UPLOAD_IMAGE="platform/web/app/uploadImage";//上传头像


export default url = {
    hot_list: getFullUrl(HOT_LIST, API_SEARCH_HOST),
    hot_word: getFullUrl(HOT_WORD, API_SEARCH_HOST),
    keyword_search: getFullUrl(KEYWORD_SEARCH, API_SEARCH_HOST),
    category_list: getFullUrl(CATEGORY_LIST, API_SEARCH_HOST),
    filter_data: getFullUrl(FILTER_DATA, API_SEARCH_HOST),
    get_price_by_traceid: getFullUrl(GET_PRICE_BY_TRACEID, API_SEARCH_HOST),
    get_ctjj_header: getFullUrl(CTJJ_HEADER, API_NEWHOME_HOST),
    get_ctjj_menus_cases: getFullUrl(CTJJ_MENUS_CASES, API_NEWHOME_HOST),
    get_topic: getFullUrl(TOPIC, API_NEWHOME_HOST), // 话题,包括视频等
    get_ctjj_nearby: getFullUrl(CTJJ_NEARBY, API_NEWHOME_HOST),
    // 单品
    GOODS_DETAIL: getFullUrl(GOODS_DETAIL,API_DETAIL_HOST),
    GOODS_CHECKSTOCK: getFullUrl(GOODS_CHECKSTOCK, API_DETAIL_HOST),
    GOODS_IS_ATTRIBUTE: getFullUrl(GOODS_IS_ATTRIBUTE, API_DETAIL_HOST),
    GOODS_ATTRIBUTE: getFullUrl(GOODS_ATTRIBUTE, API_DETAIL_HOST),
    GOODS_EVALUATE_COUNT: getFullUrl(GOODS_EVALUATE_COUNT, API_DETAIL_HOST),
    CHECKSTOCKFORNUM: getFullUrl(CHECKSTOCKFORNUM, API_DETAIL_HOST),

    TOKEN_GET: getFullUrl(TOKEN_GET, SERVER_DATA_HOST),
    LIFESERVE: getFullUrl(LIFESERVE, API_NEWHOME_HOST),

    // 结算
    CREATORDER: getFullUrl(CREATORDER, API_HOST),
    // 结算
    UPLOAD_IMAGE: getFullUrl(UPLOAD_IMAGE, SERVER_DATA_HOST),
    GETPAGEINFO: getFullUrl(GETPAGEINFO, API_HOST),
    UPDATEPAY: getFullUrl(UPDATEPAY, API_HOST),
    CHECKGIFT: getFullUrl(CHECKGIFT, API_HOST),
    CANCELGIFT: getFullUrl(CANCELGIFT, API_HOST),
    SUBMITORDER: getFullUrl(SUBMITORDER, API_HOST),
    GETSTORECOUPON: getFullUrl(GETSTORECOUPON, API_HOST),
    CHOICESTORECOUPON: getFullUrl(CHOICESTORECOUPON, API_HOST),
    GETORDERCOUPON: getFullUrl(GETORDERCOUPON, API_HOST),
    CHOICEORDERCOUPON: getFullUrl(CHOICEORDERCOUPON, API_HOST),
    GETCANCHOICEDATE: getFullUrl(GETCANCHOICEDATE, API_HOST),
    CHOICEDATE: getFullUrl(CHOICEDATE, API_HOST),
    TOINVOICE: getFullUrl(TOINVOICE, API_HOST),
    SUBMITMEMINVOICE: getFullUrl(SUBMITMEMINVOICE, API_HOST),

    // 收获地址
    MEMBERADDRESSES: getFullUrl(MEMBERADDRESSES, API_HOST),
    INSERTADDRESS: getFullUrl(INSERTADDRESS, API_HOST),
    DELITEADDRESS: getFullUrl(DELITEADDRESS, API_HOST),
    DELETEBATCHADDRESS: getFullUrl(DELETEBATCHADDRESS, API_HOST),
    UPDATEADDRESS: getFullUrl(UPDATEADDRESS, API_HOST),
    UPDATEDEFAULTADDRESS: getFullUrl(UPDATEDEFAULTADDRESS, API_HOST),
    CHANGEADDRESS: getFullUrl(CHANGEADDRESS, API_HOST),
    ADDRESS: getFullUrl(ADDRESS, API_HOST),

}
