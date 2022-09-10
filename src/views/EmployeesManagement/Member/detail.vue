<template>
  <div class="detail-member container">
    <Breadcrumb :items="['员工管理', { name: '成员管理', router: () => $router.replace({ name: 'EmployeesMember' }) }, pageModelName]" />
    <a-spin :loading="loading || buttonLoading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <a-form
          ref="refForm"
          :model="formData"
          @submit="clickSave"
          :label-col-props="{ span: 8 }"
          :wrapper-col-props="{ span: 16 }"
          :disabled="pageModel === 'View'"
          style="max-width: 1500px"
        >
          <a-space direction="vertical" fill>
            <a-space direction="vertical" fill>
              <a-row class="section-title">基本信息</a-row>
              <a-row class="section-body" :gutter="24">
                <a-col :span="8">
                  <a-form-item
                    field="name"
                    :rules="rules.name"
                    :disabled="pageModel === 'View' || pageModel === 'Edit'"
                    label="姓名"
                    :row-props="{ gutter: 24 }"
                  >
                    <a-input :max-length="50" v-model="formData.name" placeholder="请输入姓名" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :rules="rules.icType"
                    field="icType"
                    :disabled="pageModel === 'View' || pageModel === 'Edit'"
                    label="证件类型"
                    :row-props="{ gutter: 24 }"
                  >
                    <a-select :default-value="1" v-model="formData.icType" placeholder="请选择证件类型">
                      <a-option :label="'身份证'" :value="1"></a-option>
                      <a-option :label="'护照'" :value="2"></a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8" v-if="formData.icType === 1">
                  <a-form-item
                    field="ic"
                    :rules="rules.ic"
                    :disabled="pageModel === 'View' || pageModel === 'Edit'"
                    label="证件号码"
                    :row-props="{ gutter: 24 }"
                  >
                    <a-input :max-length="20" v-model="formData.ic" placeholder="请输入证件号码" />
                  </a-form-item>
                </a-col>
                <a-col :span="8" v-else>
                  <a-form-item
                    field="ic"
                    :rules="rules.ic2"
                    :disabled="pageModel === 'View' || pageModel === 'Edit'"
                    label="证件号码"
                    :row-props="{ gutter: 24 }"
                  >
                    <a-input :max-length="20" v-model="formData.ic" placeholder="请输入证件号码" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    field="gender"
                    :rules="rules.gender"
                    :disabled="pageModel === 'View' || pageModel === 'Edit'"
                    label="性别"
                    :row-props="{ gutter: 24 }"
                  >
                    <a-select v-model="formData.gender" placeholder="请选择性别">
                      <a-option :label="'男'" :value="1"></a-option>
                      <a-option :label="'女'" :value="2"></a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    field="dob"
                    :rules="rules.dob"
                    :disabled="pageModel === 'View' || pageModel === 'Edit'"
                    label="出生日期"
                    :row-props="{ gutter: 24 }"
                  >
                    <a-date-picker
                      :value-format="'YYYY-MM-DD HH:mm:ss'"
                      v-model="formData.dob"
                      :disabledDate="(current: Date) => moment(current).isAfter(moment())"
                      placeholder="请选择出生日期"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-space>
            <a-space direction="vertical" fill>
              <a-row class="section-title">工作信息</a-row>
              <a-row class="section-body" :gutter="24">
                <a-col :span="8">
                  <a-form-item :rules="rules.empNo" field="empNo" label="工号" :row-props="{ gutter: 24 }">
                    <a-input :max-length="20" v-model="formData.empNo" placeholder="请输入工号" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    field="staffBlockId"
                    :rules="rules.staffBlockId"
                    label="所在项目"
                    :row-props="{ gutter: 24 }"
                    :disabled="pageModel === 'View' || (isMasterEnv && pageModel === 'Edit')"
                  >
                    <a-select v-model="formData.staffBlockId" :options="blockOptions" :loading="blockOptionsLoading" placeholder="请选择所在项目" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="phone" :rules="rules.phone" label="手机号" :row-props="{ gutter: 24 }">
                    <a-input :max-length="11" v-model="formData.phone" placeholder="请输入手机号" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    field="serviceClass"
                    :rules="rules.serviceClass"
                    label="业务"
                    :row-props="{ gutter: 24 }"
                    :disabled="pageModel === 'View' || (isMasterEnv && pageModel === 'Edit')"
                  >
                    <a-select v-model="formData.serviceClass" placeholder="请选择业务">
                      <a-option
                        :label="serviceClassMap[key].label"
                        :value="Number(key)"
                        :key="index"
                        v-for="(key, index) in Object.keys(serviceClassMap)"
                      ></a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="craft" :rules="rules.craft" label="角色" :row-props="{ gutter: 24 }">
                    <a-select v-model="formData.craft" placeholder="请选择角色">
                      <a-option :label="'员工'" :value="1"></a-option>
                      <a-option :label="'主管'" :value="2"></a-option>
                      <a-option :label="'经理'" :value="3"></a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="title" :rules="rules.title" label="职称" :row-props="{ gutter: 24 }">
                    <a-input :max-length="50" v-model="formData.title" placeholder="请输入职称" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="startDate" :rules="rules.startDate" label="入职时间" :row-props="{ gutter: 24 }">
                    <a-date-picker :value-format="'YYYY-MM-DD HH:mm:ss'" v-model="formData.startDate" placeholder="请输入入职时间" />
                  </a-form-item>
                </a-col>
                <a-col :span="8" v-if="pageModel !== 'Add'">
                  <a-form-item field="state" :rules="rules.state" label="状态" :row-props="{ gutter: 24 }">
                    <a-select v-model="formData.state" placeholder="请选择状态">
                      <a-option
                        :label="staffStateMap[key]"
                        :value="Number(key)"
                        :key="index"
                        v-for="(key, index) in Object.keys(staffStateMap)"
                      ></a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-space>
            <a-row :gutter="24" v-if="pageModel != 'View'">
              <a-col :span="8">
                <a-form-item>
                  <a-space>
                    <a-button html-type="submit" type="primary">保存</a-button>
                    <a-button @click="saveAndAdd" type="text" v-if="pageModel === 'Add'">保存并继续添加</a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-space>
        </a-form>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, reactive, ref, watch } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { useRoute, useRouter } from "vue-router";
import { useStartStopWatch } from "@/hooks/use";
import CUVue, { useDetailPage } from "@/components/lib/CU";
import Staff, { CreateStaffModel } from "@/api/tenant/Staff";
import { useAppStore } from "@/store";
import Message from "@/utils/Message";
import RulesLib from "@/utils/RulesLib";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import Block, { BlockModel } from "@/api/tenant/Block";
import moment from "moment";
import { deepClone, generatorAvator } from "@/utils/utils";
import TencentCos from "@/utils/tencentCos";
import COS from "cos-js-sdk-v5";
const staffStateMap: any = {
  1: "在职",
  3: "离职",
};
const isMasterEnv = process.env.VUE_APP_SF_TENANT_BASE_URL === "https://saas-gateway.seeingflow.com";
console.log(isMasterEnv);
export default defineComponent({
  name: "detail-member",
  components: {
    Breadcrumb,
    CUVue,
  },
  setup() {
    const formData = ref<any>({
      //月补贴
      allowenceMth: null,
      //银行卡号
      bankAccount: "",
      //小区id
      staffBlockId: "",
      //年终奖
      bonusAnnual: null,
      //月固定奖金
      bonusMth: null,
      //合约文件
      contraceFile: "",
      //合约到期日
      contractEnd: "",
      //工种类型 1 员工 2 主管
      craft: 1,
      //创建操作人
      createdBy: "",
      //创建操作人ID
      createdId: "",
      //创建时间
      createdTime: "",
      //部门id
      deptId: "",
      //部门名称
      deptName: "",
      //生日
      dob: "",
      //性别
      gender: 1,
      //薪级 1 2
      grade: 1,
      //身份证号
      ic: "",
      //头像
      icon: "",
      //等级
      level: null,
      //员工名称
      name: "",
      //手机号
      phone: "",
      //手机deviceId
      phoneDeviceId: "",
      //手机类型 1 Android 2 IOS
      phoneType: null,
      //备注
      remark: "",
      //时薪
      salaryHour: null,
      //月薪
      salaryMth: null,
      //工种服务类型 1 秩序 2 环境 3 机电 4 客服 5 管理
      serviceClass: 1,
      //员工id
      staffId: "",
      //入职日期
      startDate: "",
      //员工状态 1 在岗 2 休假 3 离职
      state: 1,
      //职称 1 2
      title: "",
      //更新操作人
      updatedBy: "",
      //更新操作人ID
      updatedId: "",
      //更新时间
      updatedTime: "",
      //1 在班状态可接单 2 不在班不可接单
      workStatus: 1,
      //月工作天数
      workingDays: null,
      //合约每日工时
      workingHour: null,
      icType: 1,
    });
    const rules = {
      name: new RulesLib().required("请输入员工姓名").maxLength(50).minLength(2).done(),
      icType: new RulesLib().required("请选择证件类型").done(),
      ic: new RulesLib().required("请输入证件号码").length(18).idCard().done(),
      ic2: new RulesLib()
        .required("请输入证件号码")
        .match(/^[a-z0-9A-Z]+$/, "只能由数字和字母组成")
        .done(),
      gender: new RulesLib().required("请选择性别").done(),
      dob: new RulesLib().done(),
      empNo: new RulesLib()
        .required("请输入工号")
        .match(/^[a-z0-9A-Z]+$/, "工号只能由数字和字母组成")
        .done(),
      staffBlockId: new RulesLib().required("请选择所在项目").done(),
      phone: new RulesLib().required("请输入手机号").length(11).phone().done(),
      serviceClass: new RulesLib().required("请选择服务类型").done(),
      craft: new RulesLib().required("请选择工种类型").done(),
      title: new RulesLib().required("请输入职称").done(),
      startDate: new RulesLib().required("请选择入职日期").done(),
      state: new RulesLib().required("请选择员工状态").done(),
    };
    const showModalTips = ref(false);

    const appStore = useAppStore();
    const serviceClassMap = computed(() => {
      return appStore.serviceClassMap as any;
    });

    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });
    const route = useRoute();
    const router = useRouter();

    const { pageModel, pageModelName } = useDetailPage();
    const loading = ref(false);
    const detailInfo = ref<any>({});
    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
      Staff.detail(route.params.id as string)
        .then((res) => {
          formData.value = res;
          formData.value.staffBlockId = res.blockId;
          detailInfo.value = deepClone(formData.value);
          nextTick(startWatch);
        })
        .finally(() => {
          loading.value = false;
        });
    };
    if (pageModel.value && pageModel.value !== "Add") {
      loadData();
    } else {
      startWatch();
    }
    watch(pageModel, () => {
      if (pageModel.value && pageModel.value !== "Add") {
        loadData();
      } else {
        startWatch();
      }
    });

    const blockOptions = ref<{ label: string; value: string }[]>([]);
    const blockMap = reactive<Record<string, BlockModel>>({});
    const blockOptionsLoading = ref(true);
    Block.getAll()
      .then((res) => {
        blockOptions.value = res.map((item) => {
          blockMap[item.blockId as string] = item;
          return {
            label: item.name as string,
            value: item.blockId as string,
          };
        });
        blockOptionsLoading.value = false;
      })
      .finally(() => {
        blockOptionsLoading.value = false;
      });

    const buttonLoading = ref(false);

    const tencentCos = new TencentCos();
    const createData = () => {
      buttonLoading.value = true;
      // return generatorAvator(formData.value.name)
      //   .then((blob) => {
      //     if (blob) {
      //       return new Promise((resolve: (v: string) => void) => {
      //         tencentCos.upload(
      //           `${new Date().getTime()}_${Math.ceil(Math.random() * 10000)}.png`,
      //           blob,
      //           undefined,
      //           (err: COS.CosError, data: COS.PutObjectResult) => {
      //             if (err) {
      //               resolve("");
      //             } else {
      //               resolve("http://" + data.Location);
      //             }
      //           },
      //         );
      //       });
      //     } else {
      //       return Promise.resolve("");
      //     }
      //   })
      //   .then((avator) => {
      const submitData: CreateStaffModel = {
        allowenceMth: formData.value.allowenceMth,
        bankAccount: formData.value.bankAccount,
        bonusAnnual: formData.value.bonusAnnual,
        bonusMth: formData.value.bonusMth,
        contraceFile: formData.value.contraceFile,
        contractEnd: formData.value.contractEnd,
        craft: formData.value.craft,
        deptId: formData.value.deptId,
        deptName: formData.value.deptName,
        dob: formData.value.dob,
        gender: formData.value.gender,
        grade: formData.value.grade,
        ic: formData.value.ic,
        icon: "",
        level: formData.value.level,
        name: formData.value.name,
        phone: formData.value.phone,
        phoneDeviceId: formData.value.phoneDeviceId,
        salaryHour: formData.value.salaryHour,
        salaryMth: formData.value.salaryMth,
        serviceClass: formData.value.serviceClass,
        startDate: formData.value.startDate,
        state: formData.value.state,
        title: formData.value.title,
        workingDays: formData.value.workingDays,
        workingHour: formData.value.workingHour,
        empNo: formData.value.empNo,
        icType: formData.value.icType,
        staffBlockId: formData.value.staffBlockId,
        staffBlockName: blockMap[formData.value.staffBlockId].name as string,
      };
      return Staff.create(submitData)
        .then(() => {
          router.push({ name: "EmployeesMember" });
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {
          buttonLoading.value = false;
        });
      // })
    };
    const pMap: Record<string, number | null> = reactive({
      base: null,
      blockId: null,
      craft: null,
      state: null,
    });
    const updateData = () => {
      buttonLoading.value = true;
      const pList: Promise<any>[] = [];
      const submitData: any = {
        staffId: detailInfo.value.staffId,
        allowenceMth: detailInfo.value.allowenceMth === formData.value.allowenceMth ? undefined : formData.value.allowenceMth,
        bankAccount: detailInfo.value.bankAccount === formData.value.bankAccount ? undefined : formData.value.bankAccount,
        bonusAnnual: detailInfo.value.bonusAnnual === formData.value.bonusAnnual ? undefined : formData.value.bonusAnnual,
        bonusMth: detailInfo.value.bonusMth === formData.value.bonusMth ? undefined : formData.value.bonusMth,
        contraceFile: detailInfo.value.contraceFile === formData.value.contraceFile ? undefined : formData.value.contraceFile,
        contractEnd: detailInfo.value.contractEnd === formData.value.contractEnd ? undefined : formData.value.contractEnd,
        deptId: detailInfo.value.deptId === formData.value.deptId ? undefined : formData.value.deptId,
        deptName: detailInfo.value.deptName === formData.value.deptName ? undefined : formData.value.deptName,
        dob: detailInfo.value.dob === formData.value.dob ? undefined : formData.value.dob,
        gender: detailInfo.value.gender === formData.value.gender ? undefined : formData.value.gender,
        grade: detailInfo.value.grade === formData.value.grade ? undefined : formData.value.grade,
        ic: detailInfo.value.ic === formData.value.ic ? undefined : formData.value.ic,
        level: detailInfo.value.level === formData.value.level ? undefined : formData.value.level,
        name: detailInfo.value.name === formData.value.name ? undefined : formData.value.name,
        phone: detailInfo.value.phone === formData.value.phone ? undefined : formData.value.phone,
        phoneDeviceId: detailInfo.value.phoneDeviceId === formData.value.phoneDeviceId ? undefined : formData.value.phoneDeviceId,
        salaryHour: detailInfo.value.salaryHour === formData.value.salaryHour ? undefined : formData.value.salaryHour,
        salaryMth: detailInfo.value.salaryMth === formData.value.salaryMth ? undefined : formData.value.salaryMth,
        startDate: detailInfo.value.startDate === formData.value.startDate ? undefined : formData.value.startDate,
        title: detailInfo.value.title === formData.value.title ? undefined : formData.value.title,
        workingDays: detailInfo.value.workingDays === formData.value.workingDays ? undefined : formData.value.workingDays,
        workingHour: detailInfo.value.workingHour === formData.value.workingHour ? undefined : formData.value.workingHour,
        empNo: detailInfo.value.empNo === formData.value.empNo ? undefined : formData.value.empNo,
        icType: detailInfo.value.icType === formData.value.icType ? undefined : formData.value.icType,
        // staffBlockId: detailInfo.value.staffBlockId === formData.value.staffBlockId ? undefined : formData.value.staffBlockId,
        // staffBlockName:
        //   detailInfo.value.staffBlockId === formData.value.staffBlockId ? undefined : (blockMap[formData.value.staffBlockId].name as string),
        // serviceClass: detailInfo.value.serviceClass === formData.value.serviceClass ? undefined : formData.value.serviceClass,
        // craft: detailInfo.value.craft === formData.value.craft ? undefined : formData.value.craft,
        // state: detailInfo.value.state === formData.value.state ? undefined : formData.value.state,
      };
      pList.push(Object.keys(submitData).filter((key) => submitData[key]).length > 1 ? Staff.update(submitData) : Promise.resolve());
      pMap["base"] = pList.length - 1;
      if (detailInfo.value.staffBlockId !== formData.value.staffBlockId) {
        // pMap["blockId"] = pMap["base"].finally(() => {
        pList.push(
          Promise.all(pList).finally(() => {
            return new Promise((resolve, reject) => {
              const close = Message.loading({
                content: "正在修改所在项目...",
                duration: -1,
              });
              setTimeout(() => {
                Staff.update({
                  staffId: detailInfo.value.staffId,
                  staffBlockId: formData.value.staffBlockId,
                  staffBlockName: blockMap[formData.value.staffBlockId].name as string,
                })
                  .then((res) => {
                    detailInfo.value.staffBlockId = formData.value.staffBlockId;
                    resolve(res);
                  })
                  .catch((err) => {
                    formData.value.staffBlockId = detailInfo.value.staffBlockId;
                    reject(err);
                  })
                  .finally(() => {
                    close.close();
                  });
              }, 1000);
            });
          }),
        );
        pMap["blockId"] = pList.length - 1;
      } else {
        pMap["blockId"] = null;
      }
      if (detailInfo.value.serviceClass !== formData.value.serviceClass) {
        pList.push(
          Promise.all(pList).finally(() => {
            return new Promise((resolve, reject) => {
              const close = Message.loading({
                content: "正在修改业务...",
                duration: -1,
              });
              setTimeout(() => {
                Staff.update({
                  staffId: detailInfo.value.staffId,
                  serviceClass: formData.value.serviceClass,
                })
                  .then((res) => {
                    detailInfo.value.serviceClass = formData.value.serviceClass;
                    resolve(res);
                  })
                  .catch((err) => {
                    formData.value.serviceClass = detailInfo.value.serviceClass;
                    reject(err);
                  })
                  .finally(() => {
                    close.close();
                  });
              }, 1000);
            });
          }),
        );
        pMap["serviceClass"] = pList.length - 1;
      } else {
        pMap["serviceClass"] = null;
      }
      if (detailInfo.value.craft !== formData.value.craft) {
        pList.push(
          Promise.all(pList).finally(() => {
            return new Promise((resolve, reject) => {
              const close = Message.loading({
                content: "正在修改角色...",
                duration: -1,
              });
              setTimeout(() => {
                Staff.update({
                  staffId: detailInfo.value.staffId,
                  craft: formData.value.craft,
                })
                  .then((res) => {
                    detailInfo.value.craft = formData.value.craft;
                    resolve(res);
                  })
                  .catch((err) => {
                    formData.value.craft = detailInfo.value.craft;
                    reject(err);
                  })
                  .finally(() => {
                    close.close();
                  });
              }, 1000);
            });
          }),
        );
        pMap["craft"] = pList.length - 1;
      } else {
        pMap["craft"] = null;
      }
      if (detailInfo.value.state !== formData.value.state) {
        pList.push(
          Promise.all(pList).finally(() => {
            return new Promise((resolve, reject) => {
              const close = Message.loading({
                content: "正在修改状态...",
                duration: -1,
              });
              setTimeout(() => {
                Staff.update({
                  staffId: detailInfo.value.staffId,
                  state: formData.value.state,
                })
                  .then((res) => {
                    detailInfo.value.state = formData.value.state;
                    resolve(res);
                  })
                  .catch((err) => {
                    formData.value.state = detailInfo.value.state;
                    reject(err);
                  })
                  .finally(() => {
                    close.close();
                  });
              }, 1000);
            });
          }),
        );
        pMap["state"] = pList.length - 1;
      } else {
        pMap["state"] = null;
      }
      Promise.all(pList)
        .then(() => {
          Message.success("修改成功");
          router.push({ name: "EmployeesMember" });
        })
        .finally(() => {
          loadData();
          buttonLoading.value = false;
        });
    };
    const refForm = ref();
    const clickSave = () => {
      refForm.value.validate((err: undefined | Record<string, ValidatedError>) => {
        if (err === undefined) {
          if (pageModel.value === "Add") {
            createData();
          } else {
            updateData();
          }
        }
      });
    };
    const saveAndAdd = () => {
      refForm.value.validate((err: undefined | Record<string, ValidatedError>) => {
        if (err === undefined) {
          createData().then(() => {
            Message.success("添加成功");
            router.replace({ name: "EmployeesMemberDetail", params: { model: "Add" }, query: { s: new Date().getTime() } });
          });
        }
      });
    };
    return {
      refForm,
      rules,
      loading,
      buttonLoading,
      pageModelName,
      pageModel,
      formData,
      createData,
      updateData,
      showModalTips,
      serviceClassMap,
      saveAndAdd,
      clickSave,
      staffStateMap,
      blockOptions,
      blockOptionsLoading,
      moment,
      isMasterEnv,
      pMap,
    };
  },
});
</script>

<style lang="less" scoped>
.detail-member {
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-3);
  }
}
</style>
