// import parseTime, formatTime and set to filter
import has from 'has-value'
export { parseTime, formatTime } from '@/utils'
import {
  PayType,
  PayTypeExtent,
  PayTypeUstd,
  OrderStatus,
  PayTypeStatus,
  Auths,
  Roles,
  UserTypeName,
  Authents,
  CounterParty,
  KycLevel,
  AdvStatus,
  AdvType,
  AuthType,
  OrderAuditStatus,
  AppealeType,
  PriceTread,
  LogsModels,
  LogsTypes,
  SystemMessageTypes,
  SystemMessageStatus,
  WithdrawStatus,
  PayChannel
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
 * @param {number} timesArray
 */
export function timesArrayFormat(timesArray) {
  if (timesArray) {
    return `${timesArray.slice(0, 3).join('-')} ${timesArray.slice(3, 6).join(':')}`
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
  const si = [
    {
      value: 1e18,
      symbol: 'E'
    },
    {
      value: 1e15,
      symbol: 'P'
    },
    {
      value: 1e12,
      symbol: 'T'
    },
    {
      value: 1e9,
      symbol: 'G'
    },
    {
      value: 1e6,
      symbol: 'M'
    },
    {
      value: 1e3,
      symbol: 'k'
    }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value + 0.1)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
      )
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
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
export function paymentStatus(id = '') {
  let res = '-'
  if (has({ foo: id }, 'foo')) {
    const data = PayType.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      res = data[0].label
    }
  }
  return res
}

// /**
//  * PaymentStatus
//  * @param {number} num
//  */
// export function payTypeName(num) {
//   return num === null ? '-' : PayType[num].label
// }

/**
 * OrderStatusTagName
 * @param {number} num
 */
export function payTypeName(id) {
  let res = '-'
  if (has({ foo: id }, 'foo')) {
    const data = PayTypeExtent.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      res = data[0].label
    }
  }
  return res
}

/**
 * PriceTreadName
 * @param {number} num
 */
export function PriceTreadName(id) {
  let res = '-'
  if (has({ foo: id }, 'foo')) {
    const data = PriceTread.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      res = data[0].label
    }
  }
  return res
}

/**
 * OrderStatusTagName
 * @param {number} num
 */
export function payTypeUstdName(id) {
  if (id === 'null') {
    return '-'
  } else if (has({ foo: id }, 'foo')) {
    const data = PayTypeUstd.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      return data[0].label
    } else {
      return '-'
    }
  } else {
    return '-'
  }
}

/**
 * OrderStatusTagName
 * @param {number} num
 */
export function orderStatusTagName(id) {
  if (id === 'null') {
    return '-'
  } else if (has({ foo: id }, 'foo')) {
    const data = OrderStatus.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      return data[0].tagType
    } else {
      return '-'
    }
  } else {
    return '-'
  }
}

/**
 * OrderStatus
 * @param {number} num
 */
export function orderStatus(id) {
  if (id === 'null') {
    return '-'
  } else if (has({ foo: id }, 'foo')) {
    const data = OrderStatus.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      return data[0].label
    } else {
      return '-'
    }
  } else {
    return '-'
  }
}

/**
 * PayTypeStatus
 * @param {number} num
 */
export function payTypeStatus(num) {
  return num === null ? '-' : PayTypeStatus[num].label
}

/**
 * PayTypeStatus
 * @param {number} num
 */
export function payTypeNames(num) {
  if (has({ foo: num }, 'foo') && num !== null) {
    const data = num.split(',')
    let typeName = ''
    for (var i = 0; i < data.length; i++) {
      typeName = typeName + ' ' + PayType[data[i]].label
      if (i === data.length - 1) {
        return typeName
      }
    }
  } else {
    return '-'
  }
}

/**
 * AuthsName
 * @param {number} num
 */
export function authName(num) {
  return num === null ? '-' : Auths[num].label
}

/**
 * RolesName
 * @param {number} num
 */
export function roleName(num) {
  return num === null ? '-' : Roles[num].label
}

/**
 * userTypeName
 * @param {number} num
 */
export function userTypeName(id) {
  if (id === 'null') {
    return '-'
  } else if (has({ foo: id }, 'foo')) {
    return UserTypeName[id].label
  } else {
    return '-'
  }
}

/**
 * GroupName
 * @param {number} num
 */
export async function groupsConstName(id, arr) {
  if (id) {
    const data = arr.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      return data[0].groupName
    } else {
      return '-'
    }
  } else {
    return '-'
  }
}

/**
 * Authents
 * @param {number} num
 */
export function authentName(num) {
  return num === null ? '-' : Authents[num].label
}

/**
 * CounterParty
 * @param {number} num
 */
export function counterParty(num = null) {
  return num === null ? '-' : CounterParty[num].label
}

/**
 * CounterParty
 * @param {number} num
 */
export function kycLevel(num = null) {
  return num === null ? '-' : KycLevel[num].label
}

/**
 * AdvType
 * @param {number} num
 */
export function advType(num = null) {
  return num === null ? '-' : AdvType[num].label
}

/**
 * AdvStatus
 * @param {number} num
 */
export function advStatus(num = null) {
  return num === null ? '-' : AdvStatus[num].label
}

/**
 * AdvStatusTagName
 * @param {number} num
 */
export function advStatusTagName(id = null) {
  if (id === 'null') {
    return '-'
  } else if (has({ foo: id }, 'foo')) {
    const data = AdvStatus.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      return data[0].tagType
    } else {
      return '-'
    }
  } else {
    return '-'
  }
  // return num === null ? '-' : AdvStatus[num].tagType
}

/**
 * AdvStatus
 * @param {number} num
 */
export function authTypeName(id = null) {
  // return num === null ? '-' : AuthType[num].label
  if (id === 'null') {
    return '-'
  } else if (has({ foo: id }, 'foo')) {
    const data = AuthType.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      return data[0].label
    } else {
      return '-'
    }
  } else {
    return '-'
  }
}

/**
 * OrderAuditStatus
 * @param {number} num
 */
export function OrderAuditStatusName(id) {
  if (id === 'null') {
    return '-'
  } else if (has({ foo: id }, 'foo')) {
    const data = OrderAuditStatus.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      return data[0].label
    } else {
      return '-'
    }
  } else {
    return '-'
  }
}

/**
 * AppealeType
 * @param {number} num
 */
export function appealeType(id) {
  if (id === 'null') {
    return '-'
  } else if (has({ foo: id }, 'foo')) {
    const data = AppealeType.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      return data[0].label
    } else {
      return '-'
    }
  } else {
    return '-'
  }
}

export function LogsModelsName(id) {
  let res = '-'
  if (has({ foo: id }, 'foo')) {
    const data = LogsModels.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      res = data[0].label
    }
  }
  return res
}

export function LogsTypesName(id) {
  let res = '-'
  if (has({ foo: id }, 'foo')) {
    const data = LogsTypes.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      res = data[0].label
    }
  }
  return res
}

export function SystemMessageTypeName(id) {
  let res = '-'
  if (has({ foo: id }, 'foo')) {
    const data = SystemMessageTypes.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      res = data[0].label
    }
  }
  return res
}

export function SystemMessageStatuName(id) {
  let res = '-'
  if (has({ foo: id }, 'foo')) {
    const data = SystemMessageStatus.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: data }, 'foo')) {
      res = data[0].label
    }
  }
  return res
}

export function WithdrawStatusName(id) {
  let temp = '-'
  if (has({ foo: { bar: id }}, 'foo.bar')) {
    const data = WithdrawStatus.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: { bar: data }}, 'foo.bar')) {
      temp = data[0].label
    }
  }
  return temp
}

export function PayChannelName(id) {
  let temp = '-'
  if (has({ foo: { bar: id }}, 'foo.bar')) {
    const data = PayChannel.filter((item) => { if (item.id === id) { return item } })
    if (has({ foo: { bar: data }}, 'foo.bar')) {
      temp = data[0].label
    }
  }
  return temp
}
