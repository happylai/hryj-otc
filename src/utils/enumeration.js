export const PayType = [{
  name: 'ALI_PAY',
  id: 0,
  label: '支付宝'
},
{
  name: 'WEI_XIN',
  id: 1,
  label: '微信支付'
},
{
  nama: 'BANK',
  id: 2,
  label: '银行卡'
},
{
  name: 'CLOUD_PAY',
  id: 3,
  label: '云闪付'
}
]

export const PayChannel = [{
  name: 'ALI_PAY',
  id: 0,
  label: '支付宝'
},
{
  name: 'WEI_XIN',
  id: 1,
  label: '微信支付'
},
{
  nama: 'BANK',
  id: 2,
  label: '银行卡'
},
{
  name: 'CLOUD_PAY',
  id: 3,
  label: '云闪付'
},
{
  name: 'CLOUD_PAY',
  id: 4,
  label: 'USDT提现'
},
{
  name: 'CASHIER_DESK',
  id: 88,
  label: '收银台'
}
]

export const PaySchema = [{
  name: 'ALI_QR_CODE',
  id: 0,
  parentId: 0,
  label: '支付宝扫码'
},
{
  name: 'WX_QR_CODE',
  id: 1,
  parentId: 1,
  label: '微信扫码'
},
{
  nama: 'BANK_SCAN_NUM',
  id: 2,
  parentId: 2,
  label: '银行卡'
},
{
  name: 'CLOUD_QR_CODE',
  id: 3,
  parentId: 3,
  label: '云闪付'
},
{
  name: 'USDT',
  id: 4,
  parentId: 4,
  label: 'USDT提现'
},

{
  name: 'DESK_ALI',
  id: 880,
  parentId: 88,
  label: '支付宝收银台'
},
{
  name: 'DESK_WX',
  id: 881,
  parentId: 88,
  label: '微信收银台'
}, {
  name: 'DESK_BANK',
  id: 882,
  parentId: 88,
  label: '银行卡收银台'
},
{
  name: 'DESK_CLOUD',
  id: 883,
  parentId: 88,
  label: '云闪付收银台'
}

]

export const PayTypeExtent = [{
  name: 'ALI_PAY',
  id: 0,
  label: '支付宝'
},
{
  name: 'WEI_XIN',
  id: 1,
  label: '微信支付'
},
{
  nama: 'BANK',
  id: 2,
  label: '银行卡'
},
{
  name: 'CLOUD_PAY',
  id: 3,
  label: '云闪付'
},
{
  name: 'HB',
  id: 10,
  label: '火币'
},
{
  name: 'BA',
  id: 11,
  label: '币安'
},
{
  name: 'OK',
  id: 12,
  label: 'OKEx'
}
]

export const PayTypeUstd = [{
  name: 'ALI_PAY',
  id: 0,
  label: '支付宝'
},
{
  name: 'WEI_XIN',
  id: 1,
  label: '微信支付'
},
{
  nama: 'BANK',
  id: 2,
  label: '银行卡'
},
{
  name: 'CLOUD_PAY',
  id: 3,
  label: '云闪付'
},
{
  name: 'USDT',
  id: 4,
  label: 'USDT'
}

]

export const OrderStatus = [{
  name: 'UN_PAYED',
  id: 0,
  label: '待支付',
  tagType: 'warning'
},
{
  name: 'PAY_CONFIRMED',
  id: 1,
  label: '确认已付款',
  tagType: ''

},
{
  name: 'CANCELED',
  id: 2,
  label: '取消',
  tagType: 'info'

},
{
  name: 'PAY_RECEIVED',
  id: 4,
  label: '确认已收款',
  tagType: ''

},
{
  name: 'COMPLETED',
  id: 5,
  label: '完成',
  tagType: 'success'
},
{
  name: 'APPEALING',
  id: 6,
  label: '申诉',
  tagType: 'danger'
},
{
  name: 'PAY_TIMEOUT',
  id: 7,
  label: '支付超时',
  tagType: 'danger'

},
{
  name: 'RECEIVED_TIMEOUT',
  id: 8,
  label: '收款超时',
  tagType: 'danger'
},
{
  name: 'AUDITING',
  id: 9,
  label: '审核中',
  tagType: 'INFO'
}
]

export const PayTypeStatus = [{
  id: 0,
  label: '等待审核'
},
{
  id: 1,
  label: '审核成功'
},
{
  id: 2,
  label: '审核失败'
}
]

export const Auths = [{
  id: 0,
  label: '权限0'
},
{
  id: 1,
  label: '权限1'
},
{
  id: 2,
  label: '权限2'
}
]

export const Roles = [{
  id: 0,
  label: '角色0'
},
{
  id: 1,
  label: '角色1'
},
{
  id: 2,
  label: '角色2'
}
]

export const PriceTread = [{
  id: 0,
  label: 'To C'
},
{
  id: 1,
  label: 'To B'
}
]

export const UserType = [
  //   {
  //   id: 0,
  //   name: 'visitor',
  //   label: '游客'
  // },
  {
    id: 1,
    name: 'general',
    label: '普通'
  },
  {
    id: 2,
    name: 'super',
    label: '超级'
  },
  {
    id: 3,
    name: 'huge',
    label: '大宗'
  },
  {
    id: 4,
    name: 'extreme',
    label: '至尊'
  }
]

export const UserTypeName = [
  {
    id: 0,
    name: 'visitor',
    label: '游客'
  },
  {
    id: 1,
    name: 'general',
    label: '普通'
  },
  {
    id: 2,
    name: 'super',
    label: '超级'
  },
  {
    id: 3,
    name: 'huge',
    label: '大宗'
  },
  {
    id: 4,
    name: 'extreme',
    label: '至尊'
  }
]

export const TimeParamsType = [{
  id: 0,
  label: ''
},
{
  id: 1,
  name: 'DEPOSIT',
  label: '取消'
},
{
  id: 2,
  name: 'ACTIVE_GOLD',
  label: '活跃黄金'
},
{
  id: 3,
  name: 'CANCEL_ORDER_NUM',
  label: '取消订单数量'
},
{
  id: 4,
  name: 'BUYER_PAY_TIMEOUT',
  label: '买家付款超时'
},
{
  id: 5,
  name: 'SELLER_CONFIRM_TIMEOUT',
  label: '卖家确认超时'
},
{
  id: 6,
  name: 'AUTO_APPEAL_TIME',
  label: '自动申诉时间'
},
{
  id: 7,
  name: 'AUTO_UNFREEZE_TIME',
  label: '自动解冻时间'
},
{
  id: 8,
  name: ' AUTO_ORDER_TIME',
  label: '自动接单时间'
}
]

export const Authents = [{
  id: 0,
  name: 'AUTHING',
  label: 'KYC认证'
},
{
  id: 1,
  name: 'ID_CARD',
  label: '支付认证'
}
]

export const Groups = [{
  id: 0,
  name: 'AUTHING',
  label: '分组0'
},
{
  id: 1,
  name: 'ID_CARD',
  label: '分组1'
},
{
  id: 2,
  name: 'ID_CARD',
  label: '分组2'
}, {
  id: 3,
  name: 'ID_CARD',
  label: '分组3'
}, {
  id: 4,
  name: 'ID_CARD',
  label: '分组4'
}
]

export const TokenType = [{
  id: 0,
  name: 'PQC',
  label: 'PQC'
},
{
  id: 1,
  name: 'PGQ',
  label: 'PGQ'
},
{
  id: 2,
  name: 'BTC',
  label: 'BTC'
},
{
  id: 3,
  name: 'ETH',
  label: 'ETH'
},
{
  id: 4,
  name: 'EOS',
  label: 'EOS'
},
{
  id: 5,
  name: 'LTC',
  label: 'LTC'
}
]

export const emptySelect = {
  id: '',
  name: undefined,
  label: '请选择'
}

export const CounterParty = [{
  id: 0,
  name: 'AUTHING',
  label: '买家'
},
{
  id: 1,
  name: 'ID_CARD',
  label: '卖家'
}

]

export const KycLevel = [{
  id: 0,
  name: 'UN_CERTIFIED',
  label: '认证中'
},
{
  id: 1,
  name: 'Image_CERTIFIED',
  label: 'KYC照片认证'
},
{
  id: 2,
  name: 'VIDEO_CERTIFIED',
  label: 'KYC视频认证'
}

]

export const AccountStatus = [{
  id: 0,
  name: 'true',
  label: '正常'
},
{
  id: 1,
  name: 'false',
  label: '冻结'
}
]

export const AdvStatus = [{
  id: 0,
  name: 'true',
  label: '下架',
  tagType: 'danger'
},
{
  id: 1,
  name: 'false',
  label: '上架',
  tagType: 'success'

},
{
  id: 2,
  name: 'false',
  label: '关闭',
  tagType: 'info'

}
]

export const AdvType = [{
  id: 0,
  name: 'true',
  label: '买入'
},
{
  id: 1,
  name: 'false',
  label: '卖出'
}
]

export const DealType = [{
  id: 0,
  name: 'BUY',
  label: '买家'
},
{
  id: 1,
  name: 'SELL ',
  label: '卖家'
}
]

export const FiatType = [{
  id: 0,
  label: 'CNY'
},
{
  id: 1,
  label: 'USDT'
}
]

export const AuthType = [{
  id: 0,
  label: '未认证'
},
{
  id: 1,
  label: '支付认证'
}, {
  id: 2,
  label: '身份认证'
}
]

export const OrderAuditStatus = [
  {
    id: 0,
    label: '待审核'
  },
  {
    id: 1,
    label: '审核通过'
  },
  {
    id: 2,
    label: '驳回'
  },
  {
    id: 3,
    label: '订单已取消'
  }
]

export const PaymentStatus = [
  {
    id: 0,
    label: '待审核'
  },
  {
    id: 1,
    label: '正常'
  },
  {
    id: 2,
    label: '驳回'
  },
  {
    id: 3,
    label: '冻结'
  },
  {
    id: 4,
    label: '删除'
  }
]

export const AppealeStatus = [
  {
    id: 0,
    label: '待处理'
  },
  {
    id: 1,
    label: '订单已完结'
  },
  {
    id: 2,
    label: '订单已取消'
  },
  {
    id: 3,
    label: '申述被驳回'
  }
]

export const AppealeResult = [
  {
    id: true,
    label: '申诉方胜 '
  },
  {
    id: false,
    label: '申诉方败'
  }
]

export const AppealeType = [
  {
    id: 0,
    label: '买家未付款 '
  },
  {
    id: 1,
    label: '对方欺诈'
  },
  {
    id: 2,
    label: '卖家未确认收款 '
  },
  {
    id: 3,
    label: '其他'
  }
]

export const LogsModels = [
  {
    id: 0,
    label: '订单中心 '
  },
  {
    id: 1,
    label: '广告管理'
  },
  {
    id: 2,
    label: '用户管理 '
  },
  {
    id: 3,
    label: '参数管理'
  },
  {
    id: 4,
    label: '后台管理 '
  },
  {
    id: 5,
    label: '留言板'
  }
]

export const LogsTypes = [
  {
    id: 0,
    label: '保存数据 '
  },
  {
    id: 1,
    label: '删除数据'
  },
  {
    id: 2,
    label: '审核数据 '
  },
  {
    id: 3,
    label: '冻结账号'
  },
  {
    id: 4,
    label: '其他操作 '
  }
]

export const SystemMessageTypes = [
  {
    id: 0,
    name: 'app',
    label: 'App '
  },
  {
    id: 1,
    name: 'merchant',
    label: 'B端后台'
  },

  {
    id: 2,
    name: 'web',
    label: 'Web后台'
  }
]

export const SystemMessageStatus = [
  {
    id: 0,
    value: false,
    label: '已下架'
  },
  {
    id: 1,
    value: true,
    label: '已上架'
  }
]
export const WithdrawStatus = [
  {
    id: 0,
    name: 'MATCHING',
    label: '匹配中'
  },
  {
    id: 1,
    name: 'WAIT_PAY',
    label: '等待支付'
  },
  {
    id: 2,
    name: 'PAY_CONFIRMED',
    label: '确认已付款'
  },
  {
    id: 3,
    name: 'COMPLETED',
    label: '已经完成'
  },
  {
    id: 4,
    name: 'CANCELED',
    label: '已经关闭'
  }
]
export const AwardType = [
  {
    id: 7,
    name: 'DEAL_SUBSIDY',
    label: '交易补贴'
  }, {
    id: 8,
    name: 'NIGHT_SUBSIDY',
    label: '夜间补贴'
  }, {
    id: 9,
    name: 'AMOUNT_SUBSIDY',
    label: '达量补贴'
  }, {
    id: 10,
    name: 'SHARE_SUBSIDY',
    label: '邀请奖励'
  }, {
    id: 13,
    name: 'AGENT_SUBSIDY',
    label: '代理商补贴'
  }, {
    id: 15,
    name: 'JUNIOR_DEAL_SUBSIDY',
    label: '下级交易贡献'
  }, {
    id: 18,
    name: 'RELEASE_REWARD',
    label: '放行奖励'
  }
]

export const OperatingSystem = [
  {
    id: 0,
    name: 'Android',
    label: '安卓系统'
  },
  {
    id: 1,
    name: 'Apple',
    label: '苹果系统'
  }
]

export const MatchStatus = [
  {
    id: 0,
    label: '正常'
  },
  {
    id: 1,
    label: '异常'
  },
  {
    id: 2,
    label: '冻结'
  }
]

export const billType = [
  {
    id: 1,
    name: 'BUY_IN',
    label: '入金'
  },
  {
    id: 2,
    name: 'SELL_OUT',
    label: '出金 '
  },
  {
    id: 3,
    name: 'DEALERS_APPLY',
    label: '普通商家申请'
  },
  {
    id: 4,
    name: 'TRUST_APPLY',
    label: '信任商家申请'
  },
  {
    id: 5,
    name: 'STAPLE_APPLY',
    label: '大宗商家申请 '
  },
  {
    id: 6,
    name: 'DEAL_FEE',
    label: '交易手续费'
  },
  {
    id: 7,
    name: 'DEAL_SUBSIDY',
    label: '交易补贴'
  },
  {
    id: 8,
    name: 'NIGHT_SUBSIDY',
    label: '夜间补贴 '
  },
  {
    id: 9,
    name: 'AMOUNT_SUBSIDY',
    label: '达量补贴'
  },
  {
    id: 10,
    name: 'SHARE_SUBSIDY',
    label: '邀请奖励'
  },
  {
    id: 11,
    name: 'BACK_ACTIVE_BALANCE',
    label: '退还激活金 '
  },
  {
    id: 12,
    name: 'BACK_DEPOSIT',
    label: '退还保证金'
  },
  {
    id: 13,
    name: 'BACK_DEPOSIT',
    label: '代理商补贴'
  },
  {
    id: 14,
    name: 'TRUST_STAPLE_APPLY',
    label: '信任大宗商家申请'
  },
  {
    id: 15,
    name: 'JUNIOR_DEAL_SUBSIDY',
    label: '下级交易贡献 '
  },
  {
    id: 16,
    name: 'REORDER_BUY_IN',
    label: '补单买入 '
  },
  {
    id: 17,
    name: 'REORDER_SELL_OUT',
    label: '补单卖出 '
  },
  {
    id: 18,
    name: 'RELEASE_REWARD',
    label: '放行奖励'
  },
  {
    id: 19,
    name: 'SYSTEM_CENTRAL_WITHDRAW',
    label: '中央账户提现 '
  },
  {
    id: 20,
    name: 'SYSTEM_CENTRAL_RECHARGE',
    label: '中央账户充值'
  },
  {
    id: 21,
    name: 'SYSTEM_TRANSFER_IN',
    label: '系统打款'
  },
  {
    id: 22,
    name: 'SYSTEM_TRANSFER_OUT',
    label: '系统扣款'
  }
]