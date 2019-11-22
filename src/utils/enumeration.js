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
    label: '退回重新提交'
  },
  {
    id: 3,
    label: '订单已取消'
  }
]

export const AppealeStatus = [
  {
    id: 0,
    label: '待处理 '
  },
  {
    id: 1,
    label: '已处理'
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
