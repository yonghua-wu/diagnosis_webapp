<template>
  <SfTablePage
    :tableColumns="tableColumns"
    :loadData="loadData"
    :formatLoadData="formatLoadData"
    :queryData="queryData"
    :defaultRowSelection="false"
    :operation="['view']"
    :click-add="false"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['IOT模块', '人脸审核']" />
    </template>
  </SfTablePage>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import FaceAudit, { FaceAuditPageModel, FaceAuditPageQuery } from "@/api/tenant/FaceAudit";
import SfTablePage, { useFilterDefaultValueQueryData, useFormatData, useQueryData, useTableColumns } from "@/components/lib/SfTablePage";
import { SfTableColumnData } from "@/components/lib/SfTable";
import { useDictStore } from "@/store";
import { formatDateTime } from "@/utils/utils";
import { FACE_AUDIT_STATUS_MAP } from "@/store/modules/dict/types";
export default defineComponent({
  name: "face-audit-list",
  components: {
    SfTablePage,
    Breadcrumb,
  },
  setup() {
    const diceStore = useDictStore();
    const { formatLoadData } = useFormatData<FaceAuditPageModel>((item) => {
      return {
        key: item.id,
        data: item,
        name: item.name,
        phone: item.phone,
        placeName: item.placeName,
        authType: diceStore.FACE_AUDIT_AUTH_TYPE_MAP[item.authType],
        auditStatus: diceStore.FACE_AUDIT_STATUS_MAP[item.auditStatus],
      };
    });
    const { tableColumns } = useTableColumns(
      computed<SfTableColumnData[]>(() => {
        return [
          {
            title: "姓名",
            dataIndex: "name",
            width: 100,
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "手机号",
            dataIndex: "phone",
            width: 130,
            ellipsis: true,
            tooltip: true,
            filterable: {
              type: "search",
            },
          },
          {
            title: "身份类型",
            dataIndex: "authType",
            width: 100,
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "地址",
            dataIndex: "placeName",
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "申请时间",
            dataIndex: "createdTime",
            width: 180,
            ellipsis: true,
            tooltip: true,
            filterable: {
              sort: 98,
              type: "range-picker",
            },
          },
          {
            title: "审核状态",
            dataIndex: "auditStatus",
            width: 120,
            ellipsis: true,
            tooltip: true,
            filterable: {
              group: 1,
              ratio: 2,
              type: "radio",
              defaultValue: "-999",
              filters: [
                {
                  text: "全部",
                  value: "-999",
                },
                ...Object.keys(FACE_AUDIT_STATUS_MAP).map((k) => {
                  return {
                    text: FACE_AUDIT_STATUS_MAP[Number(k) as keyof typeof FACE_AUDIT_STATUS_MAP],
                    value: String(k),
                  };
                }),
              ],
            },
          },
        ];
      }),
      ["NO", "updatedBy", "updatedTime"],
    );
    const { queryData } = useQueryData(tableColumns);
    const { fQueryData } = useFilterDefaultValueQueryData(queryData);

    const loadData = (current: number, pageSize: number) => {
      const query: FaceAuditPageQuery = {};
      fQueryData.value.auditStatus && (query.auditStatus = Number(fQueryData.value.auditStatus) as keyof typeof FACE_AUDIT_STATUS_MAP);
      fQueryData.value.createdTime && (query.startCreatedTime = formatDateTime(fQueryData.value.createdTime[0]));
      fQueryData.value.createdTime && (query.endCreatedTime = formatDateTime(fQueryData.value.createdTime[1]));
      fQueryData.value.updatedTime && (query.startUpdatedTime = formatDateTime(fQueryData.value.updatedTime[0]));
      fQueryData.value.updatedTime && (query.endUpdatedTime = formatDateTime(fQueryData.value.updatedTime[1]));
      return FaceAudit.page(current, pageSize, query);
    };
    return {
      loadData,
      formatLoadData,
      tableColumns,
      queryData,
    };
  },
});
</script>

<style lang="scss" scoped></style>
