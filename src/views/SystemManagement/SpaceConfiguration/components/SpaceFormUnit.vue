<template>
  <div class="space-form-unit">
    <a-form :model="formData" @submit="handleSubmit" :label-col-props="{ span: 9 }" :wrapper-col-props="{ span: 15 }" style="max-width: 1500px">
      <a-space direction="vertical" fill>
        <a-space direction="vertical" fill>
          <a-row class="section-title">基本信息</a-row>
          <a-row class="section-body" :gutter="24">
            <a-col :span="8">
              <a-form-item field="unitNo" label="门牌号" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.unitNo" placeholder="门牌号" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="type" label="房屋类型" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.type" placeholder="房屋类型" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="residenceType" label="户型" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.residenceType" placeholder="户型" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="level" label="楼层" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.level" placeholder="楼层" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="govAddr" label="门牌号" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.govAddr" placeholder="请输入姓名" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="orientation" label="正厅朝向" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.orientation" placeholder="正厅朝向" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="height" label="层高" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.height" placeholder="层高" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="description" label="描述" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.description" placeholder="描述" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="liftRatio" label="梯户比" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.liftRatio" placeholder="梯户比" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="govCell" label="房产证官方地址" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.govCell" placeholder="房产证官方地址" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="layoutFile" label="户型图" :row-props="{ gutter: 24 }">
                <a-upload action="/" list-type="picture-card"></a-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-space>
        <a-space direction="vertical" fill>
          <a-row class="section-title">面积信息</a-row>
          <a-row class="section-body" :gutter="24">
            <a-col :span="8">
              <a-form-item field="areaCharging" label="计费面积 (m²)" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.areaCharging" placeholder="计费面积" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="areaConstruction" label="建筑面积 (m²)" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.areaConstruction" placeholder="建筑面积" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="areaPublic" label="公摊面积 (m²)" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.areaPublic" placeholder="公摊面积" />
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
              <!-- <a-button html-type="submit" type="text" v-if="model !== 'edit'">保存并继续添加</a-button> -->
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts">
import Unit from "@/api/tenant/Unit";
import { defineComponent, PropType, reactive, toRefs, watch, watchEffect } from "vue";
export default defineComponent({
  name: "space-form-unit",
  props: {
    placeInfo: {
      type: Object as PropType<any>,
      require: true,
    },
  },
  setup(props) {
    const { placeInfo } = toRefs(props);
    console.log(placeInfo.value);
    const formData = reactive({
      id: "",
      parentId: "",
      unitNo: "",
      type: "",
      residenceType: "",
      level: "",
      govAddr: "",
      orientation: "",
      description: "",
      govCell: "",
      height: "",
      layoutFile: "",
      liftRatio: "",
      areaCharging: "",
      areaConstruction: "",
      areaPublic: "",
    });

    const loadData = (placeId: string) => {
      Unit.getByPlaceId(placeId).then((res) => {
        formData.id = res.data.id;
        formData.parentId = res.data.parentId;
        formData.unitNo = res.data.unitNo;
        formData.type = res.data.type;
        formData.residenceType = res.data.residenceType;
        formData.level = res.data.level;
        formData.govAddr = res.data.govAddr;
        formData.orientation = res.data.orientation;
        formData.description = res.data.description;
        formData.govCell = res.data.govCell;
        formData.height = res.data.height;
      });
    };
    watchEffect(() => {
      loadData(placeInfo.value.placeId);
    });

    const handleSubmit = (data: any) => {
      console.log(data);
    };
    return {
      formData,
      handleSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.space-form-unit {
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-3);
  }
}
</style>
