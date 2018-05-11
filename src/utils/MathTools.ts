// js乘法
export function accMul(a: string | number, b: string) {
    let c: number = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split('.')[1].length;
    } catch (f) {
        Log('====================================');
        Log();
        Log('====================================');
    }
    try {
        c += e.split('.')[1].length;
    } catch (f) {
        Log('====================================');
        Log();
        Log('====================================');
    }
    return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c);
}
// js减法
export function accSub(arg1, arg2) {
    let r1, r2, m, n;
    try {
        r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
/*
  ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export function accAdd(arg1, arg2) {
    let r1, r2, m, c;
    try {
        r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        const cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace('.', ''));
            arg2 = Number(arg2.toString().replace('.', '')) * cm;
        } else {
            arg1 = Number(arg1.toString().replace('.', '')) * cm;
            arg2 = Number(arg2.toString().replace('.', ''));
        }
    } else {
        arg1 = Number(arg1.toString().replace('.', ''));
        arg2 = Number(arg2.toString().replace('.', ''));
    }
    return (arg1 + arg2) / m;
}
/* ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 */
// export function accDiv(arg1, arg2) {
//     let t1 = 0, t2 = 0, r1, r2;
//     try {
//         t1 = arg1.toString().split('.')[1].length;
//     } catch (e) {
//         Log('====================================');
//         Log();
//         Log('====================================');
//     }
//     try {
//         t2 = arg2.toString().split('.')[1].length;
//     } catch (e) {
//         Log('====================================');
//         Log();
//         Log('====================================');
//     // tslint:disable-next-line:align
//     } with (Math) {
//         r1 = Number(arg1.toString().replace('.', ''));
//         r2 = Number(arg2.toString().replace('.', ''));
//         return (r1 / r2) * pow(10, t2 - t1);
//     }
// }

export function toFloat(mnumber = 0) {
    let mstr = mnumber.toString();
    if (!mstr.includes('.')) {
        mstr = `${mstr}.00`;
    }
    return mstr;
}
export function keepInt(value) {
    if (value) {
        const pointIndex = value.toFixed(2).toString().indexOf('.');
        return value.toFixed(2).toString().slice(0, pointIndex);
    } else {
        return 0;
    }
}
export function keepFloat(value) {
    if (value) {
        const pointIndex = value.toFixed(2).toString().indexOf('.');
        return value.toFixed(2).toString().slice(pointIndex);
    } else {
        return '.00';
    }
}
