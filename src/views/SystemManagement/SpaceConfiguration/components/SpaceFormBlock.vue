<template>
  <div class="space-form-block">
    <a-form :model="formData" @submit="handleSubmit" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }" style="max-width: 1500px">
      <a-space direction="vertical" fill>
        <a-space direction="vertical" fill>
          <a-row class="section-title">基本信息</a-row>
          <a-row class="section-body" :gutter="24">
            <a-col :span="8">
              <a-form-item field="name" label="地块名称" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.name" placeholder="请输入地块名称" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="pinyin" label="名称的拼音" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.pinyin" placeholder="请输入拼音" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="plotRatio" label="容积率" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.plotRatio" placeholder="请输入容积率" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="landType" label="地块类型" :row-props="{ gutter: 24 }">
                <a-select v-model="formData.landType" placeholder="请选择地块类型">
                  <a-option :value="1" label="住在小区" />
                  <a-option :value="2" label="商业地产" />
                  <a-option :value="3" label="工业园区" />
                  <a-option :value="4" label="其他" />
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="dateAcquire" label="拿地时间" :row-props="{ gutter: 24 }">
                <a-date-picker v-model="formData.dateAcquire" placeholder="拿地时间" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="remark" label="描述" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.remark" placeholder="请输入描述" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="layoutFile" label="小区布局" :row-props="{ gutter: 24 }">
                <a-upload action="/" list-type="picture-card"></a-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-space>
        <a-space direction="vertical" fill>
          <a-row class="section-title">地址信息</a-row>
          <a-row class="section-body" :gutter="24">
            <a-col :span="8">
              <a-form-item field="city" label="省市县" :row-props="{ gutter: 24 }">
                <AreaSelect v-model="formData.city" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="vilage" label="街道" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.vilage" placeholder="请选择街道" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="community" label="所在社区" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.community" placeholder="请选择社区" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="latitude" label="纬度" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.latitude" placeholder="请输入纬度" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="longitude" label="经度" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.longitude" placeholder="请输入经度" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="mapSource" label="经纬度来源" :row-props="{ gutter: 24 }">
                <a-select v-model="formData.mapSource" placeholder="请输入经纬度来源">
                  <a-option :value="1" label="百度" />
                  <a-option :value="2" label="腾讯" />
                  <a-option :value="3" label="高德" />
                  <a-option :value="4" label="苹果" />
                  <a-option :value="5" label="谷歌" />
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="postalCode" label="邮编" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.postalCode" placeholder="请输入邮编" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="boundaries" label="周围路名" :row-props="{ gutter: 24 }">
                <a-input :max-length="50" v-model="formData.boundaries" placeholder="请输入路名" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-space>
        <a-space direction="vertical" fill>
          <a-row class="section-title">面积信息</a-row>
          <a-row class="section-body" :gutter="24">
            <a-col :span="8">
              <a-form-item field="areaBusiness" label="商用面积 (m²)" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.areaBusiness" placeholder="请输入商用面积" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="areaConstructaion" label="建筑面积 (m²)" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.areaConstructaion" placeholder="请输入建筑面积" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="areaGreen" label="绿化面积 (m²)" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.areaGreen" placeholder="请输入绿化面积" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="areaIndustry" label="产业面积 (m²)" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.areaIndustry" placeholder="请输入产业面积" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="areaLand" label="占地面积 (m²)" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.areaLand" placeholder="请输入占地面积" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="areaResidence" label="住宅面积 (m²)" :row-props="{ gutter: 24 }">
                <a-input-number v-model="formData.areaResidence" placeholder="请输入住宅面积" />
              </a-form-item>
            </a-col>
          </a-row>
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
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
import AreaSelect from "@/components/lib/AreaSelect.vue";
export default defineComponent({
  name: "space-form-block",
  components: {
    AreaSelect,
  },
  setup() {
    //
    function useForm() {
      const formData = reactive({
        id: "",
        parentId: "",
        areaBusiness: "",
        areaConstructaion: "",
        areaGreen: "",
        areaIndustry: "",
        areaLand: "",
        areaResidence: "",
        boundaries: "",
        city: "",
        community: "",
        dateAcquire: "",
        landType: "",
        latitude: "",
        layoutFile: "",
        longitude: "",
        mapSource: "",
        name: "",
        pinyin: "",
        plotRatio: "",
        postalCode: "",
        province: "",
        remark: "",
        town: "",
        vilage: "",
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

<style lang="scss" scoped>
.space-form-block {
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--color-text-3);
  }
}
</style>
