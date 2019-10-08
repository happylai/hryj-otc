export const PayType=[	
    {name:'ALI_PAY',id:0, label:"支付宝"},
    {name:'WEI_XIN',id:1,label:"微信支付"},
    {nama:'BANK',id:2, label:"银行卡"},
    {name:'CLOUD_PAY',id:3, label:"云闪付"}
]

export const OrderStatus=[	
    {name:'UN_PAYED',id:0, label:"未支付"},
    {name:'CANCELED',id:1,label:"取消"},
    {nama:'TIMEOUT',id:2, label:"超时"},
    {name:'PAYED_CONFIRMED',id:3, label:"确认已付款"},
    {name:'COMPLETED',id:3, label:"完成"},
    {name:'APPEAL',id:3, label:"申诉"}
]

export const PayTypeStatus=[	
    {id:0, label:"等待审核"},
    {id:1,label:"审核成功"},
    {id:2, label:"审核失败"},
]