<template>
  <SfTable
    ref="refSfTable"
    :loadData="loadDataRef"
    :formatLoadData="formartLoadDataRef"
    :formatQueryData="formatQueryData"
    :tableColumns="tableColumns"
    v-model:queryData="queryData"
    :row-delete="del"
    :click-selected-delete="dels"
    v-model:selectedRowKeys="selectedRowKeys"
    :operation="['view']"
    :scroll="{ x: 1400 }"
    :multiSelectDeleteButtom="false"
  >
    <template #breadcrumb>
      <Breadcrumb :items="['员工管理', '成员管理']" />
    </template>
  </SfTable>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import SfTable from "@/components/lib/RD3/SfTable";
import Staff, { StaffModel } from "@/api/tenant/Staff";
import { useAppStore } from "@/store";
import moment from "moment";
import { RdTableColumnData } from "@/components/lib/RD3/interface";
const craftMap = {
  1: "员工",
  2: "主管",
  3: "经理",
};
const staffStateMap = {
  1: "在职",
  3: "离职",
};
export default defineComponent({
  name: "member-view",
  components: {
    Breadcrumb,
    SfTable,
  },
  setup() {
    const refSfTable = ref();
    const loadDataRef = Staff.page;
    const serviceClassMap = computed(() => {
      return appStore.serviceClassMap as any;
    });
    const formartLoadDataRef = (data: StaffModel[]) => {
      return data.map((item) => {
        return {
          key: item.staffId,
          data: item,
          name: item.name,
          title: item.title,
          phone: item.phone,
          empNo: item.empNo,
          blockName: item.blockName,
          workStatus: item.workStatus === 1 ? "在班" : "不在班",
          serviceClass: serviceClassMap.value[item.serviceClass]?.label,
          craft: craftMap[item.craft as keyof typeof craftMap],
          state: staffStateMap[item.state as keyof typeof staffStateMap],
          startDate: moment(item.startDate).format("YYYY-MM-DD"),
          updatedBy: item.updatedBy,
          updatedTime: item.updatedTime,
        };
      });
    };
    const selectedRowKeys = ref<string[]>([]);
    const tableColumns: RdTableColumnData[] = reactive([
      {
        title: "姓名",
        dataIndex: "name",
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "search",
        },
      },
      {
        title: "工号",
        dataIndex: "empNo",
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "search",
        },
      },
      {
        title: "联系方式",
        dataIndex: "phone",
        width: 140,
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "search",
        },
      },
      {
        title: "职称",
        dataIndex: "title",
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "search",
        },
      },
      {
        title: "业务",
        dataIndex: "serviceClass",
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "radio",
          defaultValue: "-1",
          filters: [
            {
              text: "全部",
              value: "-1",
            },
            {
              text: "秩序",
              value: "1",
            },
            {
              text: "环境",
              value: "2",
            },
            {
              text: "机电",
              value: "3",
            },
            {
              text: "客服",
              value: "4",
            },
            {
              text: "管理",
              value: "5",
            },
          ],
        },
      },
      {
        title: "角色",
        dataIndex: "craft",
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "radio",
          defaultValue: "-1",
          filters: [
            {
              text: "全部",
              value: "-1",
            },
            ...Object.keys(craftMap).map((k) => {
              return {
                text: craftMap[k as unknown as keyof typeof craftMap],
                value: k,
              };
            }),
          ],
        },
      },
      {
        title: "项目",
        dataIndex: "blockName",
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "状态",
        dataIndex: "state",
        ellipsis: true,
        tooltip: true,
        filterable: {
          align: "filter-bar",
          type: "radio",
          defaultValue: "-1",
          filters: [
            {
              text: "全部",
              value: "-1",
            },
            ...Object.keys(staffStateMap).map((k) => {
              return {
                text: staffStateMap[k as unknown as keyof typeof staffStateMap],
                value: k,
              };
            }),
          ],
        },
      },
      {
        title: "入职日期",
        dataIndex: "startDate",
        ellipsis: true,
        tooltip: true,
      },

      {
        title: "操作人",
        dataIndex: "updatedBy",
        ellipsis: true,
        tooltip: true,
        width: 100,
        filterable: {
          align: "filter-bar",
          type: "search",
        },
      },
      {
        title: "操作时间",
        dataIndex: "updatedTime",
        ellipsis: true,
        tooltip: true,
        width: 180,
        filterable: {
          align: "filter-bar",
          type: "range-picker",
        },
      },
    ]);
    const queryData = reactive<any>({
      serviceClass: "-1",
      craft: "-1",
      state: "-1",
    });
    const formatQueryData = (data: any) => {
      const q: any = {};
      if (data["updatedTime"]?.length > 0) {
        q["startUpdatedTime"] = moment(data["updatedTime"][0]).format("YYYY-MM-DD HH:mm:ss");
        q["endUpdatedTime"] = moment(data["updatedTime"][1]).add(1, "days").format("YYYY-MM-DD HH:mm:ss");
      }
      Object.keys(data).forEach((k) => {
        if (data[k] !== "-1" && data[k] !== -1 && data[k] !== "" && data[k] !== null && k != "createdTime" && k != "updatedTime") {
          q[k] = data[k];
        }
      });
      data.field && (q[data.field] = data.search);
      return q;
    };
    const del = Staff.delete;
    const dels = (selectedKeys: string[]) => {
      return Promise.all(
        selectedKeys.map((id) => {
          return Staff.delete(id);
        }),
      );
    };

    const appStore = useAppStore();
    const selected = ref(false);
    watch(selectedRowKeys, () => {
      if (selectedRowKeys.value.length === 0) {
        selected.value = false;
      } else {
        selected.value = true;
      }
    });
    return {
      //tableDataList,
      selectedRowKeys,
      selected,
      refSfTable,
      loadDataRef,
      formartLoadDataRef,
      tableColumns,
      queryData,
      formatQueryData,
      dels,
      del,
    };
  },
});
</script>

<style lang="less" scoped></style>
