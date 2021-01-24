 function formaDate (date, fmt) {
    //返回固定的年份
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      };
      //定义时间正则对象
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      };
      //遍历 正则替换
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1 === 1) ? str : padLeftZero(str));
        }
      }
      return fmt;
    }
    //补0函数
    function padLeftZero(str) {
      return ('00'+str).substr(str.length)
    };
    exports.formaDate=formaDate