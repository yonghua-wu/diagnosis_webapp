<template>
  <div class="container">
    <Breadcrumb :items="['巡检中心', '远程巡检']" />
    <a-card>
      <a-spin :loading="loading" style="width: 100%">
        <div class="video-screenshot">
          <div class="filter">
            <!-- <a-form ref="filter-form" :model="filterData" :layout="'inline'"> -->
            <!-- <a-form-item label="巡检计划">
                <a-select v-model="filterData.planId" placeholder="请选择">
                  <a-option :value="undefined" label="全部待提交"></a-option>
                  <a-option :value="item.value" :label="item.label" v-for="(item, index) in planList" :key="index"></a-option>
                </a-select>
              </a-form-item> -->
            <!-- <a-form-item label="状态">
                <a-select v-model="filterData.status" placeholder="请选择">
                  <a-option :value="0" label="全部待提交"></a-option>
                  <a-option :value="1" label="人工待提交"></a-option>
                  <a-option :value="2" label="AI标记待提交"></a-option>
                </a-select>
              </a-form-item> -->
            <!-- <a-form-item label="时间范围">
                <a-date-picker
                  style="width: 100%"
                  v-model="filterData.datePicker"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </a-form-item> -->
            <a-form-item label="视图" style="width: 120px">
              <a-select v-model="size">
                <a-option :value="'16.66'" label="小"></a-option>
                <a-option :value="'25'" label="中"></a-option>
                <a-option :value="'33.33'" label="大"></a-option>
              </a-select>
            </a-form-item>
            <!-- </a-form> -->
            <a-button @click="load">刷新</a-button>
            <!-- <a-button @click="loadVbpgList">刷新</a-button> -->
          </div>
          <div class="list">
            <div class="card" v-for="(item, index) in list" :key="index" :style="`width: calc(${size}% - 10px);`">
              <!-- <div class="img" v-loading="item.imgUrls === undefined"> -->
              <div class="img">
                <div class="img-box" v-if="item.imgUrls !== undefined">
                  <OrderModalMark
                    v-if="item.type === 'vbpg'"
                    class="mark-img"
                    :img-key="index"
                    :isView="true"
                    :src="item.imgUrls[0].img"
                    :value="item.imgUrls[0].mark"
                  />
                  <a-image v-else :src="item.imgUrls[0].img" :preview-src-list="item.imgUrls.map((it) => it.img)"> </a-image>
                </div>
              </div>
              <div class="info">
                <div class="row">
                  <span style="font-size: 14px; color: #333">{{ item.config.name }}</span>
                </div>
                <div class="row">
                  <span>{{ item.eventType.name }}</span>
                </div>
                <div class="row">
                  <span>{{ formatDateTime(item.create_time) }}</span>
                </div>
                <div class="row">
                  <a-tag :color="item.color">
                    <span>{{ item.status }}</span>
                  </a-tag>
                </div>
                <div class="feature" v-if="item.imgUrls !== undefined">
                  <!-- <a-button type="primary" icon="el-icon-check" plain @click="() => normal(index)">一切正常</a-button> -->
                  <a-button type="primary" icon="el-icon-edit" @click="() => onProblem(index)">查看</a-button>
                  <!-- <a-button v-if="isView" type="primary" icon="el-icon-view" @click="() => onProblem(index)">查看</a-button> -->
                </div>
              </div>
            </div>
          </div>
          <a-pagination
            style="padding-top: 10px; text-align: right"
            @page-size-change="handleSizeChange"
            @change="handleCurrentChange"
            :total="pagination.total"
            :current="pagination.current"
            :page-sizes="[6, 12, 24, 48]"
            :page-size="pagination.size"
          />
          <OrderModal ref="order-modal" @loadData="load" />
        </div>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import OrderModal from "./components/OrderModal.vue";
import VbpgLog from "@/api/edge/vbpgLog";
import { decodeVBPG, formatDateTime } from "@/utils/utils";
import moment from "moment";
import EventType from "@/api/edge/eventType";
import PatrolPlan from "@/api/edge/patrolPlan";
import { defineComponent } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import OrderModalMark from "./components/OrderModalMark.vue";
export default defineComponent({
  name: "RemoteOperaiton",
  components: {
    OrderModal,
    Breadcrumb,
    OrderModalMark,
  },
  // filters: {
  //   statusFormat(v) {
  //     switch (v) {
  //       case 0:
  //         return "未提交";
  //       case -2:
  //         return "AI标记无问题";
  //       case 2:
  //         return "AI标记有问题";
  //     }
  //   },
  //   statusLeven(v) {
  //     switch (v) {
  //       case 0:
  //         return "info";
  //       case -2:
  //         return "success";
  //       case 2:
  //         return "";
  //     }
  //   },
  // },
  props: {
    isView: Boolean,
    vbpgIdList: Array,
    eventTypeId: String,
  },
  data() {
    return {
      eventTypeMap: {},
      list: [],
      size: "25",
      currentPage: 1,
      pageSize: 20,
      orderType: "全部",
      sensor: "全部",
      realtime: true,
      planList: [],
      filterData: {
        status: 0,
        datePicker: [],
        planId: undefined,
      },
      loading: false,
      pagination: {
        size: 12,
        current: 1,
        total: 12,
      },
    };
  },
  watch: {
    filterData: {
      handler: function () {
        console.log(this.filterData);
        this.pagination.current = 1;
        this.load();
      },
      deep: true,
    },
  },
  mounted() {
    this.loading = true;
    this.load();
    PatrolPlan.page(1, 10000)
      .then((res) => {
        this.planList = res.data.map((item) => {
          return {
            label: item.name,
            value: item.uuid,
          };
        });
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    formatDateTime: formatDateTime,
    statusFormat(v) {
      switch (v) {
        case 0:
          return "未提交";
        case -2:
          return "AI标记无问题";
        case 2:
          return "AI标记有问题";
      }
    },
    statusLeven(v) {
      switch (v) {
        case 0:
          return "orange";
        case -2:
          return "green";
        case 2:
          return "red";
      }
    },
    load() {
      this.loading = true;
      const filter = {};
      switch (this.filterData.status) {
        case 0:
          filter.status = [0, -2, 2];
          break;
        case 1:
          filter.status = [0];
          break;
        case 2:
          filter.status = [2, -2];
          break;
      }
      if (this.filterData.datePicker.length === 2) {
        filter.fromTime = Number(moment(this.filterData.datePicker[0]).format("x"));
        filter.toTime = Number(moment(this.filterData.datePicker[1]).format("x"));
      }
      filter.planId = this.filterData.planId;
      VbpgLog.page(this.pagination.current, this.pagination.size - 4, filter)
        .then((res) => {
          this.pagination.total = res.total;
          this.list = res.data.map((item) => {
            return {
              ...item,
              type: "vbpg",
              status: this.statusFormat(item.status),
              color: this.statusLeven(item.status),
              imgUrls: undefined,
              eventType: {},
            };
          });

          let promise = Promise.resolve();
          this.list.forEach((item) => {
            promise = promise.then(() => {
              if (this.eventTypeMap[this.eventTypeId || item.config.eventTypeId || item.config.event_type_id] !== undefined) {
                item.eventType = this.eventTypeMap[this.eventTypeId || item.config.eventTypeId || item.config.event_type_id];
                return Promise.resolve();
              } else {
                return EventType.findById(this.eventTypeId || item.config.eventTypeId || item.config.event_type_id).then((event) => {
                  this.eventTypeMap[event.uuid] = event;
                  // this.$set(this.eventTypeMap, event.uuid, event);
                  item.eventType = event;
                });
              }
            });
          });

          return Promise.all(
            this.list.map((item) => {
              return VbpgLog.staticVBPG(item.config.planId, item.fileName).then((res) => {
                if (JSON.stringify(item.judge_result) !== "{}") {
                  if (item.judge_type === "MANUAL") {
                    const areaResult = item.judge_result.manualResult?.area; // 手动标注
                    item.imgUrls = decodeVBPG(res).imgUrls.map((src, index) => {
                      return {
                        img: src,
                        mark:
                          areaResult[index].map((item) => {
                            item.markType = "MANUAL";
                            return item;
                          }) || [],
                      };
                    });
                  } else {
                    let areaResult = item.judge_result.aiResult; // ai标注
                    areaResult = areaResult?.map((area) => {
                      return area.result;
                    });
                    item.imgUrls = decodeVBPG(res).imgUrls.map((src, index) => {
                      return {
                        img: src,
                        mark:
                          areaResult[index].map((item) => {
                            item.markType = "AI";
                            return item;
                          }) || [],
                      };
                    });
                  }
                } else {
                  item.imgUrls = decodeVBPG(res).imgUrls.map((src) => {
                    return {
                      img: src,
                      mark: [],
                    };
                  });
                }
              });
            }),
          );
        })
        .then(() => {
          this.list.push({
            type: "img",
            status: "AI标记有问题",
            color: "red",
            imgUrls: [{ img: require("@/assets/TG_757686_1_1651018228295.jpg") }],
            eventType: {
              name: "电动车进电梯",
            },
            create_time: 1651018228295,
            config: {
              name: "A栋电梯摄像头",
            },
          });
          this.list.push({
            type: "img",
            status: "AI标记有问题",
            color: "red",
            imgUrls: [{ img: require("@/assets/TG_757686_1_1651029188899.jpg") }],
            eventType: {
              name: "电动车进电梯",
            },
            create_time: 1651029188899,
            config: {
              name: "A栋电梯摄像头",
            },
          });
          this.list.push({
            type: "img",
            status: "AI标记有问题",
            color: "red",
            imgUrls: [{ img: require("@/assets/gaokong1.png") }],
            eventType: {
              name: "高空抛物",
            },
            create_time: 1643529605298,
            config: {
              name: "A栋高抛摄像头（西）",
            },
          });
          this.list.push({
            type: "img",
            status: "AI标记有问题",
            color: "red",
            imgUrls: [{ img: require("@/assets/gaokong2.png") }],
            eventType: {
              name: "高空抛物",
            },
            create_time: 1643536806355,
            config: {
              name: "A栋高抛摄像头（东）",
            },
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onProblem(idx) {
      //
      this.$refs["order-modal"].open(this.list[idx]);
    },
    normal(idx) {
      this.loading = true;
      const data = this.list[idx];
      data.config.eventTypeId = this.list[idx].config.event_type_id;
      this.$refs["order-modal"]
        .getEventLog(this.list[idx])
        .then((eventLog) => {
          console.log(eventLog);
          if (eventLog.length > 0) {
            return this.$refs["order-modal"].noEvent(this.list[idx], eventLog[0]);
          } else {
            return this.$refs["order-modal"].noEvent(this.list[idx], null);
          }
        })
        .finally(() => {
          this.loading = false;
          // this.load();
        });
    },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.load();
    },
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.load();
    },
  },
});
</script>

<style scoped lang="less">
.video-screenshot {
  height: 100%;
  display: flex;
  flex-direction: column;
  .filter {
    min-height: 35px;
    margin: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    // .el-form {
    //   display: flex;
    //   flex-direction: row;
    //   align-items: center;
    //   .el-form-item {
    //     margin: 0px;
    //     .el-form-item__label {
    //       padding: 0px;
    //     }
    //   }
    // }
  }
  .list {
    overflow: auto;
    flex: 1;
    // border: 1px solid #ff0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    .card {
      overflow: hidden;
      margin: 5px;
      border: 1px solid var(--color-border-2);
      height: auto;
      // background-color: #f9f9f9;
      box-sizing: border-box;
      border-radius: 4px;
      position: relative;
      &:hover {
        // filter: blur(10px);
        // .img {
        //   .img-box {
        //     img {
        //     }
        //   }
        // }
        .info {
          .feature {
            opacity: 1;
          }
        }
      }
      .img {
        background-color: #ccc;
        width: 100%;
        height: 0px;
        padding-top: 56.25%;
        position: relative;
        // img {
        //   width: 100%;
        //   height: 100%;
        // }
        .img-box {
          position: absolute;
          top: 0px;
          left: 0px;
          right: 0px;
          bottom: 0px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          .mark-img {
            position: relative;
            width: 100%;
            height: 100%;
          }
          :deep(.arco-image-img) {
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
          }
        }
      }
      .info {
        padding: 8px;
        font-size: 12px;
        color: #999;
        position: relative;
        .row {
          padding: 4px 0px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-end;
          .left {
            display: flex;
            flex-direction: column;
          }
          .right {
            transition: all 0.2s;
            opacity: 0;
            // display: flex;
            flex-direction: column;
          }
        }
        .feature {
          transition: all 0.2s;
          opacity: 0;
          position: absolute;
          top: 0px;
          bottom: 0px;
          right: 0px;
          left: 0px;
          background-color: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
