<template>
  <div class="add-employess container">
    <Breadcrumb
      :items="['客户服务', { name: '房客关系表', router: () => $router.replace({ name: 'HousePersonalRelationalTable' }) }, pageModelName]"
    />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="showModalTips">
        <template #extra>
          <template v-if="pageModel === 'View'">
            <a-button v-if="formData.status !== 6" type="outline" status="danger" @click="handleDelete">作废</a-button>
          </template>
        </template>

        <template v-if="pageModel === 'Add'">
          <a-form ref="refForm" :model="formData" auto-label-width style="max-width: 1500px">
            <!--@submit="clickSave"-->
            <a-space direction="vertical" fill>
              <a-space direction="vertical" fill>
                <a-row class="section-title">个人信息</a-row>
                <a-row :gutter="24" class="section-body">
                  <a-col :span="8">
                    <a-form-item :rules="rules.identity" field="identity" label="身份">
                      <a-select v-model="formData.identity" placeholder="请选择身份">
                        <a-option v-for="item in identityOptions" :key="item" :label="item.label" :value="item.value"></a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item v-if="formData.identity == 1" :rules="rules.icType" field="icType" label="证件类型">
                      <a-select v-model="formData.icType" placeholder="请选择证件类型">
                        <a-option v-for="item in icTypeOptions" :key="item" :label="item.label" :value="item.value"></a-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item v-else disabled field="icType" label="证件类型">
                      <a-select v-model="formData.icType" placeholder="请选择证件类型">
                        <a-option v-for="item in icTypeOptions" :key="item" :label="item.label" :value="item.value"></a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>

                  <a-col v-if="formData.icType === 1 && formData.identity == 1" :span="8">
                    <a-form-item :disabled="disabledInput == false" :rules="rules.ic" field="ic" label="证件号码">
                      <a-input v-model="formData.ic" placeholder="请输入证件号码" />
                    </a-form-item>
                  </a-col>
                  <a-col v-else-if="formData.identity == 2 || formData.identity == 3" :span="8">
                    <a-form-item disabled field="ic" label="证件号码">
                      <a-input v-model="formData.ic" placeholder="请输入证件号码" />
                    </a-form-item>
                  </a-col>
                  <a-col v-else :span="8">
                    <a-form-item :disabled="disabledInput == false" :rules="rules.ic2" field="ic" label="证件号码">
                      <a-input v-model="formData.ic" placeholder="请输入证件号码" />
                    </a-form-item>
                  </a-col>

                  <a-col :span="8">
                    <a-form-item :rules="rules.name" field="name" label="姓名">
                      <a-input v-model="formData.name" :max-length="50" placeholder="请输入姓名" />
                    </a-form-item>
                  </a-col>

                  <a-col :span="8">
                    <a-form-item :rules="rules.phone" field="phone" label="联系方式">
                      <a-input v-model="formData.phone" placeholder="请输入联系方式" />
                    </a-form-item>
                  </a-col>

                  <!--                  <a-col :span="8">-->
                  <!--                    <a-form-item field="emergencyName" label="紧急联系人">-->
                  <!--                      <a-input v-model="formData.emergencyName" placeholder="请输入紧急联系人" />-->
                  <!--                    </a-form-item>-->
                  <!--                  </a-col>-->

                  <!--                  <a-col :span="8">-->
                  <!--                    <a-form-item field="emergencyPhone" label="紧急联系号码">-->
                  <!--                      <a-input v-model="formData.emergencyPhone" placeholder="请输入紧急联系号码" />-->
                  <!--                    </a-form-item>-->
                  <!--                  </a-col>-->

                  <!--                <a-col :span="8">-->
                  <!--                  <a-form-item field="type" label="状态" required>-->
                  <!--                    <a-input v-model="formData.typeName" placeholder="请输入 状态" />-->
                  <!--                  </a-form-item>-->
                  <!--                </a-col>-->
                </a-row>
                <a-row class="section-title">关联房屋信息</a-row>
                <a-row :gutter="24" class="section-body">
                  <a-col :span="8">
                    <a-form-item :rules="rules.blockId" field="blockId" label="项目">
                      <a-select v-model="formData.blockId" placeholder="请选择项目">
                        <a-option
                          v-for="(p, index) in blockList"
                          :key="index"
                          :label="p.name"
                          :value="p.blockId"
                          @click="blockClick(p.blockId)"
                        ></a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item :rules="rules.buildingId" field="buildingId" label="楼栋">
                      <a-select v-model="formData.buildingId" placeholder="请选择楼栋">
                        <a-option
                          v-for="(p, index) in buildingList"
                          :key="index"
                          :label="p.buildingNo"
                          :value="p.buildingId"
                          @click="buildingClick(p.buildingId)"
                        ></a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>

                  <a-col :span="8">
                    <a-form-item :rules="rules.unitId" field="unitId" label="户室">
                      <a-select v-model="formData.unitId" placeholder="请选择户室">
                        <a-option v-for="(p, index) in unitLsit" :key="index" :label="p.name" :value="p.unitId"></a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item v-if="formData.identity == 1" field="contract" label="上传房产证" :rules="rules.contract">
                      <UploadVue v-if="formData.contract" ref="refUploadVue" v-model:file-list="formData.contract" :uploadType="'picture-card'" />
                    </a-form-item>
                    <a-form-item v-if="formData.identity == 2" field="contract" label="上传租赁合同" :rules="rules.contract2">
                      <UploadVue v-if="formData.contract" ref="refUploadVue" v-model:file-list="formData.contract" :uploadType="'picture-card'" />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-space>
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
        </template>

        <template v-if="pageModel === 'View'">
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
                        <a-option v-for="item in identityOptions" :key="item" :label="item.label" :value="item.value"></a-option>
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
                </a-row>
                <a-row class="section-title">关联房屋信息</a-row>
                <a-row :gutter="24" class="section-body">
                  <a-col :span="8">
                    <a-form-item field="blockId" label="项目" :row-props="{ gutter: 24 }">
                      <a-input v-model="formData.blockName" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item field="buildingId" label="楼栋" :row-props="{ gutter: 24 }">
                      <a-input v-model="formData.buildingNo" />
                    </a-form-item>
                  </a-col>

                  <a-col :span="8">
                    <a-form-item field="unitId" label="户室" :row-props="{ gutter: 24 }">
                      <a-input v-model="formData.unitName" />
                    </a-form-item>
                  </a-col>
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
        </template>
      </CUVue>
    </a-spin>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import CUVue, { useDetailPage } from "@/components/lib/CU";
import Household, { blockModel, buildingModel, operationLogModel, unitModel } from "@/api/tenant/Household";
import { useRoute, useRouter } from "vue-router";
import UploadVue from "@/components/lib/Upload.vue";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import RulesLib from "@/utils/RulesLib";
import Owner from "@/api/tenant/Owner";
import modal from "@arco-design/web-vue/es/modal";
import Message from "@/utils/Message";
import Block from "@/api/tenant/Block";
import Building from "@/api/tenant/Building";

export default defineComponent({
  name: "householdDetail",
  components: {
    Breadcrumb,
    CUVue,
    UploadVue,
  },
  setup() {
    const { pageModel, pageModelName } = useDetailPage();
    const router = useRouter();
    const formData = ref<any>({
      blockId: "",
      buildingId: "",
      contract: [],
      contractEnd: "",
      deed: "",
      emergencyName: "",
      emergencyPhone: "",
      ic: "",
      icType: undefined,
      identity: "",
      name: "",
      phone: "",
      unitId: "",
    });
    const operationLog = ref<operationLogModel[]>([]);
    const showModalTips = ref(false);
    const blockList = ref<blockModel[]>([]);
    const buildingList = ref<buildingModel[]>([]);
    const unitLsit = ref<unitModel[]>([]);
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
      contract: new RulesLib().required("请上传房产证").done(),
      contract2: new RulesLib().required("请上传租赁合同").done(),
    };
    onMounted(() => {
      loadData();
    });
    const route = useRoute();
    const loadData = () => {
      if (pageModel.value == "Add") {
        Block.getAll().then((res) => {
          blockList.value = res.map((item) => {
            return {
              blockId: item.blockId || "",
              name: item.name || "",
            };
          });
        });
      } else if (pageModel.value == "View") {
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
        });
      }
    };
    let disabledInput = true;
    const loading = ref(false);
    const buttonLoading = ref(false);
    const refUploadVue = ref();
    const refForm = ref();
    // 提交数据
    const createData = () => {
      if (formData.value.identity != 3) {
        // 数据
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
        Household.addAllPersonList(data)
          .then(() => {
            Message.success("成功");
            router.push({ name: "HousePersonalRelationalTable" });
          })
          .finally(() => {
            buttonLoading.value = false;
          });
      } else {
        // 数据
        const data = {
          blockId: formData.value.blockId,
          buildingId: formData.value.buildingId,
          contract: "",
          contractEnd: formData.value.contractEnd,
          deed: "",
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
        Household.addAllPersonList(data)
          .then((res) => {
            if (res.code == 200) {
              router.push({ name: "HousePersonalRelationalTable" });
            } else {
              Message.error("操作失败请联系管理员");
            }
          })
          .finally(() => {
            buttonLoading.value = false;
          });
      }
    };
    // 提交按钮
    const clickSave = () => {
      return new Promise((resolve, reject) => {
        refForm.value.validate((err: undefined | Record<string, ValidatedError>) => {
          if (err === undefined) {
            if (formData.value.identity == 1 || formData.value.identity == 2) {
              refUploadVue.value
                .submit()
                .then(() => {
                  resolve(createData());
                })
                .catch((err: any) => {
                  reject(false);
                });
            } else {
              createData();
            }
          } else {
            reject(false);
          }
        });
      });
    };
    // 项目选项点击
    const blockClick = (blockId: string) => {
      Building.getAll().then((res) => {
        buildingList.value = res.map((item) => {
          return {
            buildingId: item.buildingId,
            buildingNo: item.buildingNo,
          };
        });
      });
    };
    // 楼栋点击
    const buildingClick = (buildingId: string) => {
      const data = {
        buildingId: buildingId,
      };
      // FIXME: 接口不对
      Household.getBuildingByUnit(data).then((res) => {
        unitLsit.value = res.data;
      });
    };
    const handleDelete = () => {
      const data = {
        personId: formData.value.personId,
        personUnitId: route.params.personUnitId,
        remark: "",
      };
      console.log("data", data);
      modal.warning({
        title: "业主审核",
        content: "您确定要将本条记录作废吗？",
        closable: true,
        cancelText: "取消",
        hideCancel: false,
        onOk: () => {
          Household.deleteAllPerson(data).then((res) => {
            if (res.code == 200) {
              Message.success("操作成功");
              router.push({ name: "HousePersonalRelationalTable" });
            } else {
              Message.error("操作失败,请联系管理员");
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
      pageModel,
      pageModelName,
      blockList,
      buildingList,
      unitLsit,
      blockClick,
      buildingClick,
      refUploadVue,
      rules,
      icTypeOptions,
      identityOptions,
      disabledInput,
      showModalTips,
      statusOptions,
      handleDelete,
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
:deep(.arco-upload-list.arco-upload-list-type-picture-card) {
  flex-wrap: nowrap;
}
</style>
