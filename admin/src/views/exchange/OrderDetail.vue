<template>
	<div>
    <Card>
      <p slot="title">
        币币委托详情
        <!-- <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          刷新
        </Button> -->
      </p>

			<div class="baseInfo">
				<Row>
					<Col span="6">
						<p>委托单号：<span>{{userpage.order.orderId}}</span></p>
					</Col>
					<Col span="6">
						<p>状态：<span>{{userpage.order.status | filterStatus}}</span></p>
					</Col>
					<Col span="6">
						<p>委托时间：<span>{{userpage.order.time}}</span></p>
					</Col>
					<Col span="6">
						<p>委托类型：<span>{{userpage.order.type === 'LIMIT_PRICE' ? '限价' : '市价'}}</span></p>
					</Col>
				</Row>
				
				<Row>
					<Col span="6">
						<p>委托价格：<span>{{`${userpage.order.price} ${userpage.order.coinSymbol}`}}</span></p>
					</Col>
					<Col span="6">
						<p>委托数量：<span>{{userpage.order.amount}}</span></p>
					</Col>
					<Col span="6">
						<p>成交数量：<span>{{userpage.order.tradedAmount}}</span></p>
					</Col>
					<Col span="6">
						<p>成交金额：<span>{{userpage.order.turnover}}</span></p>
					</Col>
				</Row>
			</div>

    </Card>
		<br><br>
		<Card>
			<p slot="title">
        交易记录
      </p>
			<Row>
				<Table 
					:columns="columnsList" 
					:data="userpage.detail" 
					border 
					:loading="ifLoading"
					class='user_center'>
				</Table>
      </Row>

      <!-- <Row class="pageWrapper" >
        <Page :total="totalNum" style='margin-top:8px' :current="current"   @on-change="changePage" show-elevator></Page>
      </Row> -->
		</Card>
  </div>
</template>

<script>
import dtime from 'time-formater'
import { exgOrderDetail  } from '@/service/getData';
import { setStore, getStore, removeStore } from '@/config/storage';


export default {
  data () {
    return {
      currentPageIdx: null,
      totalNum: null,
      ifLoading: true,
      // current:1,
      pageIndex:1,
      columnsList: [
        {
          title: '订单号',
          key: 'orderId'
        },
        {
          title: '挂单价格',
          key: 'price'
        },
        {
          title: '挂单量',
          key: 'amount'
        },
        {
          title: '手续费',
          key: 'fee'
        },
        {
          title: '交易时间',
          key: 'time',
          render: (h, obj) => {
            let formatTime = dtime(obj.row.time).format('YYYY-MM-DD HH:mm:ss')
            return h('span',{},formatTime)
          }
        },
      ],
      userpage: {
				detail: [],
				order: {}
			}
    }
	},
	/* 
		 TRADING,COMPLETED,CANCELED,OVERTIMED;
	*/
	/* 
		private String orderId;
    private BigDecimal price;
    private BigDecimal amount;
    private BigDecimal turnover;
    private BigDecimal fee;
    //成交时间
    private long time;
	*/
  methods: {
    refreshPageManual() {
      this.ifLoading = true;
      this.refreshPage({ pageNo: this.currentPageIdx, pageSize: 10 });
    },
    refreshPage() {
      //无分页字段
      let orderID = getStore('exchangeOrderId');
      
      exgOrderDetail({ id: orderID })
      .then( res => {
        this.userpage = res.data;
        if(this.userpage.order.time!=null || this.userpage.order.time!=undefined){
            this.userpage.order.time=dtime(this.userpage.order.time).format("YYYY-MM-DD HH:mm:ss")
           
        }

        this.ifLoading = false;
      })
    }
  },
  created() {
    this.refreshPage();
	},
	filters: {
		filterStatus(val) {
			let obj = {
				TRADING: '交易中',
				COMPLETED: '已完成',
				CANCELED: '已取消',
				OVERTIMED: '超时'
			}
			return obj[val]
		}
	}
}
</script>

<style lang="less" scoped>
  
</style>