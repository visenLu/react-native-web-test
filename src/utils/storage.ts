import { 
  AsyncStorage, 
} from 'react-native';

// 第三方框架
import Storage from 'react-native-storage';

var storage = new Storage({
// 最大容量，默认值1000条数据循环存储
size: 1000,

// 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
// 如果不指定则数据只会保存在内存中，重启后即丢失
storageBackend: AsyncStorage,
  
// 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
defaultExpires: null,
  
// 读写时在内存中缓存数据。默认启用。
enableCache: true,
  
// 如果storage中没有相应数据，或数据已过期，
// 则会调用相应的sync方法，无缝返回最新数据。
// sync方法的具体说明会在后文提到
// 你可以在构造函数这里就写好sync的方法
// 或是写到另一个文件里，这里require引入
// 或是在任何时候，直接对storage.sync进行赋值修改
sync: {}
});

const setItem = async (keys, value) => {
  await storage.save({
    key:keys,    // 注意:请不要在key中使用_下划线符号!
    data:value,
    // 设为null,则不过期,这里会覆盖初始化的时效
    expires: null
});
};
const getItem = async (keys) => {
  try {
    const value = await storage.load({
      key: keys,
    });
    return value;
  } catch (error) {
    Log(error);
    return null;
  }
};
const removeItem = (keys) => {
  storage.remove({
    key: keys
});
};
// !!!!使用 setItem和getItem 的时候 必须包含在一个 async 函数里面。!!!
global.getItem = getItem;
global.setItem = setItem;
global.removeItem = removeItem;
export default storage;