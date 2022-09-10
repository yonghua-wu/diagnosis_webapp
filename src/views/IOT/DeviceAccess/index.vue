<template>
  <div class="container device-access">
    <Breadcrumb :items="['IOT设备', '设备管理']" />
    <a-card>
      <RDVue
        v-model="tableData"
        v-model:queryData="filterData"
        v-model:selectedRowKeys="selectedRowKeys"
        :tableColumn="columns"
        :decorateLoadData="loadData"
      >
      </RDVue>
    </a-card>
    <!-- <a-row :gutter="[12, 12]">
      <a-col flex="340px" v-for="item in Array(...Array(11)).map((k, i) => i)" :key="item" @click="() => clickBuilding(item)">
        <a-card :hoverable="true" :style="{ width: '340px', cursor: 'pointer' }">
          <template #cover>
            <div :style="{ height: '204px', overflow: 'hidden' }">
              <img
                :style="{ width: '100%' }"
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp"
              />
            </div>
          </template>
          <a-card-meta title="楼宇名称">
            <template #description>
              空间层级 / 空间层级 / 空间层级 <br />
              设备统计：18个
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import RDVue from "@/components/lib/RD";
import TbConnect from "@/utils/TbConnect";
import { formatDateTime } from "@/utils/utils";
import { TableColumnData } from "@arco-design/web-vue/es/table/interface";
export default defineComponent({
  name: "DeviceAccess",
  components: {
    Breadcrumb,
    RDVue,
  },
  setup() {
    const tableData = ref([]);
    const filterData = reactive({});
    const selectedRowKeys = ref([]);
    const columns: TableColumnData[] = [
      {
        title: "名称",
        dataIndex: "t_name",
      },
      {
        title: "设备配置",
        dataIndex: "t_deviceProfileName",
      },
      {
        title: "标签",
        dataIndex: "t_label",
      },
      {
        title: "客户",
        dataIndex: "t_customerTitle",
      },
      {
        title: "创建时间",
        dataIndex: "t_createdTime",
      },
    ];
    const loadData = (queryData: any) => {
      return TbConnect.getDevices(queryData.current - 1, queryData.pageSize).then((res: any) => {
        console.log("res", res);
        tableData.value = res.data
          .sort((a: any, b: any) => b.createdTime - a.createdTime)
          .map((item: any) => {
            return {
              key: item.id.id,
              t_name: item.name,
              t_deviceProfileName: item.deviceProfileName,
              t_label: item.label,
              t_customerTitle: item.customerTitle,
              t_createdTime: formatDateTime(item.createdTime),
            };
          });
        return {
          ...res,
          total: res.totalElements,
        };
      });
    };
    return {
      tableData,
      filterData,
      selectedRowKeys,
      columns,
      loadData,
    };
    // const router = useRouter();
    // const clickBuilding = (buildingId: number) => {
    //   router.push({
    //     name: "DeviceList",
    //     params: {
    //       buildingId,
    //     },
    //   });
    // };
    // return {
    // clickBuilding,
    // };
  },
});
</script>

<style lang="less" scoped>
.device-access {
  .building {
    height: 260px;
    background-color: var(--color-bg-1);
  }
  :deep(.arco-card-hoverable):hover {
    box-shadow: 0 4px 10px rgb(var(--gray-3));
  }
}
</style>
