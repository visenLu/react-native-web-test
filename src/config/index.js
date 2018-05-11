/*
* 颜色
* */
const tBlue = "#2979FF"; // 主题蓝  需强调相对次要的按钮或是特殊页面
const tOrange = "#FF6026"; // 主题橙 小面积使用，用于特别需要强调和突出的文字、按钮  或特殊模块使用，例如：社区
const Font3 = "#333"; // 文字 #333 用于重要级文字信息、标题、正文等
const Font6 = "#666"; // 文字 #666  用于次要级内容、列表文字
const Font9 = "#999"; // 文字 #999  辅助次要文字、普通图标
const FontB8 = "#B8B8B8"; // 文字 #B8B8B8 需要弱化的文字
const SipE4 = "#E4E4E4"; // 深色背景上的分割线
const SipEEE = "#EEE"; // 浅色背景上的分割线 和  页面空白区域底色


/*
* 服务器接口
* */
const DEV = "DEV"; // 测试
const APP = "APP"; // 线上
let API_HOST, API_DETAIL_HOST, API_SEARCH_HOST, SERVER_DATA_HOST, PAY_SERVER_HOST, API_NEWHOME_HOST;

/*******------设置发布状态------**********/

const SET_ENV = 'DEV';

/*******------设置发布状态------**********/

if(SET_ENV === DEV){
    API_HOST=`http://mobiletest.ehaier.com:38080`;
    API_DETAIL_HOST=`http://detailtest.ehaier.com:38080`;
    API_SEARCH_HOST=`http://stest.ehaier.com:38080`;
    API_NEWHOME_HOST=`http://mobiletest.ehaier.com:38081`;
    SERVER_DATA_HOST=`http://mobiletest.ehaier.com:38080/v3`;
    PAY_SERVER_HOST=`http://mobiletest.ehaier.com:58093`;
} else {
    API_HOST=`http://m.ehaier.com`;
    API_DETAIL_HOST=`http://detail.ehaier.com`;
    API_SEARCH_HOST=`http://s.ehaier.com`;
    API_NEWHOME_HOST=`http://mobiletest.ehaier.com:38081`;
    SERVER_DATA_HOST=`http://m.ehaier.com/v3`;
    PAY_SERVER_HOST=`http://pay.ehaier.com`;
}


/*******------设置某些第三个SDK的key------**********/



/*******------设置某些第三个SDK的key------**********/


export default config = {
    Color: {tBlue,tOrange,Font3,Font6,Font9,FontB8,SipE4,SipEEE},
    API_HOST,
    API_DETAIL_HOST,
    API_SEARCH_HOST,
    SERVER_DATA_HOST,
    PAY_SERVER_HOST,
    API_NEWHOME_HOST,
};

// 获取生活服务模块的环境
export const getEnviroment = ()=>{
    return SET_ENV === DEV?0:1; // 正式环境返回 1 ，其他环境返回0
};