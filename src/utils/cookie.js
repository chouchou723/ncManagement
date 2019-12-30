import Cookies from 'js-cookie'

// export function getToKen() {
//   return Cookies.get('adminToken')
// }

// export function setToKen(value) {
//   let t;
//   if (value === 'admin') {
//     t = 2
//   } else if (value === '') {
//     t = 0
//   } else {
//     t = 1
//   }
//   Cookies.set('adminToken', t)
// }

export function removeToKen() {
//   Cookies.remove('adminToken');
  sessionStorage.clear();
}
