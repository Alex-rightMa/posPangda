<template>
  <div class="pos">
    <el-row>
      <!-- 商品处理区域 -->
      <el-col :span="7" class="pos-order" id="order-list">
        <el-tabs type="card" @tab-click="switchTab" v-model="activeTab">
          <el-tab-pane label="点餐" name="0" :class="['ppo']">
            <el-table
              :data="tableData"
              border
              show-summary
              :summary-method="getSummaries"
              style="width: 100%"
            >
              <el-table-column prop="goodsName" label="商品"></el-table-column>
              <el-table-column prop="count" label="数量" width="50"></el-table-column>
              <el-table-column prop="price" label="金额" width="70"></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="props">
                  <el-button type="text" size="small" @click="delGoodsList(props.row)">删除</el-button>
                  <el-button type="text" size="small" @click="addGoodsList(props.row)">增加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="sum-btn">
              <el-button type="warning" @click="hangUp()">挂单</el-button>
              <el-button type="danger" @click="delAllGoods()">删除</el-button>
              <el-button type="success" @click="checkOut()">结账</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="挂单" name="1">
            <el-collapse v-model="orderList">
              <el-collapse-item
                :title="'订单id：'+list.id"
                :name="list.id"
                v-for="list in hangUpData"
                :key="list.id"
              >
                <div class="head">
                  <div>序号</div>
                  <div>商品名称</div>
                  <div>数量</div>
                  <div>价格</div>
                </div>
                <div v-for="(item, i) in list.data" :key="i" class="hang-card">
                  <div>{{i}}</div>
                  <div>{{item.goodsName}}</div>
                  <div>{{item.count}}</div>
                  <div>{{item.price}}</div>
                </div>
                <div class="order-btn">
                  <el-button type="danger" size="small" @click="delHangList(list.id)">删除</el-button>
                  <el-button type="success" size="small" @click="subHangList(list)">结账</el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="外卖" name="2">外卖</el-tab-pane>
        </el-tabs>
      </el-col>
      <!--商品展示区域-->
      <el-col :span="17">
        <div class="often-goods">
          <div class="title">常用商品</div>
          <div class="often-goods-list">
            <ul>
              <li v-for="goods in oftenGoods" :key="goods.goodsId" @click="addGoodsList(goods)">
                <span>{{ goods.goodsName }}</span>
                <span class="o-price">￥{{ goods.price }}元</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="goods-type">
          <el-tabs type="card">
            <el-tab-pane label="汉堡">
              <ul class="cookList">
                <li v-for="goods in type0Goods" :key="goods.goodsId" @click="addGoodsList(goods)">
                  <span class="foodImg">
                    <img :src="goods.goodsImg" width="100%" />
                  </span>
                  <div class="rightCom">
<span class="foodName">{{goods.goodsName}}</span>
                  <span class="foodPrice">￥{{goods.price}}元</span>
                  </div>
                  
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="小食">
              <div class="tabList">
                <el-card
                  :body-style="{ padding: '0px' ,width: '140px',textAlign: 'center' }"
                  v-for="goods in type1Goods"
                  :key="goods.goodsId"
                  @click.native="addGoodsList(goods)"
                >
                  <img :src="goods.goodsImg" class="image" style="margin-top: 6px;" />
                  <div style="padding: 14px;" >
                    <span>{{goods.goodsName}}</span>
                    <div class="bottom clearfix">
                      <time class="time">￥{{goods.price}}元</time>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
            <el-tab-pane label="饮料">饮料</el-tab-pane>
            <el-tab-pane label="套餐">套餐</el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Pos",
  data() {
    return {
      activeTab: 0,
      activeOrderId: "",
      tableData: [], // 点餐页签展示数据
      oftenGoods: [], // 常用商品数据
      type0Goods: [], // 常用商品-汉堡
      type1Goods: [], // 常用商品-小食
      type2Goods: [], // 常用商品-饮料
      type3Goods: [], // 常用商品-套餐
      hangUpIdList: [], // 挂单ID列表
      hangUpData: [], // 挂单数据
      orderList: [] // 挂单页签展示数据
    };
  },
  created() {
    this.$axios
      .get("/DemoApi/oftenGoods")
      .then(res => {
        this.oftenGoods = res;
      })
      .catch(err => {
        console.log(err);
      });
    this.$axios
      .get("/DemoApi/typeGoods")
      .then(res => {
        res.map((v, i) => {
          this["type" + i + "Goods"] = res[i];
        });
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {
    var orderHeight = document.body.clientHeight;
    document.getElementById("order-list").style.height = orderHeight + "px";
    this.hangUpIdList = this.handleIdList("hangUpIdList"); // 优先从缓存获取挂单数据
    this.orderList = [this.hangUpIdList[0]]; // 挂单激活列表--默认展开第一个
  },
  methods: {
    addGoodsList(goods) {
      if (this.activeTab != 0) {
        // 在点餐页签下才执行添加操作
        return;
      }
      // 添加单个商品
      let isExist = false;
      let index;
      var res = this.tableData.filter((v, i) => {
        if (v.goodsId === goods.goodsId) {
          isExist = true;
          index = i;
        }
      });

      if (isExist) {
        this.tableData[index].count++;
      } else {
        let item = { ...goods, count: 1 };
        this.tableData.push(item);
      }
    },
    getSummaries() {
      const sums = ["合计"];
      let totalPrice = 0;
      let totalNum = 0;
      this.tableData.forEach(good => {
        totalPrice += good.price * good.count;
        totalNum += good.count;
      });
      sums.push(totalNum + "个", totalPrice + "元");
      return sums;
    },
    delGoodsList(goods) {
      // 删除单个商品
      this.tableData = this.tableData.filter(v => goods.goodsId !== v.goodsId);
    },
    delAllGoods() {
      // 清空所有商品
      this.tableData = [];
    },
    vaildData(errMsg) {
      // 校验选择的数据
      let res = false;
      if (this.tableData.length > 0) {
        res = true;
      } else {
        this.$message.error(errMsg);
      }
      return res;
    },
    checkOut() {
      // 结账
      if (this.vaildData("(￣︶￣*))购物车是空的哟~~")) {
        this.$axios
          .post("/DemoApi/submitGoods", this.tableData)
          .then(res => {
            this.delAllGoods();
            if (this.activeOrderId) {
              _fStore.del(this.activeOrderId); // 删除挂单订单
              this.activeOrderId = "";
            }
            this.$message({
              message: "结账成功，感谢投食!",
              type: "success"
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    handleIdList(id, val) {
      let idList = _fStore.get(id);
      if (!val) {
        // 取值
        return idList || [];
      }
      if (idList) {
        idList.push(val);
      } else {
        idList = [val];
      }
      // 设置
      _fStore.set(id, idList);
    },
    hangUp() {
      if (this.vaildData("选择后再挂单吧~~")) {
        let id;
        if (this.activeOrderId) {
          id = this.activeOrderId;
        } else {
          id = +new Date() + ""; // 时间戳
          this.hangUpIdList.push(id);
          this.handleIdList("hangUpIdList", id); // 缓存挂单ID列表
        }
        _fStore.set(id, this.tableData, 3600); // 缓存当前ID挂单数据
        this.tableData = [];
        this.$message({
          message: "挂起成功，期待来结账哦!",
          type: "success"
        });
      }
    },
    switchTab(tab) {
      if (tab.name === "1") {
        // 现在挂单页签
        const tempList = [];
        const idList = [];
        this.hangUpIdList = this.hangUpIdList.filter(id => {
          let data = _fStore.get(id);
          if (data !== null) {
            tempList.push({ id, data });
          }
          return data;
        });
        _fStore.set("hangUpIdList", this.hangUpIdList); // 更新挂单ID列表
        this.hangUpData = tempList; // 更新挂单数据
      }
    },
    delHangList(id) {
      // 挂单页签-删除
      _fStore.del(id);
      let idList = _fStore.get("hangUpIdList");
      _fStore.set(
        "hangUpIdList",
        idList.filter(oldId => oldId !== id)
      );
      this.hangUpData = this.hangUpData.filter(data => data.id !== id);
    },
    subHangList(order) {
      // 挂单页签-结账
      if (this.tableData.length) {
        this.$message({
          message: "当前点餐商品还未处理完成!",
          type: "warning"
        });
      } else {
        this.tableData = order.data;
        this.activeOrderId = order.id; // 缓存挂单ID
        this.activeTab = "0";
      }
    }
  }
};
</script>
<style scoped lang="less">
.pos-order {
  background-color: #f9fafc;
  border-right: 1px solid #c0ccda;
}
.sum-btn {
  text-align: center;
  margin-top: 10px;
}
.often-goods {
  .title {
    height: 20px;
    border-bottom: 1px solid #d3dce6;
    background-color: #f9fafc;
    padding: 10px;
  }
  .often-goods-list ul li {
    list-style: none;
    float: left;
    border: 1px solid #e5e9f2;
    padding: 10px;
    margin: 5px;
    background-color: #fff;
  }
  .o-price {
    color: #58b7ff;
  }
}
.goods-type {
  clear: both;
}
.cookList {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  li {
    display: flex;
    width: 20%;
    min-width: 120px;
    height: auot;
    overflow: hidden;
    border: 1px solid #e5e9f2;
    background-color: #fff;
    padding: 2px;
    margin: 10px;
    span {
      display: block;
    }
    .rightCom{
      display: flex;  
      flex-direction: column;
    }
  }
}
.foodImg {
  width: 40%;
}
.foodName {
  max-width: 100px;
  font-size: 18px;
  padding-left: 10px;
  color: brown;
}
.foodPrice {
  font-size: 16px;
  padding-left: 10px;
  padding-top: 10px;
}
.tabList {
  display: flex;
      flex-wrap: wrap;
}
.el-card{
  margin: 10px;
}
.hang-card,
.head {
  display: flex;
  div {
    flex: 1;
    height: 30px;
    border-bottom: 1px solid #ccc;
    text-align: center;
  }
}
.head{
    background-color: #f0f0f0;

}
.hang-card {
  &:nth-of-type(2n) {
    background-color: tomato;
  }
}
.order-btn {
  text-align: center;
  padding-top: 10px;
}
</style>
