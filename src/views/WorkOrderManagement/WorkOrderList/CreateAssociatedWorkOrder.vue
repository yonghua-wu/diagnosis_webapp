<template>
  <div class="create-associated-work-order container">
    <Breadcrumb
      :items="['工单管理', { name: '工单列表', router: () => $router.go(-2) }, { name: '详情', router: () => $router.go(-1) }, '添加关联工单']"
    />
    <a-card>
      <template #title>
        <a-button shape="circle" type="text" @click="goBack('WorkOrderList')">
          <icon-left />
        </a-button>
        <span>添加关联工单</span>
      </template>
      <WorkCreateChildrenOrder :type="'WORK_ORDER'" :min-order-count="1"></WorkCreateChildrenOrder>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WorkCreateChildrenOrder from "@/components/Work/WorkCreateChildrenOrder.vue";
import { useRouterManager } from "@/components/lib/CU/CU";
import Breadcrumb from "@/components/Breadcrumb.vue";
export default defineComponent({
  name: "create-associated-work-order",
  components: {
    WorkCreateChildrenOrder,
    Breadcrumb,
  },
  setup() {
    const { goBack } = useRouterManager();
    return {
      goBack,
    };
  },
});
</script>

<style lang="less" scoped>
.create-associated-work-order {
}
</style>
