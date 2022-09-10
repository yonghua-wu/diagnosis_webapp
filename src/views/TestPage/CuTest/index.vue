<template>
  <div class="detail-member container">
    <Breadcrumb :items="['员工管理', { name: '成员管理', router: () => $router.replace({ name: 'Member' }) }, pageModelText]" />
    <CUVue :showModalTips="showModalTips" :loading="loading">
      <SfForm ref="refForm" :model="formData" @submit="clickSave" :disabled="pageModel === 'View'" :formModel="pageModel">
        <SfFormItem field="name" :rules="rules.name" :disabled="pageModel === 'View' || pageModel === 'Edit'" label="姓名">
          <a-input :max-length="50" v-model="formData.name" placeholder="请输入姓名" />
        </SfFormItem>
        <SfFormItem :rules="rules.icType" field="icType" :disabled="pageModel === 'View' || pageModel === 'Edit'" label="证件类型">
          <a-select :default-value="1" v-model="formData.icType" placeholder="请选择证件类型">
            <a-option :label="'身份证'" :value="1"></a-option>
            <a-option :label="'护照'" :value="2"></a-option>
          </a-select>
        </SfFormItem>
        <SfFormItem field="ic" :rules="rules.ic" :disabled="pageModel === 'View' || pageModel === 'Edit'" label="证件号码">
          <a-input :max-length="20" v-model="formData.ic" placeholder="请输入证件号码" />
        </SfFormItem>
        <SfFormItem field="ic" :rules="rules.ic2" :disabled="pageModel === 'View' || pageModel === 'Edit'" label="证件号码">
          <a-input :max-length="20" v-model="formData.ic" placeholder="请输入证件号码" />
        </SfFormItem>
        <SfFormItem field="gender" :rules="rules.gender" :disabled="pageModel === 'View' || pageModel === 'Edit'" label="性别">
          <a-select v-model="formData.gender" placeholder="请选择性别">
            <a-option :label="'男'" :value="1"></a-option>
            <a-option :label="'女'" :value="2"></a-option>
          </a-select>
        </SfFormItem>
        <SfFormItem field="dob" :rules="rules.dob" :disabled="pageModel === 'View' || pageModel === 'Edit'" label="出生日期">
          <a-date-picker
            :value-format="'YYYY-MM-DD HH:mm:ss'"
            v-model="formData.dob"
            :disabledDate="(current) => moment(current).isAfter(moment())"
            placeholder="请选择出生日期"
          />
        </SfFormItem>
        <SfFormSecondTitle>副标题</SfFormSecondTitle>
        <SfFormItem :rules="rules.empNo" field="empNo" label="工号">
          <a-input :max-length="20" v-model="formData.empNo" placeholder="请输入工号" />
        </SfFormItem>
        <SfFormItem field="staffBlockId" :rules="rules.staffBlockId" label="所在项目">
          <a-select v-model="formData.staffBlockId" :options="blockOptions" :loading="blockOptionsLoading" placeholder="请选择所在项目" />
        </SfFormItem>
        <SfFormItem field="phone" :rules="rules.phone" label="手机号">
          <a-input :max-length="11" v-model="formData.phone" placeholder="请输入手机号" />
        </SfFormItem>
        <SfFormItem field="serviceClass" :rules="rules.serviceClass" label="业务">
          <a-select v-model="formData.serviceClass" placeholder="请选择业务">
            <a-option
              :label="serviceClassMap[key].label"
              :value="Number(key)"
              :key="index"
              v-for="(key, index) in Object.keys(serviceClassMap)"
            ></a-option>
          </a-select>
        </SfFormItem>
        <SfFormItem field="cyclicalPatrolRoutes" label="选择" :colProps="{ xs: 24, sm: 24, md: 12, lg: 12, xl: 12 }">
          <a-transfer :title="['未选择的', '已选择的']"> </a-transfer>
        </SfFormItem>
        <SfFormItem field="craft" :rules="rules.craft" label="角色">
          <a-select v-model="formData.craft" placeholder="请选择角色">
            <a-option :label="'员工'" :value="1"></a-option>
            <a-option :label="'主管'" :value="2"></a-option>
            <a-option :label="'经理'" :value="3"></a-option>
          </a-select>
        </SfFormItem>
        <SfFormItem field="title" :rules="rules.title" label="职称">
          <a-input :max-length="50" v-model="formData.title" placeholder="请输入职称" />
        </SfFormItem>
        <SfFormItem field="startDate" :rules="rules.startDate" label="入职时间">
          <a-date-picker :value-format="'YYYY-MM-DD HH:mm:ss'" v-model="formData.startDate" placeholder="请输入入职时间" />
        </SfFormItem>
        <SfFormItem field="state" :rules="rules.state" label="状态">
          <a-select v-model="formData.state" placeholder="请输入状态">
            <a-option :label="staffStateMap[key]" :value="Number(key)" :key="index" v-for="(key, index) in Object.keys(staffStateMap)"></a-option>
          </a-select>
        </SfFormItem>
        <SfFormItem :colProps="{ span: 24 }">
          <a-space>
            <a-button html-type="submit" type="primary" :loading="buttonLoading">保存</a-button>
            <a-button @click="saveAndAdd" type="text" v-if="pageModel === 'Add'" :loading="buttonLoading">保存并继续添加</a-button>
          </a-space>
        </SfFormItem>
      </SfForm>
    </CUVue>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, reactive, ref, watch } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { useRoute, useRouter } from "vue-router";
import { useStartStopWatch } from "@/hooks/use";
import CUVue, { useDetailPageModel } from "@/components/lib/CU/CU";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import Staff, { CreateStaffModel } from "@/api/tenant/Staff";
import { useAppStore } from "@/store";
import Message from "@/utils/Message";
import RulesLib from "@/utils/RulesLib";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import Block, { BlockModel } from "@/api/tenant/Block";
import moment from "moment";
import { deepClone } from "@/utils/utils";
import SfFormSecondTitle from "@/components/lib/CU/SfFormSecondTitle";
const staffStateMap: any = {
  1: "在职",
  3: "离职",
};

export default defineComponent({
  name: "detail-member",
  components: {
    Breadcrumb,
    CUVue,
    SfForm,
    SfFormItem,
    SfFormSecondTitle,
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

    const { pageModel, pageModelText } = useDetailPageModel();
    const loading = ref(false);
    const detailInfo = ref<any>({});
    const loadData = () => {
      loading.value = true;
      stopWatch.value?.();
      Staff.detail(route.params.id as string)
        .then((res) => {
          formData.value = res;
          detailInfo.value = deepClone(res);
          formData.value.staffBlockId = res.blockId;
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

    // const appStore = useAppStore();
    const userInfo = computed(() => {
      return appStore.userInfo as any;
    });
    const createData = () => {
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
      buttonLoading.value = true;
      return Staff.create(submitData)
        .then(() => {
          router.push({ name: "Member" });
        })
        .catch((err) => {
          // Message.error(err.msg || "添加失败");
          throw err;
        })
        .finally(() => {
          buttonLoading.value = false;
        });
    };
    const updateData = () => {
      buttonLoading.value = true;
      Staff.update({
        staffId: detailInfo.value.staffId,
        allowenceMth: detailInfo.value.allowenceMth === formData.value.allowenceMth ? undefined : formData.value.allowenceMth,
        bankAccount: detailInfo.value.bankAccount === formData.value.bankAccount ? undefined : formData.value.bankAccount,
        bonusAnnual: detailInfo.value.bonusAnnual === formData.value.bonusAnnual ? undefined : formData.value.bonusAnnual,
        bonusMth: detailInfo.value.bonusMth === formData.value.bonusMth ? undefined : formData.value.bonusMth,
        contraceFile: detailInfo.value.contraceFile === formData.value.contraceFile ? undefined : formData.value.contraceFile,
        contractEnd: detailInfo.value.contractEnd === formData.value.contractEnd ? undefined : formData.value.contractEnd,
        craft: detailInfo.value.craft === formData.value.craft ? undefined : formData.value.craft,
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
        serviceClass: detailInfo.value.serviceClass === formData.value.serviceClass ? undefined : formData.value.serviceClass,
        startDate: detailInfo.value.startDate === formData.value.startDate ? undefined : formData.value.startDate,
        state: detailInfo.value.state === formData.value.state ? undefined : formData.value.state,
        title: detailInfo.value.title === formData.value.title ? undefined : formData.value.title,
        workingDays: detailInfo.value.workingDays === formData.value.workingDays ? undefined : formData.value.workingDays,
        workingHour: detailInfo.value.workingHour === formData.value.workingHour ? undefined : formData.value.workingHour,
        empNo: detailInfo.value.empNo === formData.value.empNo ? undefined : formData.value.empNo,
        icType: detailInfo.value.icType === formData.value.icType ? undefined : formData.value.icType,
        staffBlockId: detailInfo.value.staffBlockId === formData.value.staffBlockId ? undefined : formData.value.staffBlockId,
        staffBlockName: blockMap[formData.value.staffBlockId].name as string,
      })
        .then(() => {
          router.push({ name: "Member" });
        })
        .catch((err) => {
          Message.error(err.msg || "更新失败");
        })
        .finally(() => {
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
            router.replace({ name: "MemberDetail", params: { model: "Add" }, query: { s: new Date().getTime() } });
          });
        }
      });
    };

    return {
      refForm,
      rules,
      loading,
      buttonLoading,
      pageModelText,
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
