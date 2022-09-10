<template>
  <div class="board-index container" ref="refBoardIndex" id="board-index">
    <Breadcrumb :items="['统计看板']" />
    <a-spin :loading="loading" style="width: 100%">
      <a-row :gutter="[8, 8]">
        <a-col :span="24">
          <a-row :gutter="8">
            <a-col :span="24">
              <div class="title card">
                <div class="title-text">工单状态统计</div>
                <div class="title-desc">工单状态统计展示当日工单各项关键数据统计及过去7天完成率趋势</div>
              </div>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="[8, 8]" class="overview-data">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="12" class="rate">
              <a-row :gutter="[8, 8]">
                <a-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" :xxl="6">
                  <div class="item card">
                    <div class="title">客户缴费率</div>
                    <div class="rate">
                      <div class="rate-number">{{ todayData?.customerPayRate || 0 }}%</div>
                      <div class="percent">
                        <div style="height: 100%; width: 100%" ref="refCustomerPayRate"></div>
                      </div>
                    </div>
                  </div>
                </a-col>
                <a-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" :xxl="6">
                  <div class="item card">
                    <div class="title">对客工单完成率</div>
                    <div class="rate">
                      <div class="rate-number">{{ todayData?.toCustomerRate || 0 }}%</div>
                      <div class="percent">
                        <div style="height: 100%; width: 100%" ref="refToCustomerRate"></div>
                      </div>
                    </div>
                  </div>
                </a-col>
                <a-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" :xxl="6">
                  <div class="item card">
                    <div class="title">非对客工单完成率</div>
                    <div class="rate">
                      <div class="rate-number">{{ todayData?.nonToCustomerRate || 0 }}%</div>
                      <div class="percent">
                        <div style="height: 100%; width: 100%" ref="refNonToCustomerRate"></div>
                      </div>
                    </div>
                  </div>
                </a-col>
                <a-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" :xxl="6">
                  <div class="item card">
                    <div class="title">工单超时率</div>
                    <div class="rate">
                      <div class="rate-number">{{ todayData?.overtimeRate || 0 }}%</div>
                      <div class="percent">
                        <div style="height: 100%; width: 100%" ref="refOvertimeRate"></div>
                      </div>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="12">
              <div class="today card">
                <a-row>
                  <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" :xxl="8" class="item">
                    <div class="main-data">
                      <div class="data">
                        总接单数：<span>{{ todayData?.acceptTotal || 0 }}</span>
                      </div>
                    </div>
                    <div class="secondary-data">
                      <div class="data">
                        对客：<span>{{ todayData?.toCustomersAcceptTotal || 0 }}</span>
                      </div>
                      <div class="data">
                        非对客：<span>{{ todayData?.nonCustomersAcceptTotal || 0 }}</span>
                      </div>
                    </div>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" :xxl="8" class="item">
                    <div class="main-data">
                      <div class="data">
                        处理中工单：<span>{{ todayData?.process || 0 }}</span>
                      </div>
                    </div>
                    <div class="secondary-data">
                      <div class="data">
                        对客：<span>{{ todayData?.toCustomerProcess || 0 }}</span>
                      </div>
                      <div class="data">
                        非对客：<span>{{ todayData?.nonToCustomerProcess || 0 }}</span>
                      </div>
                    </div>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" :xxl="8" class="item">
                    <div class="main-data">
                      <div class="data">
                        响应率：<span>{{ (todayData?.respRate || 0) + "%" }}</span>
                      </div>
                    </div>
                    <div class="secondary-data">
                      <div class="data">
                        对客：<span>{{ (todayData?.toCustomerRespRate || 0) + "%" }}</span>
                      </div>
                      <div class="data">
                        非对客：<span>{{ (todayData?.nonToCustomerRespRate || 0) + "%" }}</span>
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="[8, 8]" class="table-chart">
            <a-col :xs="24" :sm="24" :md="24" :lg="17" :xl="17" :xxl="17">
              <div class="table-line">
                <div class="line card" style="margin-bottom: 8px">
                  <div class="title">
                    <div class="title-text">
                      <div class="text">各业务完成率趋势（近7天）</div>
                    </div>
                    <div class="label">
                      <div class="item" :style="'border-color: ' + colors[index]" v-for="(item, index) in serviceClassData" :key="index">
                        {{ item.serviceName }}
                      </div>
                    </div>
                  </div>
                  <div class="line-chart">
                    <div class="content" id="LineChart" ref="refLineChart"></div>
                  </div>
                </div>
                <div class="card">
                  <a-table style="width: 100%" :columns="tableColumns" :data="tableData" :pagination="false" :scroll="{ x: 780 }" />
                </div>
              </div>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="7" :xl="7" :xxl="7" class="table-pie">
              <div class="pie card">
                <div class="title-text">
                  <div class="text">各业务当日工单总量占比</div>
                </div>
                <div class="pie-chart">
                  <div id="PieChart" ref="refPieChart"></div>
                </div>
                <div class="pie-data">
                  <a-table :columns="pieTableColumns" :data="serviceClassData" :pagination="false" />
                </div>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import * as echarts from "echarts";
import { useResizeObserver } from "@vueuse/core";
import Ticket from "@/api/tenant/Ticket";
import { TableColumnData } from "@arco-design/web-vue";

const colors = ["#b6a2de", "#d87a80", "#07a2a4", "#ffb980", "#0065b1"];

const lineOption: any = {
  color: [...colors, "#888888"],
  tooltip: {
    trigger: "axis",
    showContent: true,
    valueFormatter: (v: number) => v + "%",
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["--", "--", "--", "--", "--", "--", "--"],
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%",
    },
  },
  series: [
    {
      name: "客服",
      type: "line",
      smooth: true,
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "秩序",
      type: "line",
      smooth: true,
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "环境",
      type: "line",
      smooth: true,
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "机电",
      type: "line",
      smooth: true,
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "管理",
      type: "line",
      smooth: true,
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "水平线",
      type: "line",
      markLine: {
        data: [
          {
            name: "水平线",
            yAxis: 50,
          },
        ],
      },
    },
  ],
};

const pieOption: any = {
  color: colors,
  tooltip: {
    trigger: "item",
  },
  title: {
    text: "",
    subtext: "当日工单总量",
    left: "center",
    top: "center",
    textStyle: {
      fontSize: 30,
      lineHeight: 35,
      height: 35,
    },
    subtextStyle: {
      fontSize: 12,
    },
    itemGap: 0,
  },
  series: [
    {
      name: "工单量",
      type: "pie",
      radius: ["40%", "60%"],
      itemStyle: {
        borderRadius: 6,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        fontSize: 12,
      },
      data: [],
    },
  ],
};

const miniPieOption: any = {
  color: ["#0065b1", "#c9cdd4"],
  series: [
    {
      hoverAnimation: false,
      name: "Access From",
      type: "pie",
      radius: ["65%", "95%"],
      avoidLabelOverlap: false,
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
};

const tableColumns: TableColumnData[] = [
  {
    dataIndex: "0",
    title: "客服",
  },
  {
    dataIndex: "1",
    title: "秩序",
  },
  {
    dataIndex: "2",
    title: "环境",
  },
  {
    dataIndex: "3",
    title: "机电",
  },
  {
    dataIndex: "4",
    title: "管理",
  },
];

const pieTableColumns: TableColumnData[] = [
  {
    dataIndex: "serviceName",
    title: "业务",
  },
  {
    dataIndex: "total",
    title: "总工单量",
  },
  {
    dataIndex: "proportion",
    title: "占比",
  },
];

export default defineComponent({
  name: "board-index",
  components: {
    Breadcrumb,
  },
  setup() {
    //
    const refCustomerPayRate = ref();
    const refToCustomerRate = ref();
    const refNonToCustomerRate = ref();
    const refOvertimeRate = ref();
    const refLineChart = ref();
    const refPieChart = ref();
    const myCharts: any = {
      customerPayRate: null,
      toCustomerRate: null,
      nonToCustomerRate: null,
      overtimeRate: null,
      lineChart: null,
      pieChart: null,
    };
    const echartInit = () => {
      myCharts.customerPayRate = echarts.init(refCustomerPayRate.value);
      myCharts.toCustomerRate = echarts.init(refToCustomerRate.value);
      myCharts.nonToCustomerRate = echarts.init(refNonToCustomerRate.value);
      myCharts.overtimeRate = echarts.init(refOvertimeRate.value);
      myCharts.lineChart = echarts.init(refLineChart.value);
      myCharts.pieChart = echarts.init(refPieChart.value);
      myCharts.customerPayRate.setOption(miniPieOption);
      myCharts.toCustomerRate.setOption(miniPieOption);
      myCharts.nonToCustomerRate.setOption(miniPieOption);
      myCharts.overtimeRate.setOption(miniPieOption);
      myCharts.lineChart.setOption(lineOption);
      myCharts.pieChart.setOption(pieOption);
    };
    const serviceClassData = ref<any[]>([
      {
        serviceName: "客服",
        total: 0,
        acceptTotal: 0,
        fails: 0,
        process: 0,
        respRate: 0,
        proportion: 0,
      },
      {
        serviceName: "秩序",
        total: 0,
        acceptTotal: 0,
        fails: 0,
        process: 0,
        respRate: 0,
        proportion: 0,
      },
      {
        serviceName: "环境",
        total: 0,
        acceptTotal: 0,
        fails: 0,
        process: 0,
        respRate: 0,
        proportion: 0,
      },
      {
        serviceName: "机电",
        total: 0,
        acceptTotal: 0,
        fails: 0,
        process: 0,
        respRate: 0,
        proportion: 0,
      },
      {
        serviceName: "管理",
        total: 0,
        acceptTotal: 0,
        fails: 0,
        process: 0,
        respRate: 0,
        proportion: 0,
      },
    ]);
    const serviceClassMap: any = {
      4: 0,
      1: 1,
      2: 2,
      3: 3,
      5: 4,
    };

    const setChartData = (
      customerPayRate: number,
      toCustomerRate: number,
      nonToCustomerRate: number,
      overtimeRate: number,
      lineData: any[],
      pieData: any[],
    ) => {
      //
      myCharts.customerPayRate?.setOption({
        series: [
          {
            data: [{ value: customerPayRate }, { value: 100 - customerPayRate }],
          },
        ],
      });
      myCharts.toCustomerRate?.setOption({
        series: [
          {
            data: [{ value: toCustomerRate }, { value: 100 - toCustomerRate }],
          },
        ],
      });
      myCharts.nonToCustomerRate?.setOption({
        series: [
          {
            data: [{ value: nonToCustomerRate }, { value: 100 - nonToCustomerRate }],
          },
        ],
      });
      myCharts.overtimeRate?.setOption({
        series: [
          {
            data: [{ value: overtimeRate }, { value: 100 - overtimeRate }],
          },
        ],
      });
      const k = Object.keys(serviceClassMap);
      let sum = 0;
      let count = 0;
      lineData.forEach((d) => {
        d.diagrams.forEach((dd: any) => {
          sum += dd.commitRate;
          count++;
        });
      });
      let average = sum / count;
      myCharts.lineChart?.setOption({
        xAxis: {
          data: lineData[0].diagrams.map((item: any) => item.serviceDate),
        },
        series: [
          ...lineData
            .sort((a: any, b: any) => {
              return k.indexOf(a.serviceClass) - k.indexOf(b.serviceClass);
            })
            .map((item) => {
              return {
                name: item.serviceName,
                data: item.diagrams.map((d: any) => d.commitRate),
              };
            }),
          {
            markLine: {
              data: [
                {
                  name: "平均",
                  yAxis: parseInt(String(average)),
                  label: {
                    formatter: "{b}：{c}%",
                    position: "insideStartTop",
                  },
                },
              ],
            },
          },
        ],
      });
      let totalSum = 0;
      serviceClassData.value.forEach((item: any) => {
        totalSum += item.total;
      });
      myCharts.pieChart?.setOption({
        title: {
          text: totalSum,
        },
        series: [
          {
            data: pieData,
          },
        ],
      });
    };
    const tableData = computed(() => {
      return [
        [
          "总接单量: " + +serviceClassData.value[0].acceptTotal,
          "总接单量: " + +serviceClassData.value[1].acceptTotal,
          "总接单量: " + +serviceClassData.value[2].acceptTotal,
          "总接单量: " + +serviceClassData.value[3].acceptTotal,
          "总接单量: " + serviceClassData.value[4].acceptTotal,
        ],
        [
          "抽查未通过工单: " + +serviceClassData.value[0].fails,
          "抽查未通过工单: " + +serviceClassData.value[1].fails,
          "抽查未通过工单: " + +serviceClassData.value[2].fails,
          "抽查未通过工单: " + +serviceClassData.value[3].fails,
          "抽查未通过工单: " + serviceClassData.value[4].fails,
        ],
        [
          "处理中工单量: " + +serviceClassData.value[0].process,
          "处理中工单量: " + +serviceClassData.value[1].process,
          "处理中工单量: " + +serviceClassData.value[2].process,
          "处理中工单量: " + +serviceClassData.value[3].process,
          "处理中工单量: " + serviceClassData.value[4].process,
        ],
        [
          "响应率: " + +serviceClassData.value[0].respRate + "%",
          "响应率: " + +serviceClassData.value[1].respRate + "%",
          "响应率: " + +serviceClassData.value[2].respRate + "%",
          "响应率: " + +serviceClassData.value[3].respRate + "%",
          "响应率: " + serviceClassData.value[4].respRate + "%",
        ],
      ];
    });
    const todayData = ref<any>({});
    const loading = ref(false);
    const loadData = () => {
      loading.value = true;
      Ticket.getTicketBoard()
        .then((res) => {
          console.log("board res", res);
          res.serviceClassBoardVos.forEach((item: any) => {
            if (serviceClassMap[item.serviceClass] !== undefined) {
              serviceClassData.value[serviceClassMap[item.serviceClass]].total = item?.total || 0;
              serviceClassData.value[serviceClassMap[item.serviceClass]].acceptTotal = item?.acceptTotal || 0;
              serviceClassData.value[serviceClassMap[item.serviceClass]].fails = item?.fails || 0;
              serviceClassData.value[serviceClassMap[item.serviceClass]].process = item?.process || 0;
              serviceClassData.value[serviceClassMap[item.serviceClass]].respRate = item?.respRate || 0;
            }
          });
          let sum = 0;
          serviceClassData.value.forEach((item) => {
            sum += item.total || 0;
          });
          console.log(sum);
          serviceClassData.value.forEach((item: any) => {
            item.proportion = sum === 0 ? 0 : parseInt(String((item.total / sum) * 100));
            item.proportion = item.proportion + "%";
          });
          todayData.value = res.totalBoard;
          setChartData(
            res.totalBoard?.customerPayRate || 0,
            res.totalBoard?.toCustomerRate || 0,
            res.totalBoard?.nonToCustomerRate || 0,
            res.totalBoard?.overtimeRate || 0,
            res.diagrams,
            serviceClassData.value.map((item: any) => {
              return {
                value: item.total,
                name: item.serviceName,
              };
            }),
          );
        })
        .finally(() => {
          loading.value = false;
        });
    };
    onMounted(() => {
      echartInit();
      loadData();
    });
    const refBoardIndex = ref();
    const resizeObs = useResizeObserver(refBoardIndex, () => {
      myCharts.customerPayRate?.resize();
      myCharts.toCustomerRate?.resize();
      myCharts.nonToCustomerRate?.resize();
      myCharts.overtimeRate?.resize();
      myCharts.lineChart?.resize();
      myCharts.pieChart?.resize();
    });
    onBeforeUnmount(() => {
      resizeObs.stop();
    });
    return {
      loading,
      refBoardIndex,
      refCustomerPayRate,
      refToCustomerRate,
      refNonToCustomerRate,
      refOvertimeRate,
      refLineChart,
      refPieChart,
      serviceClassData,
      todayData,
      tableColumns,
      tableData,
      pieTableColumns,
      colors,
    };
  },
});
</script>

<style lang="less" scoped>
.board-index {
  .card {
    border: 1px solid var(--color-neutral-3);
    border-radius: var(--border-radius-small);
    background: var(--color-bg-2);
    padding: 16px;
  }
  .title {
    // background-image: url("~@/assets/Data_analyst_Flatline.svg");
    // background-size: 120px 120px;
    // background-position: bottom right;
    // background-repeat: no-repeat;
    .title-text {
      font-size: 24px;
      color: var(--color-text-1);
    }
    .title-desc {
      color: var(--color-text-3);
      margin-top: 8px;
    }
  }
  .overview-data {
    color: var(--color-text-1);
    .rate {
      .item {
        display: flex;
        flex-direction: column;
        .title {
          background-image: unset;
          font-weight: bold;
        }
        .rate {
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          .rate-number {
            flex: 1;
            font-size: 20px;
          }
          .percent {
            height: 40px;
            width: 40px;
          }
        }
      }
    }
    .today {
      color: var(--color-text-1);
      // height: 90px;
      .item {
        // padding: 4px 0px;
        box-sizing: border-box;
        border: 0px;
        border-right: 1px solid var(--color-border-2);
        height: 56px;
        &:last-child {
          border-right: 0px;
        }
        .main-data {
          padding: 4px 8px;
          width: 100%;
          margin-bottom: 4px;
          font-size: 16px;
          text-align: center;
          .data {
            width: 100%;
            text-align: center;
          }
        }
        .secondary-data {
          display: flex;
          flex-direction: row;
          .data {
            padding: 4px 8px;
            // border: 1px solid var(--color-neutral-3);
            flex: 1;
            text-align: center;
            white-space: nowrap;
            &:first-child {
              margin-right: 4px;
            }
          }
        }
      }
      @media screen and (max-width: 767px) {
        .item {
          border: 0px;
          border-bottom: 1px solid var(--color-border-2);
          margin-bottom: 8px;
          padding-bottom: 8px;
          height: unset;
          &:last-child {
            padding-bottom: 0px;
            margin-bottom: 0px;
            border-bottom: 0px;
          }
        }
      }
    }
  }
  .table-chart {
    .table-line {
      .line {
        display: flex;
        flex-direction: column;
        color: var(--color-text-1);
        .title {
          display: flex;
          flex-direction: row;
          align-items: center;
          background-image: unset;
          .title-text {
            flex: 1;
            font-size: 20px;
          }
          .label {
            display: flex;
            flex-direction: row;
            .item {
              margin-right: 6px;
              padding: 6px 8px;
              border-bottom: 3px solid #ccc;
            }
          }
        }
        .line-chart {
          position: relative;
          padding-bottom: 35%;
          height: 0px;
          .content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
        @media screen and (max-width: 767px) {
          .line-chart {
            padding-bottom: 80%;
          }
          .title {
            background-image: unset;
            flex-direction: column;
          }
        }
      }
    }
    .table-pie {
      .pie {
        .title-text {
          flex: 1;
          font-size: 20px;
          height: 31px;
          line-height: 31px;
          color: var(--color-text-1);
        }
        .pie-chart {
          position: relative;
          padding-bottom: calc(81% + 40px);
          height: 0px;
          div {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
