<template>
  <div class="space-branch">
    <RDVue
      ref="refRDVue"
      v-model="tableData"
      v-model:queryData="filterData"
      v-model:selectedRowKeys="selectedRowKeys"
      :closePagination="true"
      :tableColumn="tableColumns"
      :decorateLoadData="loadData"
      @clickRow="clickRow"
    >
      <template #selected-options>
        <a-button :disabled="!selected" status="danger">删除</a-button>
        <a-button :disabled="!selected">导出</a-button>
      </template>
      <template #normal-options>
        <a-button>导入</a-button>
        <a-dropdown trigger="hover">
          <a-button type="primary">
            <template #icon>
              <icon-plus />
            </template>
            添加
          </a-button>
          <template #content>
            <a-doption @click="clickCreate">添加场所</a-doption>
            <a-doption @click="clickCreate">添加楼宇</a-doption>
            <a-doption @click="clickCreate">添加户室</a-doption>
          </template>
        </a-dropdown>
      </template>
    </RDVue>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref, toRefs, watch, watchEffect } from "vue";
import { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import RDVue from "@/components/lib/RD";
import { deepClone, formatDateTime } from "@/utils/utils";
import { PlaceModel } from "@/api/tenant/Place";
import Place from "@/api/tenant/Place";

interface ColumnsMap {
  [key: string]: TableColumnData[];
}

const columns: ColumnsMap = {
  place: [
    {
      title: "名称",
      dataIndex: "t_name",
    },
    {
      title: "类型",
      dataIndex: "t_type",
      ellipsis: true,
tooltip: true,
    },
    {
      title: "更新时间",
      dataIndex: "t_updateTime",
    },
    {
      title: "创建时间",
      dataIndex: "t_createTime",
    },
  ],
  block: [
    {
      title: "名称",
      dataIndex: "t_name",
    },
    {
      title: "地块类型",
      dataIndex: "t_type",
    },
    {
      title: "占地面积",
      dataIndex: "t_areaLand",
    },
    {
      title: "地址",
      dataIndex: "t_address",
    },
    {
      title: "更新时间",
      dataIndex: "t_updateTime",
    },
    {
      title: "创建时间",
      dataIndex: "t_createTime",
    },
  ],
  building: [
    {
      title: "名称",
      dataIndex: "t_name",
    },
    {
      title: "楼栋类型",
      dataIndex: "t_areaLand",
    },
    {
      title: "总户数",
      dataIndex: "t_type",
    },
    {
      title: "更新时间",
      dataIndex: "t_updateTime",
    },
    {
      title: "创建时间",
      dataIndex: "t_createTime",
    },
  ],
};

export default defineComponent({
  name: "space-branch",
  components: {
    RDVue,
  },
  props: {
    list: {
      type: Object as PropType<PlaceModel[]>,
      required: true,
    },
    parentId: {
      type: String as PropType<string>,
      required: true,
      default: () => "",
    },
    type: {
      type: String as PropType<string>,
      required: true,
      default: () => "block",
    },
  },
  setup(props, ctx) {
    const { list, parentId, type } = toRefs(props);
    const tableColumns = computed(() => columns[type.value]);
    const refRDVue = ref();
    const filterData = reactive({
      search: "",
    });
    const tableData = ref<any[]>([]);

    const tableDataFormat = (data: PlaceModel[]) => {
      return data.map((item, index) => {
        const t: any = deepClone(item);
        delete t.children;
        return {
          ...t,
          key: index,
          updateTime: t.updatedTime,
        };
      });
    };

    watchEffect(() => {
      // list.value.then((data) => {
      //   tableData.value = data.map((item, index) => {
      //     const t: any = deepClone(item);
      //     delete t.children;
      //     t.key = index;
      //     return t;
      //   });
      // });
    });

    const loadData = () => {
      return Promise.resolve();
      // if (parentId.value !== "") {
      //   return Place.getItemTree(parentId.value).then((res) => {
      //     tableData.value = res.map((item, index) => {
      //       const t: any = deepClone(item);
      //       delete t.children;
      //       t.key = index;
      //       return t;
      //     });
      //     return res;
      //   });
      // } else {
      //   return list.value.then((data) => data);
      // }
    };

    const selectedRowKeys = ref<string[]>([]);
    const selected = ref(false);
    watch(selectedRowKeys, () => {
      if (selectedRowKeys.value.length === 0) {
        selected.value = false;
      } else {
        selected.value = true;
      }
    });

    const clickCreate = () => {
      //
    };
    const clickDelete = () => {
      console.log("selectedRowKeys", selectedRowKeys.value);
    };
    const clickRow = (record: any) => {
      console.log("record", record);
    };

    return {
      refRDVue,
      filterData,
      tableColumns,
      tableData,
      selectedRowKeys,
      selected,
      loadData,
      clickCreate,
      clickDelete,
      clickRow,
    };
  },
});
</script>

<style lang="less" scoped>
.space-branch {
  :deep(.arco-table-tr) {
    cursor: pointer;
  }
  .switch-menu {
    height: 32px;
    margin-bottom: 8px;
    // border-bottom: 1px solid var(--color-border-2);
    :deep(.arco-menu-inner) {
      padding: unset;
    }
    :deep(.arco-menu-selected-label) {
      bottom: 0px;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      cursor: unset;
      text-align: left;
      color: var(--color-text-2);
      margin-left: 0px;
      padding-left: 0px;
    }
  }
}
</style>
