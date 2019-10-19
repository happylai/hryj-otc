// import parseTime, formatTime and set to filter
export {
  parseTime,
  formatTime
}
  from '@/utils'
import {
  PayType,
  OrderStatus,
  PayTypeStatus,
  Auths,
  Roles,
  UserType,
  Groups,
  Authents
} from '@/utils/enumeration'
/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * @param {number} timestamp
 */
export function timestampFormat(timestamp) {
  if (timestamp) {
    var time = new Date(timestamp)
    var y = time.getFullYear()
    var M = time.getMonth() + 1
    var d = time.getDate()
    var h = time.getHours()
    var m = time.getMinutes()
    var s = time.getSeconds()
    return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s
  } else {
    return ''
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [{
    value: 1E18,
    symbol: 'E'
  },
  {
    value: 1E15,
    symbol: 'P'
  },
  {
    value: 1E12,
    symbol: 'T'
  },
  {
    value: 1E9,
    symbol: 'G'
  },
  {
    value: 1E6,
    symbol: 'M'
  },
  {
    value: 1E3,
    symbol: 'k'
  }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * PaymentStatus
 * @param {number} num
 */
export function paymentStatus(num) {
  return (
    PayType[num].label
  )
}

/**
 * OrderStatus
 * @param {number} num
 */
export function orderStatus(num) {
  return (
    OrderStatus[num].label
  )
}

/**
 * PayTypeStatus
 * @param {number} num
 */
export function payTypeStatus(num) {
  return (
    PayTypeStatus[num].label
  )
}

/**
 * AuthsName
 * @param {number} num
 */
export function authName(num) {
  return (
    num === null ? '-' : Auths[num].label
  )
}

/**
 * RolesName
 * @param {number} num
 */
export function roleName(num) {
  return (
    num === null ? '-' : Roles[num].label
  )
}

/**
 * userTypeName
 * @param {number} num
 */
export function userTypeName(num) {
  return (
    num === null ? '-' : num > 0 ? UserType[num - 1].label : '-'
  )
}

/**
 * GroupName
 * @param {number} num
 */
export function groupName(num) {
  return (
    num === null ? '-' : Groups[num].label
  )
}

/**
 * Authents
 * @param {number} num
 */
export function authentName(num) {
  return (
    num === null ? '-' : Authents[num].label
  )
}
