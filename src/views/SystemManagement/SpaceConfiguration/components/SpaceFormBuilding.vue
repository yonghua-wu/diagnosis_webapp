<template>
  <div class="space-form-building">
    <a-form :model="formData" @submit="handleSubmit" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }">
      <a-space direction="vertical" fill>
        <a-space direction="vertical" fill>
          <a-row class="section-title">基本信息</a-row>
          <a-row class="section-body" :gutter="24">
            <a-col :span="8">
              <a-form-item field="name" label="名称" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.name" placeholder="名称" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="cellGateNo" label="单元门数量" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.cellGateNo" placeholder="占地面积" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="totalUnit" label="总房间数" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.totalUnit" placeholder="交付日期" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="unitCount" label="总户间数" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.unitCount" placeholder="交付日期" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="height" label="层高 (m)" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.height" placeholder="层高" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="levelOnGroud" label="地上层数" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.levelOnGroud" placeholder="地上层数" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="levelBelowGround" label="地下层数" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.levelBelowGround" placeholder="地下层数" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="areaLand" label="占地面积 (m²)" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.areaLand" placeholder="占地面积" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="area" label="总面积 (m²)" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.area" placeholder="占地面积" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="top" label="交付日期" :row-props="{ gutter: 24 }">
                <a-date-picker v-model="formData.top" placeholder="交付日期" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-space>
        <a-space direction="vertical" fill>
          <a-row class="section-title">类型构造</a-row>
          <a-row class="section-body" :gutter="24">
            <a-col :span="8">
              <a-form-item field="structureLoad" label="称重结构" :row-props="{ gutter: 24 }">
                <a-select v-model="formData.structureLoad" placeholder="称重结构">
                  <a-option :value="1" label="排架" />
                  <a-option :value="2" label="框架" />
                  <a-option :value="3" label="剪刀墙" />
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="structureMaterial" label="建材结构" :row-props="{ gutter: 24 }">
                <a-select v-model="formData.structureMaterial" placeholder="建材结构">
                  <a-option :value="1" label="土木" />
                  <a-option :value="2" label="砖木" />
                  <a-option :value="3" label="砖瓦" />
                  <a-option :value="4" label="混凝土" />
                  <a-option :value="5" label="金属" />
                  <a-option :value="6" label="玻璃" />
                  <a-option :value="7" label="工程塑料" />
                  <a-option :value="8" label="复合材料" />
                  <a-option :value="99" label="其他" />
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="typeBuilding" label="楼栋类型" :row-props="{ gutter: 24 }">
                <a-select v-model="formData.typeBuilding" placeholder="楼栋类型">
                  <a-option :value="1" label="住宅" />
                  <a-option :value="2" label="综合体" />
                  <a-option :value="3" label="商写" />
                  <a-option :value="4" label="商场" />
                  <a-option :value="5" label="其他" />
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="typeConstruction" label="建筑类型" :row-props="{ gutter: 24 }">
                <a-select v-model="formData.typeConstruction" placeholder="建筑类型">
                  <a-option :value="1" label="高层" />
                  <a-option :value="2" label="中高层" />
                  <a-option :value="3" label="中层" />
                  <a-option :value="4" label="中低层" />
                  <a-option :value="5" label="低层" />
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-space>
      </a-space>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item>
            <a-space>
              <a-button html-type="submit" type="primary">保存</a-button>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
export default defineComponent({
  name: "space-form-building",
  setup() {
    //
    function useForm() {
      const formData = reactive({
        id: "",
        parentId: "",
        name: "",
        areaLand: "",
        area: "",
        top: "",
        cellGateNo: "",
        totalUnit: "",
        unitCount: "",
        levelOnGroud: "",
        levelBelowGround: "",
        height: "",
        structureLoad: "",
        structureMaterial: "",
        typeBuilding: "",
        typeConstruction: "",
      });
      watch(formData, () => {
        // showBackModal.value = true;
      });
      const handleSubmit = (data: any) => {
        console.log(data);
      };
      return {
        formData,
        handleSubmit,
      };
    }
    const { formData, handleSubmit } = useForm();
    return {
      formData,
      handleSubmit,
    };
  },
});
</script>

<style lang="less" scoped>
.space-form-building {
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-3);
  }
}
</style>
