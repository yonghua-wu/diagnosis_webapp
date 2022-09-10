<template>
  <div class="face-audit-detail container">
    <Breadcrumb :items="['IOT模块', { name: '人脸审核', router: () => $router.replace({ name: 'FaceAudit' }) }, pageModelText]" />
    <a-spin :loading="loading" style="width: 100%">
      <CUVue :showModalTips="false">
        <template #extra>
          <ApprovedModal v-if="detailInfo?.auditStatus === 0"></ApprovedModal>
          <NotApprovedModal v-if="detailInfo?.auditStatus === 0"></NotApprovedModal>
        </template>
        <SfForm :model="detailInfo" :label-width="130">
          <div style="width: 100%">个人信息</div>
          <SfFormItem field="name" label="姓名">
            {{ detailInfo?.name }}
          </SfFormItem>
          <SfFormItem field="icType" label="证件类型">
            {{ detailInfo?.icType && IC_TYPE_MAP[detailInfo?.icType] }}
          </SfFormItem>
          <SfFormItem field="ic" label="证件号码">
            {{ detailInfo?.ic }}
          </SfFormItem>
          <SfFormItem field="authType" label="身份">
            {{ detailInfo?.authType && FACE_AUDIT_AUTH_TYPE_MAP[detailInfo?.authType] }}
          </SfFormItem>
          <SfFormItem field="phone" label="手机号码">
            {{ detailInfo?.phone }}
          </SfFormItem>
          <SfFormItem field="auditStatus" label="状态">
            {{ detailInfo?.auditStatus && FACE_AUDIT_STATUS_MAP[detailInfo?.auditStatus] }}
          </SfFormItem>
          <SfFormItem field="imgUrl" label="人脸信息">
            <a-image :src="detailInfo?.imgUrl || ''" width="60" />
          </SfFormItem>
          <div style="width: 100%">关联房屋信息</div>
          <SfFormItem field="blockName" label="项目">
            {{ detailInfo?.blockName }}
          </SfFormItem>
          <SfFormItem field="placeName" label="地址">
            {{ detailInfo?.placeName }}
          </SfFormItem>
        </SfForm>
      </CUVue>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import CUVue from "@/components/lib/CU";
import { useDetailPageModel } from "@/components/lib/CU/CU";
import { useRoute } from "vue-router";
import FaceAudit, { FaceAuditDetailModel } from "@/api/tenant/FaceAudit";
import SfForm from "@/components/lib/CU/SfForm";
import SfFormItem from "@/components/lib/CU/SfFormItem";
import { useDictStore } from "@/store";
import ApprovedModal from "./components/ApprovedModal.vue";
import NotApprovedModal from "./components/NotApprovedModal.vue";

export default defineComponent({
  name: "face-audit-detail",
  components: {
    Breadcrumb,
    CUVue,
    SfForm,
    SfFormItem,
    ApprovedModal,
    NotApprovedModal,
  },
  setup() {
    const { pageModel, pageModelText } = useDetailPageModel();
    const loading = ref(false);
    const route = useRoute();
    const detailInfo = ref<FaceAuditDetailModel>();
    const loadData = () => {
      loading.value = true;
      FaceAudit.detail(route.params.id as string)
        .then((res) => {
          detailInfo.value = res;
        })
        .finally(() => {
          loading.value = false;
        });
    };
    loadData();
    const diceStore = useDictStore();
    const IC_TYPE_MAP = diceStore.IC_TYPE_MAP;
    const FACE_AUDIT_AUTH_TYPE_MAP = diceStore.FACE_AUDIT_AUTH_TYPE_MAP;
    const FACE_AUDIT_STATUS_MAP = diceStore.FACE_AUDIT_STATUS_MAP;
    return {
      pageModel,
      pageModelText,
      loading,
      detailInfo,
      IC_TYPE_MAP,
      FACE_AUDIT_AUTH_TYPE_MAP,
      FACE_AUDIT_STATUS_MAP,
    };
  },
});
</script>
