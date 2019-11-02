// import parseTime, formatTime and set to filter
import has from 'has-value'
import { get_system_const } from '@/api/admin'

export { parseTime, formatTime } from '@/utils'
import {
  PayType,
  OrderStatus,
  PayTypeStatus,
  Auths,
  Roles,
  UserType,
  Groups,
  Authents,
  CounterParty,
  KycLevel,
  AdvStatus,
  AdvType,
  AuthType
} from '@/utils/enumeration'
/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */

let systemConst
let loading = false
const getSystemConst = (async function() {
  console.log('aa---------------------------bb')
  if (systemConst) {
    return
  } else if (loading) {
    setTimeout(() => {
      getSystemConst()
    }, 500)
  } else {
    loading = true
    await get_system_const().then(res => {
      console.log(res)
      systemConst = res.data
      loading = false
      return true
    })
    return true
  }
})()

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
export function paymentStatus(num = 0) {
  return num === null ? '-' : PayType[num].label
}

/**
 * PaymentStatus
 * @param {number} num
 */
export function payTypeName(num) {
  return num === null ? '-' : PayType[num].label
}

/**
 * OrderStatus
 * @param {number} num
 */
export function orderStatus(id) {
  if (id === 'null') {
    return '-'
  } else if (has({ foo: { bar: id }}, 'foo.bar')) {
    const data = OrderStatus.filter((item) => { console.log('item', item, id); if (item.id === id) { return item } })
    if (has({ foo: { bar: data }}, 'foo.bar')) {
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
    console.log('hasvalue')
    const data = num.split(',')
    let typeName = ''
    for (var i = 0; i < data.length; i++) {
      typeName = typeName + ' ' + PayType[data[i]].label
      console.log('typeName', typeName, i)
      if (i === data.length - 1) {
        return typeName
      }
    }
  } else {
    console.log('dont has value', num)
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
export function userTypeName(num) {
  return num === null ? '-' : num > 0 ? UserType[num - 1].label : '-'
}

/**
 * GroupName
 * @param {number} num
 */
export async function groupsConstName(id, arr) {
  if (id) {
    const data = arr.filter((item) => { console.log('item', item, id); if (item.id === id) { return item } })
    console.log(' filter data', data)
    if (has({ foo: { bar: data }}, 'foo.bar')) {
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
 * AdvStatus
 * @param {number} num
 */
export function authTypeName(num = null) {
  return num === null ? '-' : AuthType[num].label
}
