<template>
  <div class="add-employess container">
    <Breadcrumb :items="['客户服务', { name: '租户审核', router: () => $router.replace({ name: 'TenantAudit' }) }, pageModelName]" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <template #extra>
          <template v-if="pageModel === 'View'">
            <a-button @click="handleDelete" v-if="formData.status == 3">不通过</a-button>
            <a-modal v-model:visible="visible" title="租户审核不通过" title-align="start" width="500px" @before-ok="handleBeforeOk">
              <a-form :model="formData">
                <a-textarea
                  v-model="formData.remark"
                  :auto-size="{
                    minRows: 5,
                    maxRows: 5,
                  }"
                  :max-length="300"
                  allow-clear
                  placeholder="请输入审核不通过原因"
                  show-word-limit
                />
              </a-form>
            </a-modal>
            <a-button type="primary" @click="handleExamine" v-if="formData.status == 3">通过</a-button>
          </template>
        </template>
        <a-form
          ref="refForm"
          :disabled="pageModel === 'View'"
          :label-col-props="{ span: 8 }"
          :model="formData"
          :wrapper-col-props="{ span: 16 }"
          style="max-width: 1500px"
        >
          <!--@submit="clickSave"-->
          <a-space direction="vertical" fill>
            <a-space direction="vertical" fill>
              <a-row class="section-title">个人信息</a-row>
              <a-row :gutter="24" class="section-body">
                <a-col :span="8">
                  <a-form-item field="identity" label="身份">
                    <a-select v-model="formData.identity">
                      <a-option
                        v-for="item in identityOptions"
                        :key="item"
                        :label="item.label"
                        :value="item.value"
                        @click="identityClick(item.value)"
                      ></a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="phone" label="联系方式">
                    <a-input v-model="formData.phone" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="status" label="状态">
                    <a-select v-model="formData.status">
                      <a-option v-for="item in statusOptions" :key="item" :label="item.label" :value="item.value"></a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="name" label="姓名">
                    <a-input v-model="formData.name" :max-length="50" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="icType" label="证件类型">
                    <a-select v-model="formData.icType">
                      <a-option v-for="item in icTypeOptions" :key="item" :label="item.label" :value="item.value"></a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col v-if="formData.icType === 1" :span="8">
                  <a-form-item field="ic" label="证件号码">
                    <a-input v-model="formData.ic" />
                  </a-form-item>
                </a-col>
                <a-col v-else :span="8">
                  <a-form-item field="ic" label="证件号码">
                    <a-input v-model="formData.ic" />
                  </a-form-item>
                </a-col>

                <!--                <a-col :span="8">-->
                <!--                  <a-form-item field="emergencyName" label="紧急联系人">-->
                <!--                    <a-input v-model="formData.emergencyName" />-->
                <!--                  </a-form-item>-->
                <!--                </a-col>-->

                <!--                <a-col :span="8">-->
                <!--                  <a-form-item field="emergencyPhone" label="紧急联系号码">-->
                <!--                    <a-input v-model="formData.emergencyPhone" />-->
                <!--                  </a-form-item>-->
                <!--                </a-col>-->

                <!--                <a-col :span="8">-->
                <!--                  <a-form-item field="type" label="状态" required>-->
                <!--                    <a-input v-model="formData.typeName" placeholder="请输入 状态" />-->
                <!--                  </a-form-item>-->
                <!--                </a-col>-->
              </a-row>
              <a-row class="section-title">关联房屋信息</a-row>
              <a-row :gutter="24" class="section-body">
                <a-col :span="8">
                  <a-form-item field="blockId" label="项目">
                    <a-input v-model="formData.blockName" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="buildingId" label="楼栋">
                    <a-input v-model="formData.buildingNo" />
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item field="unitId" label="户室">
                    <a-input v-model="formData.unitName" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-col :span="8">
                    <a-form-item v-if="formData.identity == 1" field="contract" label="房产证">
                      <a-image-preview-group infinite>
                        <a-space>
                          <a-image :src="formData.deed" width="200" />
                        </a-space>
                      </a-image-preview-group>
                    </a-form-item>
                    <a-form-item v-if="formData.identity == 2" field="contract" label="租赁合同">
                      <a-image-preview-group infinite>
                        <a-space>
                          <a-image :src="formData.contract" width="200" />
                        </a-space>
                      </a-image-preview-group>
                    </a-form-item>
                  </a-col>
                </a-col>
              </a-row>
            </a-space>
            <a-timeline mode="left" labelPosition="relative">
              <a-timeline-item v-for="(log, index) in operationLog" :key="index">
                <div style="margin-bottom: 8px">
                  {{ log.title }}
                </div>
                <a-descriptions :align="{ label: 'right' }" :column="1">
                  <a-descriptions-item label="记录信息">
                    {{ log.message || "-" }}
                  </a-descriptions-item>
                  <a-descriptions-item label="备注">
                    {{ log.remark || "-" }}
                  </a-descriptions-item>
                </a-descriptions>
              </a-timeline-item>
            </a-timeline>
            <a-row v-if="pageModel != 'View'" :gutter="24">
              <a-col :span="8">
                <a-form-item>
                  <a-space>
                    <a-button type="primary" @click="clickSave">保存</a-button>
                    <!-- <a-button html-type="submit" type="text" v-if="pageModel !== 'edit'">保存并继续添加</a-button> -->
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
import { defineComponent, onMounted, reactive, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import CUVue, { useDetailPage } from "@/components/lib/CU";
import Household, { blockModel, buildingModel, operationLogModel, unitModel } from "@/api/tenant/Household";
import { useRoute, useRouter } from "vue-router";
import UploadVue from "@/components/lib/Upload.vue";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import RulesLib from "@/utils/RulesLib";
import { useStartStopWatch } from "@/hooks/use";
import Owner from "@/api/tenant/Owner";
import Message from "@/utils/Message";
import modal from "@arco-design/web-vue/es/modal";
import Tenant from "@/api/tenant/TenantAudit";

export default defineComponent({
  name: "TenantDetail",
  components: {
    Breadcrumb,
    CUVue,
  },
  setup() {
    const { pageModel, pageModelName } = useDetailPage();
    const router = useRouter();
    const route = useRoute();
    const formData = ref<any>({
      blockId: "",
      buildingId: "",
      contract: [],
      contractEnd: "",
      deed: "",
      emergencyName: "",
      emergencyPhone: "",
      ic: "",
      icType: 1,
      identity: "",
      name: "",
      phone: "",
      unitId: "",
      status: 1,
      blockName: "",
      buildingNo: "",
      unitName: "",
      personId: "",
      personUnitId: "",
      remark: "",
    });
    const operationLog = ref<operationLogModel[]>([]);
    const blockList = ref<blockModel[]>([]);
    const buildingList = ref<buildingModel[]>([]);
    const unitLsit = ref<unitModel[]>([]);
    const showModalTips = ref(false);
    const { startWatch, stopWatch } = useStartStopWatch(formData, () => {
      showModalTips.value = true;
    });
    const statusOptions: any[] = [
      {
        value: 1,
        label: "正常",
      },
      {
        value: 2,
        label: "禁用",
      },
      {
        value: 3,
        label: "待审核",
      },
      {
        value: 99,
        label: "作废",
      },
    ];
    const icTypeOptions: any[] = [
      {
        value: 1,
        label: "身份证",
      },
      {
        value: 2,
        label: "军官证",
      },
      {
        value: 3,
        label: "护照",
      },
      {
        value: 4,
        label: "其他",
      },
      {
        value: 0,
        label: "",
      },
    ];
    const identityOptions: any[] = [
      {
        value: 1,
        label: "业主 ",
      },
      {
        value: 2,
        label: "租户 ",
      },
      {
        value: 3,
        label: "住户 ",
      },
    ];
    // 审核请求参数
    const apply = reactive({
      personId: "",
      status: 0,
      personUnitIds: [""],
      remark: "",
    });

    const rules = {
      name: new RulesLib().required("请输入姓名").maxLength(50).minLength(2).done(),
      phone: new RulesLib().required("请输入手机号").length(11).phone().done(),
      unitId: new RulesLib().required("请选择户室").done(),
      blockId: new RulesLib().required("请选择项目").done(),
      buildingId: new RulesLib().required("请选择楼栋").done(),
      icType: new RulesLib().required("请选择证件类型").done(),
      ic: new RulesLib().required("请输入证件号码").length(18).idCard().done(),
      ic2: new RulesLib().required("请输入证据号码").done(),
      identity: new RulesLib().required("请选择身份").done(),
    };
    onMounted(() => {
      loadData();
    });
    const loadData = () => {
      const data = {
        personId: route.params.id,
        personUnitId: route.params.personUnitId,
      };
      Owner.getAllPerson(data).then((res) => {
        console.log("res.data", res.data);
        formData.value = res.data;
        formData.value.identity = res.data.personUnitVo.type;
        formData.value.deed = res.data.personUnitVo.deed;
        formData.value.contract = res.data.personUnitVo.contract;
        formData.value.status = res.data.personUnitVo.status;
        formData.value.unitName = res.data.personUnitVo.unitName;
        formData.value.blockName = res.data.personUnitVo.blockName;
        formData.value.buildingNo = res.data.personUnitVo.buildingNo;
        formData.value.personUnitId = res.data.personUnitVo.personUnitId;
        operationLog.value = res.data.operationRecordVoList;
        console.log("formData", formData.value);
      });
    };
    const loading = ref(false);
    const buttonLoading = ref(false);
    const refUploadVue = ref();
    const refForm = ref();
    // 提交数据
    const createData = () => {
      const data = {
        blockId: formData.value.blockId,
        buildingId: formData.value.buildingId,
        contract: "",
        contractEnd: formData.value.contractEnd,
        deed: formData.value.contract[0].response,
        emergencyName: formData.value.emergencyName,
        emergencyPhone: formData.value.emergencyPhone,
        ic: formData.value.ic,
        icType: formData.value.icType,
        identity: formData.value.identity,
        name: formData.value.name,
        phone: formData.value.phone,
        unitId: formData.value.unitId,
      };
      buttonLoading.value = true;
      console.log("data", data);
      Household.addAllPersonList(data)
        .then(() => {
          router.push({ name: "HousePersonalRelationalTable" });
        })
        .finally(() => {
          buttonLoading.value = false;
        });
    };
    // 提交按钮
    const clickSave = () => {
      return new Promise((resolve, reject) => {
        refForm.value.validate((err: undefined | Record<string, ValidatedError>) => {
          if (err === undefined) {
            refUploadVue.value
              .submit()
              .then(() => {
                resolve(createData());
              })
              .catch((err: any) => {
                console.log("err", err);
                reject(false);
              });
          } else {
            reject(false);
          }
        });
      });
    };
    // 项目选项点击
    const blockClick = (blockId: string) => {
      const data = {
        buildingId: blockId,
      };
      Household.getBuilding(data).then((res) => {
        buildingList.value = res.data;
      });
    };
    // 楼栋点击
    const buildingClick = (buildingId: string) => {
      const data = {
        buildingId: buildingId,
      };
      Household.getBuildingByUnit(data).then((res) => {
        unitLsit.value = res.data;
      });
    };
    const identityClick = (value: number) => {
      if (value == 1) {
        console.log("1");
      }
    };
    // 审核通过
    const handleExamine = () => {
      apply.personId = formData.value.personId;
      let Ids: string[] = [formData.value.personUnitId];
      apply.personUnitIds = Ids;
      apply.status = 1;
      console.log("apply", apply);
      modal.warning({
        title: "租户审核",
        content: "您确定租户审核通过吗？",
        closable: true,
        cancelText: "取消",
        hideCancel: false,
        onOk: () => {
          Tenant.tenantModify(apply).then((res) => {
            if (res.code == 200) {
              Message.success("审核成功");
              router.push({ name: "TenantAudit" });
            } else {
              Message.error("审核失败,请联系管理员");
            }
          });
        },
      });
    };
    const visible = ref(false);
    // 审核不通过
    const handleDelete = () => {
      console.log("handleDelete");
      visible.value = true;
      // apply.personId = row.personId;
      // apply.personUnitId = row.personUnitVo.personUnitId;
      // apply.status = 99;
      // modal.warning({
      //   title: "提示",
      //   content: "是否审核不通过业主" + row.name,
      //   closable: true,
      //   cancelText: "取消",
      //   hideCancel: false,
      //   onOk: () => {
      //     Owner.ownerModify(apply).then((res) => {
      //       if (res.code == 200) {
      //         Message.success("审核成功");
      //       } else {
      //         Message.error("审核失败,请联系管理员");
      //       }
      //     });
      //   },
      // });
    };
    const handleBeforeOk = () => {
      apply.personId = formData.value.personId;
      let Ids: string[] = [formData.value.personUnitId];
      apply.personUnitIds = Ids;
      apply.status = 99;
      apply.remark = formData.value.remark;
      console.log("apply", apply);
      modal.warning({
        title: "提示",
        content: "是否审核不通过业主" + formData.value.name,
        closable: true,
        cancelText: "取消",
        hideCancel: false,
        onOk: () => {
          Tenant.tenantModify(apply).then((res) => {
            if (res.code == 200) {
              Message.success("操作成功");
              router.push({ name: "TenantAudit" });
            } else {
              Message.error("审核失败,请联系管理员");
            }
          });
        },
      });
    };
    return {
      refForm,
      formData,
      loading,
      buttonLoading,
      createData,
      clickSave,
      pageModelName,
      pageModel,
      blockList,
      buildingList,
      unitLsit,
      blockClick,
      buildingClick,
      refUploadVue,
      rules,
      icTypeOptions,
      identityOptions,
      identityClick,
      showModalTips,
      visible,
      handleDelete,
      handleExamine,
      statusOptions,
      handleBeforeOk,
      operationLog,
    };
  },
});
</script>
<style lang="less" scoped>
.add-employess {
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-3);
  }
}
</style>
