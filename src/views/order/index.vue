<template>
  <div class="tab-container">
    <el-tabs v-model="activeType" style="margin-top:15px;" @tab-click="handleTabClick">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key" />
      <tip />
      <div class="filter-container" style="margin-bottom: 10px;">
        <el-input v-model="fliterQuery.orderUid" clearable placeholder="订单ID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="fliterQuery.merchantOrder" clearable placeholder="第三方单号" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="fliterQuery.advertiseUid" clearable placeholder="广告ID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="fliterQuery.nick" clearable placeholder="收付款昵称" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="fliterQuery.buyer" clearable placeholder="买家" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="fliterQuery.seller" clearable placeholder="卖家" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="fliterQuery.payType" placeholder="支付方式" clearable style="width: 140px" class="filter-item">
          <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
        <el-select v-model="fliterQuery.type" placeholder="交易类型" clearable style="width: 140px" class="filter-item">
          <el-option v-for="item in CounterParty" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
        <el-select v-model="fliterQuery.status" placeholder="订单状态" clearable style="width: 140px" class="filter-item">
          <el-option v-for="item in OrderStatus" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
        <el-date-picker
          v-model="fliterQuery.creatDate"
          class="filter-item"
          type="daterange"
          range-separator="至"
          start-placeholder="订单完创建开始日期"
          end-placeholder="结束日期"
        />
        <el-date-picker
          v-model="fliterQuery.complateDate"
          class="filter-item"
          type="daterange"
          range-separator="至"
          start-placeholder="交易完成开始日期"
          end-placeholder="结束日期"
        />
        <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-download" @click="handleDownload">
          导出
        </el-button>
      </div>
      <el-table v-if="activeType==='1'" v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%;font-size:10px">
        <el-table-column

          align="center"
          label="订单ID"
          min-width="140"
          element-loading-text="请给我点时间！"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.uuid }}</span>
          </template>
        </el-table-column>

        <el-table-column width="60px" align="center" label="币种">
          <template slot-scope="scope">
            <span>{{ scope.row.token }}</span>
          </template>
        </el-table-column>

        <el-table-column width="60px" align="center" label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.type|advType }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="卖家" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.seller }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="买家" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.buyer }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="60px" label="交易数量(PQC)">
          <template slot-scope="scope">
            <span>{{ scope.row.amount }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="80px" align="left" label="支付方式">
          <template slot-scope="scope">

            <el-link v-if="scope.row.payType!==null" :underline="false" @click="handleShowPaymentInfo(scope.row.payInfo)"><i class="el-icon-info" /> {{ scope.row.payType|payTypeName }} </el-link>
            <span v-else>无</span>
          <!-- <span>{{ scope.row.remainAmount }}</span> -->
          </template>
        </el-table-column>

        <el-table-column align="center" label="收款账号" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.payInfo.account||'无' }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="收款昵称" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.payInfo.nick||'无' }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="activeType==='2'" align="center" label="手续费" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.fee }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="交易时间" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="取消时间" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.payCancelTime||'无' }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="完成时间" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.receiveConfirmTime||'无' }}</span>
          </template>
        </el-table-column>

        <el-table-column width="60px" align="center" label="币种">
          <template slot-scope="scope">
            <span>{{ scope.row.token }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="二维码" min-width="80">
          <template slot-scope="scope">
            <img v-if="scope.row.qrCode" v-lazy="scope.row.qrCode" class="appealImage" :preview="scope.row.id+'qrCode'">
            <!-- <img v-else v-lazy="scope.row.qrCode" :preview="'chat'+scope.row.id" class="chatListImage"> -->

            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="60">
          <template slot-scope="scope">
            <el-link :underline="false" :type="scope.row.orderStatus|orderStatusTagName">{{ scope.row.orderStatus|orderStatus }}</el-link>
          </template>
        </el-table-column>

        <el-table-column align="center" class-name="status-col" label="操作" min-width="210">
          <template slot-scope="scope">
            <el-button class="actionBtn" :disabled="scope.row.orderStatus===2||scope.row.orderStatus===5||scope.row.orderStatus===6" type="danger" size="small" @click="orderAction(scope.row.id,0,activeType==='1'?'强制取消':scope.row.isOut?'取消委托':'强制取消')">{{ activeType==='1'?'强制取消':scope.row.isOut?'取消委托':'强制取消' }}</el-button>
            <el-button class="actionBtn" :disabled="scope.row.orderStatus===2||scope.row.orderStatus===5||scope.row.orderStatus===6" type="success" size="small" @click="orderAction(scope.row.id,1,'强制完成')">强制完成</el-button>
            <el-button v-if="activeType==='2'&&scope.row.idOut" class="actionBtn" :disabled="scope.row.orderStatus===2||scope.row.orderStatus===5||scope.row.orderStatus===6" type="success" size="small" @click="orderAction(scope.row.id,2,'重新匹配')">重新匹配</el-button>
            <el-button class="actionBtn" type="primary" size="small" @click="clickDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-else v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%;font-size:10px">
        <el-table-column

          align="center"
          label="订单ID"
          min-width="140"
          element-loading-text="请给我点时间！"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.uuid }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="120px" align="center" label="第三方订单号">
          <template slot-scope="scope">
            <span>{{ scope.row.merchantOrderNo }}</span> <span v-if="scope.row.invokeCount&&scope.row.invokeCount>=2">({{ scope.row.invokeCount }})</span>
          </template>
        </el-table-column>

        <el-table-column width="60px" align="center" label="币种">
          <template slot-scope="scope">
            <span>{{ scope.row.token }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column width="100px" align="center" label="匹配次数">
          <template slot-scope="scope">
            <span>{{ scope.row.invokeCount }}</span>
          </template>
        </el-table-column> -->

        <el-table-column width="60px" align="center" label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.type|advType }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="卖家" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.seller }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="买家" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.buyer }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="60px" label="交易额(PQC)">
          <template slot-scope="scope">
            <span>{{ scope.row.amount }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="70px" label="交易总价(CNY)">
          <template slot-scope="scope">
            <span>{{ scope.row.legalAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80px" align="left" label="支付方式">
          <template slot-scope="scope">
            <el-link v-if="scope.row.payType!==null" :underline="false" @click="handleShowPaymentInfo(scope.row.payInfo)"><i class="el-icon-info" /> {{ scope.row.payType|payTypeName }} </el-link>
            <span v-else>无</span>
          <!-- <span>{{ scope.row.remainAmount }}</span> -->
          </template>
        </el-table-column>

        <el-table-column align="center" label="收款账号" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.payInfo.account }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="收款昵称" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.payInfo.nick }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="activeType==='2'" align="center" label="手续费" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.fee }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="交易时间" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="取消时间" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.payCancelTime||'无' }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="完成时间" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.receiveConfirmTime||'无' }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="打款备注" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.memo }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="二维码" min-width="80">
          <template slot-scope="scope">
            <img v-if="scope.row.qrCode" v-lazy="scope.row.qrCode" class="appealImage" :preview="scope.row.id+'qrCode'">
            <!-- <img v-else v-lazy="scope.row.qrCode" :preview="'chat'+scope.row.id" class="chatListImage"> -->

            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="60">
          <template slot-scope="scope">
            <el-link :underline="false" :type="scope.row.orderStatus|orderStatusTagName">{{ scope.row.orderStatus|orderStatus }}</el-link>
          </template>
        </el-table-column>

        <el-table-column align="center" class-name="status-col" label="操作" min-width="210">
          <template slot-scope="scope">
            <el-button class="actionBtn" :disabled="scope.row.orderStatus===2||scope.row.orderStatus===5||scope.row.orderStatus===6" type="danger" size="small" @click="orderAction(scope.row.id,0,activeType==='1'?'强制取消':scope.row.isOut?'取消委托':'强制取消')">{{ activeType==='1'?'强制取消':scope.row.isOut?'取消委托':'强制取消' }}</el-button>
            <el-button class="actionBtn" :disabled="scope.row.orderStatus===2||scope.row.orderStatus===5||scope.row.orderStatus===6" type="success" size="small" @click="orderAction(scope.row.id,1,'强制完成')">强制完成</el-button>
            <el-button v-if="activeType==='2'&&scope.row.isOut" class="actionBtn" :disabled="scope.row.orderStatus===2||scope.row.orderStatus===5||scope.row.orderStatus===6" type="success" size="small" @click="orderAction(scope.row.id,2,'重新匹配')">重新匹配</el-button>
            <el-button class="actionBtn" type="primary" size="small" @click="clickDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tabs>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />
    <el-dialog :visible.sync="dialogVisible" title="订单详情" width="1000px">
      <div v-if="activeType==='1'">
        <el-row :gutter="20" class="">
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 订单ID:{{ editData.orderC.uuid }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 创建时间:{{ editData.orderC.createTime }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 付款时间：{{ editData.orderC.payConfirmTime }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 交易金额：{{ editData.orderC.amount }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 申诉时间：{{ editData.orderC.appealTime }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 取消时间：{{ editData.orderC.payCancelTime }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 完成时间：{{ editData.orderC.receiveConfirmTime }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 类型：{{ editData.orderC.type|advType }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 币种:{{ editData.orderC.token }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 买家:{{ editData.orderC.buyer }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 所属广告:{{ editData.orderC.advertiseUuid }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 支付方式:{{ editData.orderC.payType|payTypeName }}</div>
          </el-col>

        </el-row>
      </div>
      <div v-else>
        <el-row :gutter="20" class="">
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 订单ID:{{ editData.orderB.uuid }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 卖家:{{ editData.orderB.seller }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 买家:{{ editData.orderB.buyer }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 所属广告：{{ editData.orderB.advertiseUuid }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 交易数量(PQC)：{{ editData.orderB.amount }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 交易单价：{{ editData.orderB.price }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 交易金额(CNY)：{{ editData.orderB.legalAmount }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 交易补贴：{{ editData.orderB.dealSubsidy }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 夜间补贴：{{ editData.orderB.nightSubsidy }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 放行补贴：{{ editData.orderB.releaseSubsidy }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 手续费：{{ editData.orderB.fee }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 汇率差：{{ editData.orderB.exchangeMistake }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 创建时间:{{ editData.orderB.createTime }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 审核时间：{{ editData.orderB.outAuditTime }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 付款时间：{{ editData.orderB.payConfirmTime }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 收款时间：{{ editData.orderB.receiveConfirmTime }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 取消时间：{{ editData.orderB.payCancelTime }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 是否申诉：{{ editData.orderB.isAppealed?'是':'否' }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 提现审核人：{{ editData.orderB.isOut?'是':'否' }}</div>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 提现审核人：{{ editData.orderB.outAuditAdmin }}</div>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
            <div class="orderInfoItem"> 支付方式:{{ editData.orderB.payType|payTypeName }}</div>
          </el-col>
        </el-row>
        <div>
          <h3>支付信息</h3>
          <div v-if="editData.orderB.payInfo&&editData.orderB.payInfo.account">
            <el-row :gutter="20" class="">
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 收款账号:{{ editData.orderB.payInfo.account }}</div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 付款方式：{{ editData.orderB.payInfo.payType|payTypeName }}</div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 真实姓名：{{ editData.orderB.real }}</div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 支付昵称:{{ editData.orderB.payInfo.nick }}</div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 收款地区:{{ editData.orderB.payInfo.area }}</div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 开户银行:{{ editData.orderB.payInfo.bank }}</div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 开户支行:{{ editData.orderB.payInfo.bankBranch }}</div>
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :xl="6"class="">
                <div class="orderInfoItem"> 二维码:</div>
                <div>
                  <img v-if="editData.orderB.paymentUrlOne" v-lazy="editData.orderB.paymentUrlOne" class="DetailvoucherImage" :preview="`${editData.id}withdarw011`" @click="dialogVisible=false">
                  <span v-else>无</span>
                  <img v-if="editData.orderB.paymentUrlTwo" v-lazy="editData.orderB.paymentUrlTwo" class="DetailvoucherImage" :preview="`${editData.id}withdarw011`" @click="dialogVisible=false">
                  <img v-if="editData.orderB.paymentUrlThree" v-lazy="editData.orderB.paymentUrlThree" class="DetailvoucherImage" :preview="`${editData.id}withdarw011`" @click="dialogVisible=false">
                </div>
              </el-col>

            </el-row>

          </div>
          <span v-else>无</span>

        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">确定</el-button>
        <el-button type="info" @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <paymentInfo :dialog-visible="showPaymentInfo" :pay-info="digPayInfo" @handleClose="showPaymentInfo=false" />
  </div>
</template>

<script>
import tabPane from './components/TabPane'
import tip from '@/components/Tip'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import paymentInfo from '@/components/PaymentInfo'
import { order_list, order_detail, order_cancel, order_confirm, pro_odrder_rematch, export_excel } from '@/api/order'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, PayType, OrderStatus, CounterParty } from '@/utils/enumeration'
import { exportExcel } from '../../api/order'

export default {
  name: 'Tab',
  components: { tabPane, pagination, tip, paymentInfo },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '站内订单', key: '1' },
        { label: 'To B订单', key: '2' }
      ],
      CounterParty,
      OrderStatus,
      PayType,
      UserType,
      Authents,
      Groups,
      activeType: '1',
      isMatch: false,
      createdTimes: 0,
      fliterQuery: {
        page: 1,
        size: 10,
        payType: undefined,
        orderUid: undefined,
        merchantOrder: undefined,
        advertiseUid: undefined,
        nick: undefined,
        buyer: undefined,
        seller: undefined,
        status: undefined,
        creatDate: undefined,
        complateDate: undefined
      },
      type: undefined,
      meta: {
        current: 1,
        size: 10
      },
      loading: false,
      list: [],
      paginationMeta: {
        total: 10,
        pages: 1
      },
      dialogVisible: false,
      editData: {
        orderB: {
          payInfo: {}
        },
        orderC: {}
      },
      showPaymentInfo: false,
      digPayInfo: {}
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  computed: {
    ...mapState({
      allList: state => state.order.allList,
      allListMeta: state => state.order.allMeta
    })
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleShowPaymentInfo(data) {
      this.digPayInfo = data
      this.showPaymentInfo = true
    },
    handleTabClick(tab, event) {
      console.log('tab', tab)
      this.meta.current = 1
      const fliterQuery = {
        page: 1,
        size: 10,
        payType: undefined,
        query: undefined,
        status: undefined,
        creatDate: undefined,
        complateDate: undefined
      }
      this.fliterQuery = fliterQuery
      this.editData = {
        orderB: {
          payInfo: {}
        },
        orderC: {}
      }
      this.getList()
    },
    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.handleFilter(false)
    },
    getList(meta, data) {
      this.loading = true
      order_list(meta || this.meta, data || { isMatch: this.activeType === '2' }).then(res => {
        console.log('res', res)
        this.loading = false
        if (res.code === 0) {
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
        }
      })
    },
    handleFilter(resetPage = true) {
      const fliterQuery = this.fliterQuery
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        isMatch: this.activeType === '2',
        type: fliterQuery.type,
        orderUid: fliterQuery.orderUid,
        merchantOrder: fliterQuery.merchantOrder,
        advertiseUid: fliterQuery.advertiseUid,
        nick: fliterQuery.nick,
        buyer: fliterQuery.buyer,
        seller: fliterQuery.seller,
        payType: fliterQuery.payType,
        status: fliterQuery.status,
        userId: this.userId
      }
      if (fliterQuery.creatDate) {
        data.createStart = this.$moment(fliterQuery.creatDate[0]).format('YYYY-MM-DD HH:mm:ss')
        data.createEnd = this.$moment(fliterQuery.creatDate[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      if (fliterQuery.complateDate) {
        data.confirmStart = this.$moment(fliterQuery.complateDate[0]).format('YYYY-MM-DD HH:mm:ss')
        data.confirmEnd = this.$moment(fliterQuery.complateDate[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      resetPage ? meta.current = 1 : null

      this.getList(meta, data)
    },
    handleDownload(resetPage = true) {
      const fliterQuery = this.fliterQuery
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        isMatch: this.activeType === '2',
        type: fliterQuery.type,
        orderUid: fliterQuery.orderUid,
        merchantOrder: fliterQuery.merchantOrder,
        advertiseUid: fliterQuery.advertiseUid,
        nick: fliterQuery.nick,
        buyer: fliterQuery.buyer,
        seller: fliterQuery.seller,
        payType: fliterQuery.payType,
        status: fliterQuery.status,
        userId: this.userId
      }
      if (fliterQuery.creatDate) {
        data.createStart = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        data.createEnd = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      if (fliterQuery.complateDate) {
        data.confirmStart = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        data.confirmEnd = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      resetPage ? meta.current = 1 : null
      export_excel(meta, data).then(response => {
        this.downloadExcel(response)
      }).catch(() => console.log('export excel error'))
    },
    downloadExcel(response) {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      const fileName = decodeURI(response.headers['content-disposition'].split('=')[1])
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
    clickDetail(data) {
      this.getOrderDetail(data.id)
      this.dialogVisible = true
    },
    getOrderDetail(id) {
      order_detail({ orderId: id }).then(res => {
        if (res.code === 0) {
          this.editData = res.data
        }
      })
    },
    orderAction(orderId, type, tipText) {
      const apiList = [order_cancel, order_confirm, pro_odrder_rematch]
      this.$confirm(`是否${tipText}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((val) => {
        apiList[type]({ orderId: orderId }).then(res => {
          if (res.code === 0) {
            this.$message({ message: res.message || '操作成功', type: 'success' })
            this.handleFilter()
          } else {
            this.$message.error(res.message || '操作失败')
          }
        }).catch(err => {
          this.$message.error(err.message || '操作失败')
        })
      })
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
  .DetailvoucherImage, .appealImage{
    height: 40px;
    max-width: 100px;
  }
  .actionBtn{
    font-size: 10px;
    margin: 4px;
  }
  .orderInfoItem{
    margin:8px 4px;
  }
</style>
