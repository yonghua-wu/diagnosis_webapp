<template>
  <div class="order-modal">
    <a-modal title="事件详情" v-model:visible="showModal" width="1200px">
      <div class="dialog" v-if="form.config !== undefined && showModal">
        <a-form class="form-area" ref="form" :model="form" label-width="93px">
          <!-- <a-form-item label="区域"></a-form-item> -->
          <a-form-item label="截帧时间">{{ formatDateTime(form.create_time) }}</a-form-item>
          <a-form-item label="巡检计划">
            {{ planInfo.name }}
          </a-form-item>
          <a-form-item label="检查点">{{ form.config.name }}</a-form-item>
          <!-- <a-form-item label="事件处理人">
            {{ form.config.bind_user_name }}
          </a-form-item> -->
          <a-form-item label="事件">
            <span>
              {{ form.eventType.name }}
            </span>
          </a-form-item>
          <a-form-item label="描述">
            <span>{{ form.discription || "-" }}</span>
          </a-form-item>
        </a-form>
        <div class="mark-area">
          <div class="switch">
            <div
              :class="index === activeImgIndex ? 'item active' : 'item'"
              v-for="(item, index) in form.imgUrls"
              :key="index"
              @click="activeImgIndex = index"
            >
              <img :src="item.img" alt="" />
              <i class="el-icon-success mark" v-if="item.mark.length > 0"></i>
            </div>
          </div>
          <div class="img" v-if="showModal">
            <div class="item" v-for="(item, index) in form.imgUrls" :key="index">
              <OrderModalMark
                :key="index"
                class="mark"
                v-if="activeImgIndex === index"
                @update-rects="(e) => rectsUpdate(index, e)"
                :src="item.img"
                :value="item.mark"
              />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <a-button @click="close" :disabled="loading">取 消</a-button>
        <a-button @click="() => submitEvent(form)" :disabled="loading">提交事件</a-button>
        <a-button type="primary" @click="() => noEvent(form, eventLogData)" plain :disabled="loading">一切正常</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import OrderModalMark from "./OrderModalMark.vue";
import EventType from "@/api/edge/eventType";
import moment from "moment";
import EventLog from "@/api/edge/eventLog";
import VbpgLog from "@/api/edge/vbpgLog";
// import User from "@/api/user";
import PatroPlan from "@/api/edge/patrolPlan";
import { listToTree, formatDateTime } from "@/utils/utils";
import { defineComponent } from "vue";
const statusMap = {
  1: "人工提交事件",
  2: "AI提交事件",
  "-1": "人工关闭事件",
  "-2": "AI关闭事件",
};
export default defineComponent({
  // filters: {
  //   format(v) {
  //     return moment(v).format("yyyy-MM-DD HH:mm:ss");
  //   },
  // },
  components: {
    OrderModalMark,
  },
  data() {
    return {
      showModal: false,
      activeImgIndex: 0,
      form: {},
      vbpgLogs: [],
      eventLogData: null,
      loading: false,
      loadingLog: false,
      planInfo: {},
      eventTypeData: [],
    };
  },
  props: {
    isView: Boolean,
  },
  mounted() {
    EventType.page(1, 1000).then((res) => {
      const data = listToTree(
        res.data.map((d) => {
          return {
            ...d,
            id: d.uuid,
          };
        }),
        "pid",
        "uuid",
      );
      function handlerLeaf(d) {
        d.forEach((dd) => {
          if (dd.children.length !== 0) {
            handlerLeaf(dd.children);
            dd.leaf = false;
          } else {
            dd.leaf = true;
            delete dd.children;
          }
        });
      }
      handlerLeaf(data);
      this.eventTypeData = data;
    });
  },
  methods: {
    formatDateTime: formatDateTime,
    open(data) {
      this.showModal = true;
      this.form = JSON.parse(JSON.stringify(data));
      this.form.config.eventTypeId = this.form.config.eventTypeId || this.form.config.event_type_id;
      this.vbpgLogs = [];
      this.eventLogData = null;
      if (this.form.judge_result.manualResult) {
        this.form["discription"] = this.form.judge_result.manualResult.discription;
        // this.$set(this.form, "discription", this.form.judge_result.manualResult.discription);
      } else {
        this.form["discription"] = "";
        // this.$set(this.form, "discription", "");
      }
      this.loadingLog = true;
      PatroPlan.findById(this.form.config.planId).then((res) => {
        console.log(res);
        this.planInfo = res;
        // res.bind_user_uuid &&
        //   User.findById(res.bind_user_uuid).then((res) => {
        //     // this.form.config.bind_user_name = res.name;
        //     this.$set(this.form.config, "bind_user_name", res.name);
        //   });
      });
      this.getEventLog(this.form)
        .then((eventLog) => {
          if (eventLog.length > 0) {
            this.eventLogData = eventLog[0];
            return Promise.all(
              eventLog[0].vbpg_ids.map((id) => {
                return VbpgLog.findById(id).then((res) => {
                  this.vbpgLogs.push({
                    ...res,
                    discription: res.judge_result.manualResult?.discription,
                    updateTime: moment(res.update_time).format("YYY-MM-DD HH:mm:ss"),
                    statusText: statusMap[res.status],
                  });
                });
              }),
            ).then(() => {
              this.loadingLog = false;
              this.vbpgLogs.sort((a, b) => b.update_time - a.update_time);
            });
          } else {
            return Promise.resolve();
          }
        })
        .finally(() => {
          this.loadingLog = false;
        });
    },
    close() {
      this.showModal = false;
    },
    rectsUpdate(index, e) {
      this.form.imgUrls[index].mark = e;
    },
    onChangeEventType() {
      // const eventTypeId = this.form.eventType
      this.$nextTick().then(() => {
        this.loadingLog = true;
        this.vbpgLogs = [];
        this.getEventLog(this.form)
          .then((eventLog) => {
            if (eventLog.length > 0) {
              this.eventLogData = eventLog[0];
              return Promise.all(
                eventLog[0].vbpg_ids.map((id) => {
                  return VbpgLog.findById(id).then((res) => {
                    this.vbpgLogs.push({
                      ...res,
                      discription: res.judge_result.manualResult?.discription,
                      updateTime: moment(res.update_time).format("YYY-MM-DD HH:mm:ss"),
                      statusText: statusMap[res.status],
                    });
                  });
                }),
              ).then(() => {
                this.loadingLog = false;
                this.vbpgLogs.sort((a, b) => b.update_time - a.update_time);
              });
            } else {
              return Promise.resolve();
            }
          })
          .finally(() => {
            this.loadingLog = false;
          });
      });
    },
    getEventLog(data) {
      return EventLog.page(1, 1, {
        watcher_id: data.config.uuid,
        plan_id: data.plan_id,
        event_type_id: data.config.eventTypeId,
        status: 1,
      }).then((log) => {
        return log.data;
      });
    },
    noEvent(vbpgData, eventLog) {
      // 一切正常
      this.loading = true;
      let promise;
      if (eventLog !== null) {
        // 关闭事件
        const eventLogData = {
          ...eventLog,
          status: 0,
          vbpg_ids: [...eventLog.vbpg_ids, vbpgData.uuid],
          bind_user_uuid: this.planInfo.bind_user_uuid,
        };
        promise = EventLog.update(eventLogData);
      } else {
        // 正常
        promise = Promise.resolve();
      }
      return promise
        .then(() => {
          return VbpgLog.update({
            judge_result: {
              ...vbpgData.judge_result,
              manualResult: {
                discription: vbpgData.discription,
                area: vbpgData.imgUrls.map((d) => d.mark),
              },
            },
            status: -1,
            uuid: vbpgData.uuid,
            event: eventLog !== null ? true : false,
          }).then(() => {
            this.$message.success("提交成功");
            this.close();
            this.$emit("loadData");
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    submitEvent(event) {
      // 提交事件
      this.loading = true;
      let promise;
      if (this.vbpgLogs.length > 0) {
        // 更新事件
        const eventLogData = {
          ...this.eventLogData,
          vbpg_ids: [...this.eventLogData.vbpg_ids, event.uuid],
          bind_user_uuid: this.planInfo.bind_user_uuid,
        };
        promise = EventLog.update(eventLogData);
      } else {
        // 创建事件
        const eventLogData = {
          space_id: event.space_id,
          plan_id: event.plan_id,
          watcher_id: event.config.uuid,
          status: 1,
          vbpg_ids: [event.uuid],
          judge_type: "MANUAL",
          event_type_id: this.form.config.eventTypeId,
          bind_user_uuid: this.planInfo.bind_user_uuid,
        };
        promise = EventLog.add(eventLogData);
      }
      promise
        .then(() => {
          return VbpgLog.update({
            judge_result: {
              ...this.form.judge_result,
              manualResult: {
                discription: this.form.discription,
                area: this.form.imgUrls.map((d) => d.mark),
              },
            },
            config: {
              ...this.form.config,
              eventTypeId: this.form.config.eventTypeId,
            },
            status: 1,
            // status: this.form.config.event_type_id === this.form.config.eventTypeId ? 1 : this.form.status,
            uuid: this.form.uuid,
            event: true,
          }).then(() => {
            this.$message.success("提交成功");
            this.close();
            this.$emit("loadData");
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
</script>

<style lang="less">
.order-modal {
}
.dialog {
  display: flex;
  flex-direction: row;
  .form-area {
    width: 40%;
    padding-right: 12px;
    .log {
      display: flex;
      flex-direction: row;
      .title {
        width: 80px;
        text-align: right;
        padding-right: 12px;
        margin-bottom: 12px;
        box-sizing: border-box;
      }
    }
  }
  .mark-area {
    width: 60%;
    display: flex;
    flex-direction: column;
    .switch {
      margin-bottom: 12px;
      display: flex;
      flex-direction: row;
      .item {
        height: 80px;
        width: 150px;
        margin-right: 12px;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid rgba(0, 0, 0, 0);
        position: relative;
        img {
          height: 100%;
          width: 100%;
        }
        .mark {
          color: rgb(var(--primary-6));
          position: absolute;
          bottom: 6px;
          right: 6px;
          font-size: 20px;
        }
      }
      .active {
        border: 1px solid rgb(var(--primary-6));
      }
    }
  }
}
</style>
