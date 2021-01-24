<template>
 <div>
    <Card>
			<p slot="title">
			  币币设置
				<Button type="primary" size="small" @click="refreshPageManual">
					<Icon type="refresh"></Icon>刷新
				</Button>
			</p>
      <Row style="padding:0px 8px 8px 8px">
        <div style="float: right" class="clearfix">
          <Button type="error" size="large"  @click="delcoin">删除交易对</Button>
          <Button type="primary" size="large"  @click="addcoin">添加交易对</Button>
        </div>
      </Row>
      <Modal
          class="auditModel"
          v-model="fixModel"
          title="修改币种信息"
          width="660"
          @on-ok="confirmFix">
          <Form :model="editCoinInformation"
            ref="editCoinInformation"
            :rules="ruleValidate" 
						:label-width="120" 
						label-position="right">
            <FormItem label="交易币种：" prop="symbol" disabled>
              <Input v-model="editCoinInformation.symbol">
              </Input>
            </FormItem>
            <FormItem class="self" label="交易币手续费：" prop="fee">
              <Input v-model="editCoinInformation.fee">
                <span slot="append">‰</span>
              </Input>
            </FormItem>
            <FormItem class="self" label="结算币手续费：" prop="baseFee">
              <Input v-model="editCoinInformation.baseFee">
                <span slot="append">‰</span>
              </Input>
            </FormItem>
            <FormItem class="self" label="交易币种精度：" prop="baseCoinScale">
              <InputNumber  class="no" v-model="editCoinInformation.baseCoinScale"></InputNumber>
            </FormItem>
            <FormItem class="self" label="结算币种精度：" prop="coinScale">
              <InputNumber  class="no" v-model="editCoinInformation.coinScale"></InputNumber>
            </FormItem>
            <FormItem class="self" label="最小挂单量：" prop="minVolume">
              <InputNumber class="no" v-model="editCoinInformation.minVolume"></InputNumber>
            </FormItem>
            <FormItem class="self" label="最大挂单量：" prop="maxVolume">
              <InputNumber class="no" v-model="editCoinInformation.maxVolume"></InputNumber>
            </FormItem>
            <FormItem class="self" label="最小卖单价：" prop="minSellPrice">
              <InputNumber class="no" v-model="editCoinInformation.minSellPrice"></InputNumber>
            </FormItem>
            <FormItem class="self" label="最小成交额：" prop="minTurnover">
              <InputNumber class="no" v-model="editCoinInformation.minTurnover"></InputNumber>
            </FormItem>
            <FormItem class="self" label="最大挂单时间：" prop="maxTradingTime">
              <Input v-model="editCoinInformation.maxTradingTime">
                <span slot="append">小时</span>
              </Input>
            </FormItem>
            <FormItem class="self" label="排序：" prop="sort">
              <InputNumber class="no" v-model="editCoinInformation.sort"></InputNumber>
            </FormItem>
            <FormItem class="four" label="市价买入：" prop="enableMarketBuy">
              <i-switch v-model="editCoinInformation.enableMarketBuy" size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
            <FormItem class="four" label="市价卖出：" prop="enableMarketSell">
              <i-switch v-model="editCoinInformation.enableMarketSell" size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
            <FormItem class="four" label="状态：" prop="enable">
              <i-switch v-model="editCoinInformation.enable" size="large">
                <span slot="open">正常</span>
                <span slot="close">失效</span>
              </i-switch>
            </FormItem>
            <FormItem class="four" label="推荐：" prop="flag">
              <i-switch v-model="editCoinInformation.flag" size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
            <FormItem class="six" label="交易币种图标" >
                <img :src="editCoinInformation.coinImgUrl" alt="" style='width:50px;height:50px'>
            </FormItem>
            <FormItem class="six" label="结算币种图标" >
                <img :src="editCoinInformation.baseImgUrl" alt="" style='width:50px;height:50px'>
            </FormItem>
          </Form>
      </Modal>
      <Modal
          class="auditModel"
          v-model="auditModal"
          title="编辑币种"
          width="660"
          @on-ok="confirmAudit">
          <Form  :model="coinInformation"
            :rules="ruleValidate" 
						:label-width="120" 
						label-position="right">
					<!-- <FormItem label="交易对：" prop="id" v-show="false">
						<Input disabled v-model="symbol" ></Input>
					</FormItem> -->
          <Row>
            <Col class="demo-tabs-style1">
              <Tabs type="card">
                <TabPane label="币对设置">
                  <FormItem label="交易币种：" prop="coinSymbol">
                    <Select placeholder="BTC" v-model="coinInformation.coinSymbol" transfer  @on-change="selectFunc1">
                        <Option v-for="(item ,index) in allCoin" :key="index" :value="item.unit">{{ item.unit }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="结算币种：" prop="baseSymbol">
                    <Select placeholder="USDT" v-model="coinInformation.baseSymbol" transfer   @on-change="selectFunc2">
                        <Option v-for="(item ,index) in allCoin" :key="index" :value="item.unit">{{ item.unit }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem class="self" label="交易币手续费：" prop="fee">
                    <Input v-model="coinInformation.fee">
                      <span slot="append">‰</span>
                    </Input>
                  </FormItem>
                  <FormItem class="self" label="结算币手续费：" prop="baseFee">
                    <Input v-model="coinInformation.baseFee">
                      <span slot="append">‰</span>
                    </Input>
                  </FormItem>
                  <FormItem class="four" label="市价买入：" prop="enableMarketBuy">
                    <i-switch v-model="coinInformation.enableMarketBuy" size="large">
                      <span slot="open">是</span>
                      <span slot="close">否</span>
                    </i-switch>
                  </FormItem>
                  <FormItem class="four" label="市价卖出：" prop="enableMarketSell">
                    <i-switch v-model="coinInformation.enableMarketSell" size="large">
                      <span slot="open">是</span>
                      <span slot="close">否</span>
                    </i-switch>
                  </FormItem>
                  <FormItem class="four" label="状态：" prop="enable">
                    <i-switch v-model="coinInformation.enable" size="large">
                      <span slot="open">正常</span>
                      <span slot="close">失效</span>
                    </i-switch>
                  </FormItem>
                 
                  <FormItem class="four" label="推荐：" prop="flag">
                    <i-switch v-model="coinInformation.flag" size="large">
                      <span slot="open">是</span>
                      <span slot="close">否</span>
                    </i-switch>
                  </FormItem>
                   <FormItem class="six" label="交易币种图标" >
                      <img :src="coinInformation.baseImgUrl" alt="" style='width:50px;height:50px;'>
                  </FormItem>
                   <FormItem class="six" label="结算币种图标" >
                      <img :src="coinInformation.coinImgUrl" alt="" style='width:50px;height:50px;'>
                  </FormItem>
                </TabPane>
                <TabPane label="参数设置">
                  <FormItem class="self" label="交易币种精度：" prop="baseCoinScale">
                    <InputNumber  class="no" v-model="coinInformation.baseCoinScale"></InputNumber>
                  </FormItem>
                  <FormItem class="self" label="结算币种精度：" prop="coinScale">
                    <InputNumber  class="no" v-model="coinInformation.coinScale"></InputNumber>
                  </FormItem>
                  <FormItem class="self" label="最小挂单量：" prop="minVolume">
                    <InputNumber class="no" v-model="coinInformation.minVolume"></InputNumber>
                  </FormItem>
                  <FormItem class="self" label="最大挂单量：" prop="maxVolume">
                    <InputNumber class="no" v-model="coinInformation.maxVolume"></InputNumber>
                  </FormItem>
                  <FormItem class="self" label="最小卖单价：" prop="minSellPrice">
                    <InputNumber class="no" v-model="coinInformation.minSellPrice"></InputNumber>
                  </FormItem>
                  <FormItem class="self" label="最小成交额：" prop="minTurnover">
                    <InputNumber class="no" v-model="coinInformation.minTurnover"></InputNumber>
                  </FormItem>
                  <FormItem class="self" label="最大挂单时间：" prop="maxTradingTime">
                    <Input v-model="coinInformation.maxTradingTime">
                      <span slot="append">小时</span>
                    </Input>
                  </FormItem>
                  <FormItem class="self" label="排序：" prop="sort">
                    <InputNumber class="no" v-model="coinInformation.sort"></InputNumber>
                  </FormItem>
                </TabPane>
              </Tabs>
            </Col>
        </Row>
				</Form>
      </Modal>
      <Table
        border 
        :columns="columns_first" 
        :data="exchange"
        @on-selection-change="selected" 
        :loading="ifLoading">
      </Table>

       <Modal
        v-model="ifDelete"
        title="删除交易对"
        @on-ok="confirmDel"
        @on-cancel="$Message.info('已取消！')">
        <p>是否删除选中的{{ deleteArr.length }}项</p>
       </Modal>

      <Row class="pageWrapper">
        <Page 
        :total="pageNum" 
        class="buttomPage" 
        :current="current"   
        @on-change="changePage" 
        show-elevator></Page>
      </Row>

			 <Modal
					class="auditModel"
					v-model="loginPassModal"
					title="请输入登录密码"
					width="350"
					@on-cancle="loginPW = ''"
					@on-ok="confirmLoginPass">
					<Input v-model="loginPW" type="password" placeholder="请输入登录密码"></Input>
			 </Modal>

    </Card>    
 </div>
</template>

 <script>

import { transactionPair } from '@/caculate/caculate'
import { getAllCoin, delBBSetting, addBBSetting, queryBBSetting, fixBBSetting } from '@/service/getData'

export default {
  data() {
    return {
      loginPW: '',
      allCoin: [],
	  loginPassModal: false,
      ifLoading: true,
      currentPageIdx: 1,
      coinScaleClass: false,
      baseSymbolClass: false,
      checkSymbolClass: false,
      coinSymbolClass: false,
      feeClass: false,
      baseCoinScaleClass: false,
      fixSymbol: null,
      fixEnable: 1,
      fixModel: false,
      symbol: null,
      coinSymbol: null,
      baseSymbol: null,
      enable: 1,
      fee: null,
      coinScale: null,
      baseCoinScale: null,
      auditModal: false,
      pageNum: null,
      current: 1,
      deleteArr: false,
      ifDelete: false,
      editCoinInformation:{},
      coinInformation: {
        fee: 1,
        baseFee: 1,
        coinSymbol: '',
        baseSymbol: '',
        enableMarketBuy: true,
        enableMarketSell: true,
        enable: true,
        baseCoinScale: 4,
        coinScale: 4,
        minVolume: 1,
        maxVolume: 10000,
        minSellPrice: 5000,
        minTurnover: 100,
        maxTradingTime: 168,
        flag:false,
        baseImgUrl:"",
        coinImgUrl:""
      },
      ruleValidate: {
				fee: [
					{required: true, message: '交易手续费不能为空', trigger: 'blur'}
				],
				baseFee: [
					{required: true, message: '结算手续费不能为空', trigger: 'blur'}
        ],
        enableMarketBuy: [
          {required: true}
        ],
        enableMarketSell: [
          {required: true}
        ],
        enable: [
          {required: true}
        ],
        baseCoinScale: [
          {required: true, message: '交易币种精度不能为空', trigger: 'blur'}
        ],
        coinScale: [
          {required: true, message: '结算币种精度不能为空', trigger: 'blur'}
        ],
        minVolume: [
          {required: true, message: '最小挂单量不能为空', trigger: 'blur'}
        ],
        maxVolume: [
          {required: true, message: '最大挂单量不能为空', trigger: 'blur'}
        ],
        minSellPrice: [
          {required: true, message: '最小卖单价不能为空', trigger: 'blur'}
        ],
        minTurnover: [
          {required: true, message: '最小成交额不能为空', trigger: 'blur'}
        ],
        maxTradingTime: [
          {required: true, message: '最大挂单时间不能为空', trigger: 'blur'}
        ]
      },
      columns_first: [
        {
          type: "selection",
          width: 60,
          algin: 'center'
        },
        {
          title: "序号",
          width: 100,
          type: "index"
        },
        {
          title: "交易对",
          key: "symbol"
        },
        {
          title: "结算币种",
          key: "baseSymbol"
        },
        {
          title: "交易币种",
          key: "coinSymbol"
        },
        {
          title: "交易币手续费",
          key: "fee",
          render: (h, params) => {
            const row = params.row;
            const fee = this.mul(row.fee,1000) + "‰";
            return h("span", {}, fee);
          }
        },
        {
          title: "结算币手续费",
          key: "fee",
          render: (h, params) => {
            const row = params.row;
            const baseFee = this.mul(row.baseFee,1000) + "‰";
            return h("span", {}, baseFee);
          }
        },
        {
          title: "状态",
          key: "enable",
          render: (h, params) => {
            const row = params.row;
            const enable = row.enable == "1" ? "启用" : "禁用";
            return h("span", {}, enable);
          }
        },
        {
          title: "操作",
          key: "xx",
          width: 120,
          render: (h, obj) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.fixModel = true;
                      
                      this.editCoinInformation = Object.assign({},obj.row);
                      this.editCoinInformation.fee = this.mul(this.editCoinInformation.fee,1000);
                      this.editCoinInformation.baseFee = this.mul(this.editCoinInformation.baseFee,1000);
                      this.editCoinInformation.maxTradingTime = this.div(obj.row.maxTradingTime,3600);
                      this.editCoinInformation.enable = obj.row.enable == 1 ? true : false;
                      this.editCoinInformation.enableMarketSell = obj.row.enableMarketSell == 1 ? true : false;
                      this.editCoinInformation.enableMarketBuy = obj.row.enableMarketBuy == 1 ? true : false;
                      this.editCoinInformation.flag = obj.row.flag == 1 ? true : false;
                       for(let i=0;i<this.allCoin.length;i++){
                            if(this.allCoin[i].unit == obj.row.baseSymbol){
                                this.editCoinInformation.baseImgUrl=this.allCoin[i].imgUrl
                            }
                            if(this.allCoin[i].unit == obj.row.coinSymbol){
                                this.editCoinInformation.coinImgUrl=this.allCoin[i].imgUrl
                            }
                        }
                    }
                  }
                },
                "修改"
              )
            ]);
          }
        }
      ],
      exchange: []
    };
  },
  methods: {
    // checkbaseCoinScale(str) {
      //   let bol = !(str*1>=0&&String(str).split('.').length===1) 
      //             || str===null || !str.trim().length;
      //   this.baseCoinScaleClass =  bol;
    // },
    // checkCoinScale(str) {
      //   let bol = !(str*1>=0&&String(str).split('.').length===1) 
      //             || str===null || !str.trim().length;
      //   this.coinScaleClass =  bol;
    // },
    selectFunc1(e){
        for(let i=0;i<this.allCoin.length;i++){
            if(this.allCoin[i].unit == e){
                this.coinInformation.baseImgUrl=this.allCoin[i].imgUrl
            }
        }
    },
    selectFunc2(e){
        for(let i=0;i<this.allCoin.length;i++){
           
            if(this.allCoin[i].unit == e){
                this.coinInformation.coinImgUrl=this.allCoin[i].imgUrl
            }
        }
    },
    checkFee(str) {
      let re = /\d|\d+.\d+$/g;
      this.feeClass = !re.test(String(str)) || !(str*1>0);
    },
    // checkbaseSymbol(str) {
      //   let re = /[^A-Z]/g;
      //   this.baseSymbolClass =  re.test(str);
    // },
    // checkCoinSymbol(str) {
      //   let re = /[^A-Z]/g;
      //   this.coinSymbolClass =  re.test(str);
    // },
    // checkPair(str) {
      //  let re = /^[A-Z]+\/[A-Z]+$/g;
      //   this.checkSymbolClass = !re.test(str);
		// },
		confirmLoginPass() {
        let obj = Object.assign({},this.editCoinInformation);
        obj.maxTxFee = obj.minTxFee = obj.fee = this.div(obj.fee,1000);
        obj.baseFee = this.div(obj.baseFee,1000);
        obj.enable = obj.enable == true ? 1 : 2;
        obj.enableMarketSell = obj.enableMarketSell == true ? 1 : 0;
        obj.enableMarketBuy = obj.enableMarketBuy == true ? 1 : 0;
        obj.flag = obj.flag == true ? 1 : 0;
        obj.password = this.loginPW;
        obj.maxTradingTime = this.mul(obj.maxTradingTime , 3600);
        delete obj._index;
        delete obj._rowKey;
        fixBBSetting(obj).then( res => {
          if (!res.code) {
						this.$Message.success('修改成功！');
						this.loginPW = '';
            this.refreshdata(1);
          }else this.$Message.error('修改失败！');
        })
		},
    confirmFix() {
      // this.$refs['editCoinInformation'].validate((valid) => {
      //   if (valid) {
          this.loginPassModal =  true;
      //   }
      // })
    },
    confirmAudit() {
      let _Obj = Object.assign({}, this.coinInformation)
      _Obj.maxTxFee = _Obj.minTxFee = _Obj.fee = this.div(_Obj.fee,1000);
      _Obj.baseFee = this.div(_Obj.baseFee,1000);
      _Obj.symbol = `${_Obj.coinSymbol}/${_Obj.baseSymbol}`
      _Obj.enable = _Obj.enable ? 1 : 2
      _Obj.enableMarketSell = _Obj.enableMarketSell ? 1 : 0
      _Obj.enableMarketBuy = _Obj.enableMarketBuy ? 1 : 0
      _Obj.flag = _Obj.flag ? 1 : 0;
      _Obj.maxTradingTime = this.mul(_Obj.maxTradingTime , 3600);
      if (_Obj.coinSymbol == _Obj.baseSymbol ){
        this.$Message.error('交易币种不能和结算币种一样');
        this.cancelEdit();
      } else {
        addBBSetting(_Obj).then( res => {
          if (!res.code) {
            this.refreshdata(1);
            this.$Message.success(res.message);
          } else this.$Message.error(res.message);
          this.cancelEdit();
        }).catch(err => {console.log(err.message)	})
      }
    },
    cancelEdit() {
      this.coinInformation = Object.assign({}, {
        fee: 1,
        baseFee: 1,
        coinSymbol: '',
        baseSymbol: '',
        enableMarketBuy: true,
        enableMarketSell: true,
        enable: true,
        baseCoinScale: 4,
        coinScale: 4,
        minVolume: 1,
        maxVolume: 10000,
        minSellPrice: 5000,
        minTurnover: 100,
        maxTradingTime: 168
      })
      this.coinInformation.enable = true;
      this.coinInformation.enableMarketBuy = true;
      this.coinInformation.enableMarketSell = true;
    },
    selected(selection) {
      this.deleteArr = [];
      selection.forEach(item => {
        this.deleteArr.push(item.symbol)
      });
    },
    confirmDel() {
      delBBSetting({ ids: this.deleteArr })
      .then( res =>{
        if(!res.code) {
          this.$Message.success('删除成功！');
          this.refreshdata(1);
        }else this.$Message.error('删除失败！');
      })
    },
    refreshPageManual() {
      this.ifLoading = true;
      this.refreshdata(this.currentPageIdx);
    },
    changePage(pageIndex) {
      this.ifLoading = true;
      this.currentPageIdx = pageIndex;
      this.refreshdata(pageIndex);
    },
    refreshdata(pageIndex) {
      queryBBSetting({ pageNo: pageIndex, pageSize: 10 })
      .then( res => {
        if(!!res.data){
          this.exchange = res.data.content;
          this.pageNum = res.data.totalElements;
        }
        this.ifLoading = false;
      })
      /**
			 * 获取所有币种
			 */
			getAllCoin().then(res => {
				this.allCoin = res.data
			})
    },
    delcoin() {
      if(!this.deleteArr.length) {
        this.$Message.warning('尚未选取项目！');
      } else  this.ifDelete = true;
    },
    addcoin() {
      this.symbol = null;
      this.coinSymbol = null;
      this.baseSymbol = null;
      this.enable = 1;
      this.fee = null;
      this.coinScale = null;
      this.baseCoinScal = null;
      this.auditModal = true;
    },
  },
  created() {
    this.refreshdata(1);
  }
};
</script>

<style lang="less" scoped>
  .self{
		width: 45%;
		display: inline-block;
		&:nth-child(2n){
			margin: 0 0 0 3%;
		}
  }
  .no{
    width: 100%;
  }
  .four{
    width: 23%;
    display: inline-block;
  }
  .auditModel{
    ul {
      li {
        position: relative;
        margin-bottom: 10px;
        span{
          position: absolute;
          top: 0;
          left: 0;
          display: inline-block;
          width: 95px;
          line-height: 32px;
          text-align: right;
          i{
            font-size: 14px;
            font-weight: 700;
            color: #ec0909;
          }
        }
        em{
          position: absolute;
          top: 0;
          right: 120px;
          line-height: 33px;
          font-style: normal;
          color: #ec0909;
        }
        p{
          padding-left: 100px;
          width: 300px;
          line-height: 32px;
          em{
            position: static;
            color: unset;
          }
        }
      }
    }
  }
</style>
