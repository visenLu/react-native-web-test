import { NavigationScreenProp } from 'react-navigation';

export interface IGuideProps {
  showAdType: ShowAdType;
  doLoading: boolean;
}

export interface Iuser {
  name: string;
  changeUserName?: (name: string) => {
    type: string;
    name: string;
  };
}
export interface Iusers {
  mobile: string;
  rankName: string;
  cartNumber: string;
  sessionKey: string;
  userId: string;
  token: string;
  userName: string;
  mid: string;
  avatarImageFileId: string;
  nickName: string;
  gender: string;
  email: string;
  birthday: string;
  sessionValue: string;
  loginName: string;
  ucId: string;
  accessToken: string;
  userToken: string;
  isHost: number;
}

// 首页广告页显示状态
export enum ShowAdType { None, Video, Guide, Image }

export enum CountStyleType { None, Show, AddCart, BuyNow }

// 单品页底部购买按钮状态
export enum GoodsBuyType { Buy, Rush, Book, StockNoti, RushNoti, Date, RushNow }

export interface ICustomContain {
  dispatch?: (func: any) => {};
  navigation?: NavigationScreenProp;
}
export interface IProvince {
  value: string|number;
  text: string;
  grade?: string;
  children?: IProvince[];
}
export interface INavigation {
  navigation: NavigationScreenProp;
}
export interface IBannerItem {
  id: number;
  pic: string;
  group: number;
  groupNmae: number;
  position: number;
  link: string|undefined;
  linkType: number;
  relationId: number;
  title: string;
  titleDecription: string;
  memberId: number|null;
  avatar: string|null;
  storeName: string|null;
  url: string;
  parentId: number;
  bannerId: number;
  imageUrl: string;
}

// 单品
export interface IGoods {
  product: IProduct;
  activityNowTime: number;
  activityEndTime: number;
  swiperImgs: string[];
  swiperVideo: { video: string; img: string };
  pcrName: string;
  isCollected: number;
  isB2C: boolean;
  isActivityProduct: boolean;
  o2oType: number;
  productActivityDeposit: boolean;
}

// 单品 产品
export interface IProduct {
  productFullName: string;
  productTitle: string;
  productActivityInfo: string;
  pcrName: string;
  pcPrice: number|string;
  activityNowTime: number;
  vrUrl: string;
  activityStartTime: number;
  activityEndTime: number;
  brandId: string;
  productCateId: string;
  sku: string;
  defaultImageUrl: string;
  bookable: boolean;
}

// 优惠
export interface IPreferential {
  hasStock: boolean;
  finalPrice: number; // 最终接口
  commission: number; // 赚的佣金
  actualPrice: number; // 预付款
  originalPrice: number; // 原价
  isActivityProduct: boolean;
  productActivityDeposit: boolean;
  isFlashsales: boolean; // 有结束倒计时
  isAcReserve: boolean; // 有开始时间
  expectTime: string; // 预计到达
  flashsalesEndTime: number; // 活动结束时间
  acReserveEndTime: number; // 活动开始时间
  stockNum: number; // 库存
  freeOrder: boolean; // 免单
  isSupportCOD: boolean; // 货到付款
  halfDay: boolean; // 半日达
  bigActivity: boolean;
  oneDay: boolean; // 单日到达
  isPackage: boolean;
  acReserveType: number;
  giftInfo: string; // 商家备注
  acReserveNum; // 预约人数
  acPurchaseNum; // 抢购人数
  activityEndTime: number; // 标记是否有活动和显示活动信息
}

// 商品评价
export interface IEvaluateProps {
  serviceCommentReplies?: Array<{ replyContent: string; createTime: number }>;
  storeCommentReplies?: Array<{ replyContent: string; createTime: number; }>;
  commentContent?: string;
  memberName?: string;
  memberPic?: string;
  createTime?: number;
  commentPics?: Array<{ picUrl: string }>;

  experienceContent?: string;
  experienceTime?: number;
  experiencePics?: Array<{ picUrl: string }>;

  userCommentContent?: string;
  userCommentCreateTime?: number;
  userCommentPics?: Array<{ picUrl: string }>;
}

// 单品页评价综述
export interface IEvaluateCount {
  commentTotal?: number;
  positiveRate?: number;
  totalNum?: number;
}

// 评价页综述
export interface IEvaluateAbstract {
  hasPicNum?: number;
  negativeNum?: number;
  neutralNum?: number;
  positiveNum?: number;
  // productId?: number;
  totalNum?: number;
}

// 发票
export interface IReceipt {
  invoiceType?: number; // 1增值税，2普通
  invoiceTitle?: string;
  taxPayerNumber?: string;
  registerAddress?: string;
  registerPhone?: string;
  bankName?: string;
  bankCardNumber?: string;
  receiptMobile?: string;
  receiptConsignee?: string;
  receiptAddress?: string;
  receiptZipcode?: string;
}

// O2O店铺信息
export interface IO2OStore {
  O2OStoreName?: string;
  avatarImageFileId?: string;
  serviceGrade?: number;
  productGrade?: number;
  o2oStoreId?: string;
  logisticalGrade?: number;
  storeCode?: string;
  mobile?: string;
}

// 商品属性
export interface IGoodsAttribute {
  attrCode: string;
  attrName: string;
  attrValueCode: string;
  attrValueName: string;
  id: string;
  orders: number;
  productId: string;
  remark: string;
  sku: string;
  storeId: string;
}

// 自定义存储的单品信息
export interface IProductInfo {
  attrValueNames?: object;
  location?: any;
  productDefaultIcon?: string;
  number?: number;
  productAttInfo?: any;
}

// 优惠券
export interface ICoupon {
  id: string;
  couponValue: string;
  displayType: number;
  platformCoupon: number;
  minAmountDoc: string;
  limitProductDoc: string;
  timeDoc: string;
}

// 优惠券-领取中心
export interface ICouponCenterItem {
  id: string;
  memberCouponId: string;
  couponPromotionId: string;
  couponValue: string;
  startTime: string;
  endTime: string;
  minAmount: string;
  couponType: number;
  CouponType: string;
  percent: number;
  displayType: string;
  activityStartTime: number;
  nowTime: number;
  reMinderNum: number;
  platformCoupon: string;
  minAmountDoc: string;
  productIds: string;
  excludeProductIds: string;
  productBrandId: string;
  productCateId: string;
  couponCateIds: string;
}
