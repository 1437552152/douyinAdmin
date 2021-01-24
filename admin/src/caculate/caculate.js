/**
 * 格式化时间
 * date Thu Mar 01 2018 00:00:00 GMT+0800 (中国标准时间)
 * 
 */
// export const formatDate = (date, delimiter = '-') => {

//         if (!!date || (!!date.length)) {
//             let year = date.getFullYear();
//             let month = date.getMonth() + 1;
//             let day = date.getDate();
//             let hours = date.getHours();
//             let min = date.getMinutes();
//             let sec = date.getSeconds();
//             let timeArr = [year, month, day, hours, min, sec];
//             let formateTimeArr = [];
//             let timeStr = '';

//             timeArr.forEach((item, index) => {
//                 if (item * 1 < 10) item = '0' + item;
//                 if (index === 2) timeStr += (item + ' ');
//                 else if (index === 5) timeStr += (item + '');
//                 else if (index === 3 || index === 4) timeStr += (item + ':');
//                 else timeStr += (item + delimiter);
//             })
//             return timeStr;
//         }

//     }
/**
 * 过滤搜索条件
 */
export const filterSearch = searchID => {
    if (!searchID || (!String(searchID).length)) {
        return false;
    } else {

        if (isNaN(searchID * 1) || searchID * 1 < 0 ||
            (searchID.toString().split('.')[1] !== undefined)) {

            return false;

        } else {
            return true;
        }
    }
}