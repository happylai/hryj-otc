<template>
  <div class="tab-container">
    <!-- <el-tag>mounted times ：{{ createdTimes }}</el-tag>
    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" />-->

    <el-table :data="allList" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="loading"
        align="center"
        label="ID"
        width="65"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="昵称" width="55">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付方式" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.payType|paymentStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" minwidth="300">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="95">
        <template slot-scope="scope">
          <el-tag :type="tagType[scope.row.status]">{{ scope.row.status|payTypeStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="操作"  align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="showDetail(scope.row.id,scope.row.payType)"
          >详情</el-button>
          <el-button v-if="scope.row.status!==0" type="success" size="small" @click="passBtn(scope.row.id)">审核通过</el-button>
          <el-button v-if="scope.row.status!=0" type="danger" size="small" @click="refuseBtn(scope.row.id)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogPvVisible" title="支付详情">
      <el-row>
        <el-col :span="8">
          <div class="grid-content">审核状态：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{payInfo.auditStatus|payTypeStatus }}</div>
        </el-col>
      </el-row>
      <el-row v-if="payInfo.auditStatus==2">
        <el-col :span="8">
          <div class="grid-content">审核拒原因：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{payInfo.reason}}</div>
        </el-col>
      </el-row>
      <el-row v-if="payInfo.payType==3">
        <el-col :span="8">
          <div class="grid-content">云闪付账号：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{payInfo.cloudpayNo}}</div>
        </el-col>
      </el-row>
      <el-row v-if="payInfo.payType==3">
        <el-col :span="8">
          <div class="grid-content">云闪付二维码：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <img class="qrimage" :src="payInfo.cloudQrCode" alt="云闪付二维码" />
          </div>
        </el-col>
      </el-row>
      <el-row v-if="payInfo.payType==2">
        <el-col :span="8">
          <div class="grid-content">银行账号：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{payInfo.bankCard}}</div>
        </el-col>
      </el-row>
      <el-row v-if="payInfo.payType==2">
        <el-col :span="8">
          <div class="grid-content">银行名称：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{payInfo.bank}}</div>
        </el-col>
      </el-row>
      <el-row v-if="payInfo.payType==2">
        <el-col :span="8">
          <div class="grid-content">分行名称：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{payInfo.bankBranch}}</div>
        </el-col>
      </el-row>
      <el-row v-if="payInfo.payType==2">
        <el-col :span="8">
          <div class="grid-content">单日总额：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{payInfo.dailyAmount}}</div>
        </el-col>
      </el-row>

      <el-row v-if="payInfo.payType==1">
        <el-col :span="8">
          <div class="grid-content">微信昵称：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{payInfo.weixinNick}}</div>
        </el-col>
      </el-row>
      <el-row v-if="payInfo.payType==1">
        <el-col :span="8">
          <div class="grid-content">微信账号：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{payInfo.weixinNo}}</div>
        </el-col>
      </el-row>
      <el-row v-if="payInfo.payType==1">
        <el-col :span="8">
          <div class="grid-content">微信二维码：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <img class="qrimage" :src="payInfo.weixinQrCode" alt="微信二维码" />
          </div>
        </el-col>
      </el-row>
      <el-row v-if="payInfo.payType==0">
        <el-col :span="8">
          <div class="grid-content">支付宝昵称：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{payInfo.alipayNick}}</div>
        </el-col>
      </el-row>
      <el-row v-if="payInfo.payType==0">
        <el-col :span="8">
          <div class="grid-content">支付宝昵称：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{payInfo.alipayNick}}</div>
        </el-col>
      </el-row>
      <el-row v-if="payInfo.payType==0">
        <el-col :span="8">
          <div class="grid-content">支付宝账号：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{payInfo.alipayNo}}</div>
        </el-col>
      </el-row>
      <el-row v-if="payInfo.payType==0">
        <el-col :span="8">
          <div class="grid-content">支付宝维码：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <img class="qrimage" :src="payInfo.aliQrCode" alt="支付宝二维码" />
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tabPane from "./components/TabPane";
import { mapState, mapGetters, mapActions } from "vuex"; //先要引入
import Pagination from "@/components/Pagination";
import waves from "@/directive/waves"; // waves directive
import { OrderStatus, PayType, PayTypeStatus } from "@/utils/enumeration";
import { payTypeDetail, payTypeAudit } from "@/api/usermanage";
import { MessageBox, Message } from "element-ui";

export default {
  name: "Tab",
  components: { tabPane },
  directives: { waves },
  data() {
    return {
      tagType: [
        '','success','danger'
      ],
      activeName: "all",
      createdTimes: 0,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        keywords: undefined,
        orderType: undefined,
        paymentType: undefined,
        orderStatus: undefined
      },
      dialogPvVisible: false,
      auditRefuseVisible: false,
      payInfo: {
        auditStatus: 0
      }
    };
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`);
    }
  },
  computed: {
    ...mapState({
      allList: state => state.usermanage.userPayType,
      allListMeta: state => state.usermanage.userPayTypeMeta
    })
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab;
    if (tab) {
      this.activeName = tab;
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1;
    },
    showDetail(id, payType) {
      console.log("id", id);
      this.dialogPvVisible = true;
      const payTypeList = ["alipayInfo", "weixinInfo", "bankInfo", "cloudInfo"];
      payTypeDetail(id).then(res => {
        console.log("res", res);
        if (res.code === 0) {
          this.payInfo = res.data[payTypeList[payType]];
          this.payInfo.payType = payType;
        }
      });
    },
    refuseBtn(id) {
      this.$prompt("请输入拒绝原因", "提示", {
        confirmButtonText: "拒绝",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (!value) {
            this.$message({
              type: "warning",
              message: "请输入拒绝原因"
            });
            return false;
          }
          const data = {
            audit: false,
            id: id,
            reason: value
          };
          console.log("data", data);
          payTypeAudit(data).then(res => {
            console.log("res", res);
            this.loading = false;
            if (res.code === 0) {
              this.$message({
                message: "拒绝成功",
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    passBtn(id) {
      this.loading = true;
      const data = {
        audit: true,
        id: id,
        reason: ""
      };
      payTypeAudit(data).then(res => {
        console.log("res", res);
        this.loading = false;

        if (res.code === 0) {
          this.$message({
            message: "通过成功",
            type: "success"
          });
        }
      });
    },

    getList() {
      this.listLoading = true;
      this.$store.dispatch("usermanage/payType");
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    }
  }
};
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
.qrimage {
  width: 140px;
  height: 140px;
}
</style>
