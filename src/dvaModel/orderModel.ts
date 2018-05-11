import { postAppJSON, getAppJSON, postAppForm } from '../netWork';
import { createAction, createIdAction, isLogin, IS_NOTNIL } from '../utils/index';
import { IProductInfo, CountStyleType } from '../interface';
import { accAdd, accMul, accSub } from '../utils/MathTools';
import { Toast } from 'antd-mobile';
import { Alert, DeviceEventEmitter } from 'react-native';
import URL from '../config/url';
import { GET, POST_JSON, GET_P, POST_FORM } from '../config/Http';
import Config from 'react-native-config';


// 数据json格式化
let formatComponentData = (data = [], callback) => {
    let arr = [];
    if (data && data.length) {
        // console.log(data)
        data.map((o, i) => {
            arr.push(
                callback(o)
            );
        });
        return arr;
    }
};
let formatComponentDataToJson = (data = [], callback) => {
    let json = {};
    if (data && data.length) {
        // console.log(data)
        data.map((o, i) => {
            json = Object.assign(json, callback(o))
        });
        return json;
    }
};
interface IOrder {
    pageInfo: any;
    productInfo: IProductInfo;
}
function initPoint(payAmount, mitem): any {
    // 当前总价
    let canUsePoint = 0;
    // 当前打折金额
    let pointDiscount = accMul(payAmount, mitem.quota);
    if (pointDiscount > payAmount) {
        pointDiscount = payAmount;
    }
    // 取整数
    canUsePoint = Math.floor(accMul(pointDiscount, mitem.proportion));
    pointDiscount = canUsePoint / mitem.proportion;
    if (canUsePoint > mitem.count) {
        // 可用积分大于总积分，取总积分，并重新计算抵扣金额
        canUsePoint = mitem.count;
        pointDiscount = canUsePoint / mitem.proportion;
    }
    const item = { canUsePoint, pointDiscount, isSelected: false };
    return { ...item };
}

const initState = {
    standardDeliveryDate: '',
    deliveryWay: { resShippingList: [] },
    giftCardNumber: '请输入礼品卡券',
    pageInfo: {
        commodityAmount: 0,
        o2oStore: {},
        ordersCommitWrapM: {
            benefitList: [],
            orderProductList: [{ productId: 'init', orderPromotionAmount: 0, couponCode: null }], // 初的始值  防止地址新增崩溃
            invoiceType: '',
            billCompany: '',
            memberInvoices: {
                invoiceTitle: '',
            },
            order: {
                couponCodeValue: 0,
                couponCode: null,
            },
            payList: [],
        },
    },
    submitOrder: {},
    payInfo: { orders: { orderAmount: 0 } },
    price: {// 每件商品的小计 信息
        productSmallPrice: [],
        // 使用钻石、积分 数组
        newBenefit: [],
        // 订单总金额
        commodityAmount: 0,
        // 优惠后的订单总金额
        newprice: 0,
        // 通用优惠券 使用金额
        couponCodeValue: 0,
        // 是否可用优惠券
        canUsecoupon: false,
        // 店铺优惠券总金额
        StoreCouponCodeValue: 0,
        // 是否使用钻石
        diamondStatus: false,
        // 是否使用积分
        jifenStatus: false,
        // 下单满减
        itemShareAmount: 0,
    },
};
export const submAlipay = async () => {
    try {
        const { order: { payInfo: { orders: { orderSn: outTradeno, orderAmount } } } } = dvaStore.getState();
        const params = {
            tradeNo: outTradeno,
            subject: '海尔顺逛微店',
            body: '顺逛微店-订单号:' + outTradeno,
            price: orderAmount,
            notifyUrl: `${Config.ALIPAY_NOTIFY_DOMAIN}h5/pay/app/alipay/notify.html`,
        };
        const url = 'v3/h5/sg/orderSign.html';
        const json = await postAppForm(url, params);
        return json;
    } catch (error) {
        Log('输出error' + error);
    }
};

export const submWeixin = async () => {
    try {
        const { order: { payInfo: { orders: { orderSn, orderAmount } } } } = dvaStore.getState();
        const params = {
            orderSn,
        };
        const url = 'v3/h5/pay/wxpay.html?orderSn=' + orderSn;
        const json = await getAppJSON(url);
        return json;
    } catch (error) {
        Log('输出error' + error);
    }
};
export const submitPayway = async (value) => {
    try {
        let params = {};
        if (value == 'onlne') {
            params = {
                code: 'online',
                name: '在线支付'
            }
        } else if (value == 'cod') {
            params = {
                code: 'cod',
                name: '货到付款'
            }
        }
        const json = await POST_JSON(URL.UPDATEPAY, params);
        return json;
    } catch (error) {
        Log('输出error' + error);
    }
};
export default {
    namespace: 'order',
    state: initState,
    reducers: {
        clearOrder(state, { payload }): any {
            return { ...initState };
        },
        // 计算原始积分使用情况
        initPay(state, { payload }): any {
            return { ...state, payInfo: { ...payload } };
        },
        // 计算原始积分使用情况
        initPrice(state, { payload }): any {
            console.log(payload)
            // const { oringindata: { benefit = [], itemShareAmount, commodityAmount, ordersCommitWrapM: { orderProductList, order: { couponCodeValue } } } } = payload;
            const { pageData: {
                pageInfo: {
                    benefit = [],
                    itemShareAmount,
                    commodityAmount,
                    ordersCommitWrapM: {
                        orderProductList,
                        order: {
                            couponCodeValue
                        }
                    }
                }
            } } = payload;
            let newprice = commodityAmount;
            let StoreCouponCodeValue = 0;
            // 减去满减金额
            if (Number(itemShareAmount) > 0) {
                newprice = accSub(newprice, itemShareAmount);
            }
            // 最终使用的优惠方式
            const finalbenefit = [];
            const newBenefit = [];
            const productSmallPrice = [];
            // 计算店铺优惠券
            for (let index = 0; index < orderProductList.length; index++) {
                const element = orderProductList[index];
                let newSmallPrice = element.productAmount;
                if (element.couponCodeValue !== null && element.couponCodeValue !== undefined) {
                    newSmallPrice = accSub(newSmallPrice, element.couponCodeValue);
                    newprice = accSub(newprice, element.couponCodeValue);
                    StoreCouponCodeValue = accAdd(StoreCouponCodeValue, element.couponCodeValue);
                }
                productSmallPrice.push({
                    // 使用店铺优惠后的小计
                    newSmallPrice,
                    // 原商品 小计
                    productAmount: element.productAmount,
                    // 店铺优惠金额
                    couponCodeValue: element.couponCodeValue,
                    productId: element.productId
                });
            }
            // 先计算通用优惠券
            if (couponCodeValue) {
                if (couponCodeValue !== 0) {
                    // 总金额等于总金额减去通用优惠券的金额
                    newprice = accSub(newprice, couponCodeValue);
                }
            }
            if (Number(newprice) < 0) {
                newprice = 0.01;
            }
            benefit.map((item) => {
                newBenefit.push({ ...item, ...initPoint(newprice, item) });
            });
            const price = {
                newBenefit,
                commodityAmount,
                newprice,
                finalbenefit,
                couponCodeValue,
                StoreCouponCodeValue,
                productSmallPrice,
                itemShareAmount,
            };
            return { ...state, price: { ...price } };
        },
        changeSubmitOrder(state, { payload }): any {
            return { ...state, submitOrder: { ...payload } };
        },
        countPoint(state, { payload }): any {
            const { commodityAmount, newprice, itemShareAmount, newBenefit, couponCodeValue, StoreCouponCodeValue } = state.price;
            const { useBenfits } = payload;
            const price = state.price;

            let mnewprice = commodityAmount;
            // 减去满减金额
            if (Number(itemShareAmount) > 0) {
                mnewprice = accSub(mnewprice, itemShareAmount);
            }
            // 减去店铺优惠券
            if (Number(StoreCouponCodeValue)) {
                mnewprice = accSub(mnewprice, StoreCouponCodeValue);
            }
            // 先计算通用优惠券
            if (couponCodeValue) {
                if (couponCodeValue !== 0) {
                    // 总金额等于总金额减去通用优惠券的金额
                    mnewprice = accSub(mnewprice, couponCodeValue);
                }
            }
            const tempPrice = mnewprice; // 记录使用积分钻石前的支付金额，为了取消时恢复原始的数据
            const mnewBenefit = [];
            if (useBenfits.length > 0) {
                if (useBenfits.find((myitem) => myitem.benefitType === 'seashell')) {
                    useBenfits.map((myiitem) => {
                        if (myiitem.benefitType === 'seashell') {
                            if (Number(accSub(mnewprice, myiitem.pointDiscount)) < 0) {
                                price.jifenStatus = false;
                            } else {
                                mnewprice = accSub(mnewprice, myiitem.pointDiscount);
                                mnewBenefit.push(myiitem);
                                price.jifenStatus = true;
                            }
                        }
                    });
                    const mindex = mnewBenefit.findIndex((item) => item.benefitType === 'diamond');
                    const nindex = useBenfits.findIndex((item) => item.benefitType === 'diamond');
                    // 如果当前没有选择使用积分，如果已经选用积分 不做处理
                    if (mindex !== -1 && nindex === -1) {
                        mnewBenefit.splice(mindex, 1);
                        const item = newBenefit.find((myitem) => myitem.benefitType === 'diamond');
                        mnewBenefit.push({ ...item, ...initPoint(mnewprice, item) });
                    }

                } else {
                    newBenefit.map((mmmitem) => {
                        // 如果当前不是积分，则重新计算积分使用数量
                        if (mmmitem.benefitType === 'seashell') {
                            mnewBenefit.push({ ...mmmitem, ...initPoint(mnewprice, mmmitem) });
                        }
                    });
                    price.jifenStatus = false;
                }
                if (useBenfits.find((myitem) => myitem.benefitType === 'diamond')) {
                    useBenfits.map((myiitem) => {
                        if (myiitem.benefitType === 'diamond') {
                            if (Number(accSub(mnewprice, myiitem.pointDiscount)) < 0) {
                                price.diamondStatus = false;
                            } else {
                                mnewprice = accSub(mnewprice, myiitem.pointDiscount);
                                mnewBenefit.push(myiitem);
                                price.diamondStatus = true;
                            }
                        }
                    });
                    const mindex = mnewBenefit.findIndex((item) => item.benefitType === 'seashell');
                    const nindex = useBenfits.findIndex((item) => item.benefitType === 'seashell');
                    // 如果当前没有选择使用积分，如果已经选用积分 不做处理
                    if (mindex !== -1 && nindex === -1) {
                        mnewBenefit.splice(mindex, 1);
                        const item = newBenefit.find((myitem) => myitem.benefitType === 'seashell');
                        mnewBenefit.push({ ...item, ...initPoint(mnewprice, item) });
                    }

                } else {
                    price.diamondStatus = false;
                    newBenefit.map((mmmitem) => {
                        // 如果当前不是钻石，则重新计算钻石使用数量
                        if (mmmitem.benefitType === 'diamond') {
                            mnewBenefit.push({ ...mmmitem, ...initPoint(mnewprice, mmmitem) });
                        }
                    });
                }
            } else {
                // 取消勾选处理
                price.diamondStatus = false;
                price.jifenStatus = false;
                mnewprice = tempPrice; // 获取优惠前的数据
                newBenefit.map((item) => {
                    mnewBenefit.push({ ...item, ...initPoint(mnewprice, item) });
                });
            }
            if (Number(mnewprice) < 0) {
                mnewprice = 0.01;
            }
            price.newBenefit = mnewBenefit,
                price.newprice = mnewprice;
            return { ...state, price: { ...price } };
        },
        changePageInfo(state, { payload }): IOrder {
            return { ...state, ...payload };
        },
        changeGiftCardNumber(state, { payload }): IOrder {
            return { ...state, ...payload };
        },
        changeDeliveryWay(state, { payload }): any {
            return { ...state, ...payload };
        },
    },
    effects: {
        *submitDeliveryTime({ payload: { delivery, yuyueDay, yuyueTime, skku, attrValueNames, o2oAttrId } }, { call, put }) {
            try {
                const oringinUrl = 'v3/h5/sg/order/submitDeliveryway.html?delivery=';
                const url = `${oringinUrl}${delivery}&yuyueDay=${yuyueDay}&yuyueTime=${yuyueTime}`;
                const { success } = yield call(postAppJSON, url);
                if (success) {
                    yield put(createAction('fetchPageInfo')({ isRefresh: true }));
                }

            } catch (error) {
                Log(error);
            }
        },
        *submitOrder({ payload: { isBooking, benefitList } }, { call, put, select }) {
            try {
                const params = {
                    remark: '',
                    isBooking,
                    benefitList,
                };
                // const url = 'v3/h5/sg/order/orderSubmitBenefitMixture.html';
                // const { success, data } = yield call(postAppJSON, url, params);
                // 提交订单接口
                const { success, data } = yield POST_JSON(URL.SUBMITORDER, params);
                // const {newprice: oa, orderSn: os, paymentCode: pyc} = data;
                if (success) {
                    yield put(createAction('changeSubmitOrder')({ ...data }));
                    // const { price: { newprice }, submitOrder: { order: { orderSn, paymentCode } } } = yield select(state => state.order);
                    if (data.pyc === 'online') {
                        yield put(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'Payment', params: { price: data.oa, orderSn: data.os } }));
                    } else {
                        yield put(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'PaymentResult', params: { orderSn: data.os, price: data.oa } }));
                    }
                    //成功后刷新购物车列表
                    yield put(createAction('cartModel/fetchCartList')());
                }
            } catch (error) {
                Toast.fail(error);
            }
        },
        *selectedCouponNew({ payload: { memberCouponId = null, productId = '', skku = '', attrValueNames = '', o2oAttrId = '' } }, { call, put }) {
            try {
                let url = '';
                if (IS_NOTNIL(memberCouponId)) {
                    url = `v3/h5/sg/coupons/selectedCouponNew.html?memberCouponId=${memberCouponId}&productId=${productId}`;
                } else {
                    url = `v3/h5/sg/coupons/selectedCouponNew.html?productId=${productId}`;
                }
                const { success, data } = yield call(postAppJSON, url);
                if (success) {
                    DeviceEventEmitter.emit('resetBenifit', '');
                    yield put(createAction('router/apply')({ type: 'Navigation/BACK' }));
                    yield put(createAction('fetchPageInfo')({ isRefresh: true }));
                }
            } catch (error) {
                Log(error);
            }
        },
        *initpay({ payload }, { call, put }) {
            try {
                // tslint:disable-next-line:no-shadowed-variable
                const { orderSn } = payload;
                const url = `v3/h5/sg/order/toOrderSubmitSuccess.html?orderSn=${orderSn ? orderSn : dvaStore.getState().order.submitOrder.order.orderSn}`;
                const { data } = yield call(getAppJSON, url);
                yield put(createAction('initPay')({ ...data }));
            } catch (error) {
                Log(error);
            }
        },
        *chooseAddress({ payload: { addrId, skku, attrValueNames, o2oAttrId } }, { call, put }) {
            try {
                const url = `v3/h5/sg/shippingAddress/chooseAddr.html?addrId=${addrId}`;
                const { success } = yield call(getAppJSON, url);
                if (success) {
                    yield put(createAction('fetchPageInfo')({ isRefresh: true }));
                }
            } catch (error) {
                Log(error);
            }
        },
        *fetchDeliveryWay({ payload }, { call, put }) {
            try {
                const url = 'v3/h5/sg/order/toChooseDeliveryWay.html?toUrl=2';
                const { data } = yield call(getAppJSON, url);
                yield put(createAction('changeDeliveryWay')({ deliveryWay: data }));
            } catch (error) {
                Log(error);
            }
        },
        *putPageInfo({ payload }, { call, put, select }) {

            let { orderInitParams, isRefresh } = payload;
            // let { productInfo } = payload;
            let skku = '';
            let attrValueNames = '';
            let o2oAttrId = '';
            console.log(payload)
            // if (!productInfo) { //来自商品详情页
            //     // productInfo = yield select(state => state.goodsDetail.toJS()[payload.modelId].productInfo);
            //     // const { attData, uiState: { showCountType }, O2OSData: { o2oStoreId } } = yield select(({ goodsDetail }) => goodsDetail.toJS()[payload.modelId]);
            //     // if (!isLogin()) {
            //     //     if (showCountType !== CountStyleType.None) {
            //     //         yield put(createIdAction('goodsDetail/changeUIState')({ modelId: payload.modelId, showCountType: CountStyleType.None }));
            //     //     }
            //     //     return;
            //     // }
            //     // const { sku, o2omap = '', o2oStoreName = '', productAttInfo = {} } = productInfo;
            //     // skku = productAttInfo.skku;
            //     // attrValueNames = productAttInfo.attrValueName;
            //     // o2oAttrId = o2oStoreId;
            //     // if (attData && !skku) {
            //     //     if (showCountType !== CountStyleType.BuyNow) {
            //     //         yield put(createIdAction('goodsDetail/changeUIState')({ modelId: payload.modelId, showCountType: CountStyleType.BuyNow }));
            //     //         return;
            //     //     } else {
            //     //         Alert.alert(
            //     //             '',
            //     //             '规格参数未选择完成',
            //     //             [
            //     //                 { text: '确定' },
            //     //             ],
            //     //             { cancelable: true },
            //     //         );
            //     //         return;
            //     //     }
            //     // } else if (number === 0) {
            //     //     Toast.show('请选择数量');
            //     //     return;
            //     // 
            //     // const productId = productInfo.productId;
            //     // const number = productInfo.number;
            //     // const streetId = productInfo.location.streetId;       
            //     // const attrValueNames = productInfo.productAttInfo.attrValueName;
            //     // // 调转到订单填写页面所需参数  yl
            //     // if (attData &&productInfo.isChoseSkku.isChoseSkku.isChoseSkku) {
            //     //     const skku = productInfo.isChoseSkku.isChoseSkku.isChoseSkku;
            //     //     orderInitParams = {
            //     //         "proList": [{
            //     //             "proId": productId,
            //     //             "num": number,
            //     //             'sku': skku,
            //     //             'name': attrValueNames
            //     //         }],
            //     //         "street": streetId
            //     //     }
            //     // } else {
            //     //     orderInitParams = {
            //     //         "proList": [{
            //     //             "proId": productId,
            //     //             "num": number,
            //     //         }],
            //     //         "street": streetId
            //     //     }
            //     // }
            // } else {//来自购物车
            //     // skku = productInfo.skku;
            //     // if (IS_NOTNIL(skku)) {
            //     //     if (skku.endsWith(';')) {
            //     //         skku = skku.substring(0, skku.length - 1);
            //     //     }
            //     // }
            //     // attrValueNames = productInfo.attrValueNames;
            //     // if (IS_NOTNIL(attrValueNames)) {
            //     //     if (attrValueNames.endsWith(';')) {
            //     //         attrValueNames = attrValueNames.substring(0, attrValueNames.length - 1);
            //     //     }
            //     // }
            //     // o2oAttrId = productInfo.o2oAttrId;
            //     // if (IS_NOTNIL(o2oAttrId)) {
            //     //     if (o2oAttrId.endsWith(';')) {
            //     //         o2oAttrId = o2oAttrId.substring(0, o2oAttrId.length - 1);
            //     //     }
            //     // }

            // }
            // productInfo.productId = '14474';
            // productInfo.number = '1';
            try {
                // const { data, success, message } = yield call(
                //     getAppJSON,
                //     `v3/h5/order/pageInfo.json?productIds=${productInfo.productId}&numbers=${productInfo.number}&isBooking=${productInfo.isBooking}&version=1&skku=${skku}&attrValueNames=${attrValueNames}`,
                // );
                // 单品页主接口 yl
                const { data, success, message } = yield call(POST_JSON, (isRefresh ? URL.GETPAGEINFO : URL.CREATORDER), orderInitParams || {});
                yield put(createIdAction('goodsDetail/changeUIState')({ modelId: payload.modelId, showCountType: CountStyleType.None }));
                if (success) {
                    // 更新state树
                    let pageData = {
                        pageInfo: {
                            orderType: data.ot,//订单类型（默认0）0 普通订单。1：定金尾款，3：特权码订单，5：软装订单
                            commodityAmount: data.pam,
                            o2oStore: formatComponentDataToJson(data.ops, (o) => {
                                return {
                                    [`${o.proId}`]: o.osName,
                                }
                            }),
                            canUseGiftCard: data.cl,// 是否可以使用礼品券   o2o两件以上
                            useGiftCard: data.lpq, // 礼品券码
                            sht: data.sht, // 是否显示预计送达时间
                            delivery: data.cd, //预计送达模式0：标准，1：预约 
                            standardDeliveryDate: data.dd + (data.dt || ''), // 送达时间
                            ordersCommitWrapM: {
                                benefitList: data.bl,
                                orderProductList: formatComponentData(data.ops, (o) => {
                                    return {
                                        productId: o.proId,
                                        couponCode: null,
                                        sku: o.sku,
                                        productName: o.proN,
                                        price: o.price,
                                        number: o.num,
                                        attrPic: o.image || '',
                                        productAmount: o.opa, //网单总价=单价*数量-优惠券-满减-立减
                                        orderPromotionAmount: o.pma || 0,  //下单立减金额
                                    }
                                }),
                                // 发票
                                invoiceType: data.inv.it || '', // 发票类型 1：增票2：普票
                                billCompany: data.inv.iti || '', // bc
                                memberInvoices: {
                                    invoiceTitle: data.inv.iti, //发票抬头
                                },
                                order: {
                                    couponCodeValue: data.coAmt, //data.coAmt 平台优惠券金额
                                    couponCode: data.coId,   // 平台优惠券Id
                                    // 收获地址
                                    consignee: data.coN, //收货人姓名
                                    mobile: data.mb,
                                    address: data.addr, // 详细收获地址
                                    regionName: data.rn, //省市区街道名称
                                },
                                payList: formatComponentData(data.pays, (o, i) => ({
                                    paymentName: o.name,
                                    paymentCode: o.code, // online cod
                                }
                                )),
                            },
                            // 各种活动类型
                            // bigActivity: ,
                            // isB2C: ,
                            // isActivity: ,
                            isBooking: data.book,  //是否预定
                            // 价格
                            price: {// 每件商品的小计 信息
                                // productSmallPrice: [],
                                // 使用钻石、积分 数组
                                // newBenefit: [],
                                // 订单总金额
                                commodityAmount: data.pam,
                                // 优惠后的订单总金额
                                newprice: data.oam,
                                // 通用优惠券 使用金额
                                couponCodeValue: 0,
                                // 是否可用优惠券
                                canUsecoupon: false,
                                // 店铺优惠券总金额
                                StoreCouponCodeValue: 0,
                                totalCouponValue: data.tca, //总优惠券金额
                                // 是否使用钻石
                                // diamondStatus: false,
                                // // 是否使用积分
                                // jifenStatus: false,
                                // 下单满减
                                itemShareAmount: data.ipm,
                            },
                        }
                    };
                    yield put(createAction('changePageInfo')(pageData));
                    yield put(createAction('initPrice')({ pageData }));
                    const orderData = yield select(state => state.order);

                    console.log(orderData)
                    yield put(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'CommitOrder', params: { isRefresh } })); //正向购物流
                } else {
                    Toast.info(message);
                }
            } catch (error) {
                Log(error);
            }
        },
        *checkGiftCard({ payload }, { call, put, select }) {
            const { cardCode = '' } = payload;
            alert(cardCode)
            try {
                // const { result, success } = yield call(
                //     postAppJSON,
                //     `v3/h5/sg/order/checkGiftCard.json?amount=${o2oNumber}&cardCode=${cardCode}&customId=${giftCardCustomerId}&number=${o2oNumber}`,
                // );
                const { result, success } = yield POST_JSON(URL.CHECKGIFT, { cardCode: cardCode });
                if (success) {
                    const { failedReason, flag } = result;
                    if (flag === 'N') {
                        Toast.show(failedReason);
                        yield put(createAction('changeGiftCardNumber')({ giftCardNumber: '请输入礼品卡券' }));
                    } else {
                        yield put(createAction('changeGiftCardNumber')({ giftCardNumber: cardCode }));
                    }
                }
            } catch (error) {
                Log(error);
            }
        },
        // 更新页面接口
        *fetchPageInfo({ payload }, { call, put }) {
            const { isRefresh } = payload;
            try {
                // const { data, success } = yield call(
                //     getAppJSON,
                //     `v3/h5/order/pageInfo.json?isFromInvoices=${isFromInvoices}&version=1&attrValueNames=${attrValueNames}&skku=${skku}&o2oAttrId=${o2oAttrId}`,
                // );
                // if (success) {
                // yield put(createAction('changePageInfo')({ pageInfo: data }));
                // yield put(createAction('initPrice')({ oringindata: data }));
                // }
                yield put(createAction('putPageInfo')({ isRefresh }));
            } catch (error) {
                Log(error);
            }
        },
    },
};
