export default {
  namespace: 'address',
  state: {
          provinceId: 16,
          cityId: 173,
          areaId: 2450,
          streetId: 12036596,
          provinceName: '山东',
          longitude: 36.1146544721,
          latitude: 120.4633782991,
          cityName:  '青岛',
          areaName:  '崂山区',
          streetName: '中韩街道',
          regionName: '崂山区/中韩街道',
        },
        // state: {
        //   provinceId: 2,
        //   cityId: 716,
        //   areaId: 938,
        //   streetId: 12024675,
        //   provinceName: '北京',
        //   cityName:  '北京',
        //   areaName:  '朝阳区',
        //   streetName: '中韩街道',
        //   regionName: '崂山区/中韩街道',
        // },
  reducers: {
    changeAddress(state, { payload }) {
      const address = Object.assign({}, payload);
      const { provinceName, cityName} = payload;
      if (provinceName.endsWith('市')) {
        address.provinceName = provinceName.substring(0, provinceName.length - 1);
      }
      if (cityName.length === 0) {
        address.cityName = address.provinceName;
      }
      return { ...state, ...address };
    },
  },
};
