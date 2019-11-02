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

export const OrderStatus = [{
  name: 'UN_PAYED',
  id: 0,
  label: '待支付'
},
{
  name: 'PAY_CONFIRMED',
  id: 1,
  label: '确认已付款'
},
{
  name: 'CANCELED',
  id: 2,
  label: '取消'
},
{
  name: 'PAY_RECEIVED',
  id: 4,
  label: '确认已收款'
},
{
  name: 'COMPLETED',
  id: 5,
  label: '完成'
},
{
  name: 'APPEALING',
  id: 6,
  label: '申诉'
},
{
  nama: 'PAY_TIMEOUT',
  id: 7,
  label: '支付超时'
},
{
  nama: 'RECEIVED_TIMEOUT',
  id: 8,
  label: '收款超时'
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
  label: '下架'
},
{
  id: 1,
  name: 'false',
  label: '上架'
},
{
  id: 2,
  name: 'false',
  label: '关闭'
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

