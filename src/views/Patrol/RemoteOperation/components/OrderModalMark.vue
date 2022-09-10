<template>
  <div class="order-modal-mark">
    <div ref="order-modal-mark" class="mark" :id="'order-modal-mark' + imgKey" :style="'height:' + heightPx"></div>
    <span v-if="!(isView === true)">注：双击标注图形可进行选中编辑。</span>
  </div>
</template>

<script>
import AILabel from "ailabel";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    src: String,
    value: Array,
    isView: Boolean,
    imgKey: String,
  },
  data() {
    return {
      heightPx: "394px",
      gMap: null,
      rects: [],
    };
  },
  watch: {
    src() {
      if (this.src) {
        this.destoryLabelMap();
        this.createLabelMap(this.src);
      }
    },
  },
  mounted() {
    console.log(this.value, this.src);
    this.$nextTick(() => {
      if (this.src) {
        this.createLabelMap(this.src);
        window.onresize = () => {
          this.destoryLabelMap();
          this.createLabelMap(this.src);
        };
      }
    });
  },
  methods: {
    createLabelMap(src) {
      const w = this.$refs["order-modal-mark"].clientWidth;
      const h = (w / 16) * 9;
      this.heightPx = h + "px";
      this.$nextTick(() => {
        // 创建
        this.gMap = new AILabel.Map("order-modal-mark" + this.imgKey, {
          zoom: w,
          cx: 0,
          cy: 0,
          autoPan: true,
          drawZoom: true,
          mode: "BAN",
        });
        // 添加显示图片
        const gFirstImageLayer = new AILabel.Layer.Image(
          "first-layer-image", // id
          {
            src: src,
            width: w,
            height: h,
            position: {
              // 左上角坐标
              x: -(w / 2),
              y: -(h / 2),
            },
          },
          { zIndex: 1 }, // style
        );
        // 添加图层
        const gFirstFeatureLayer = new AILabel.Layer.Feature(
          "first-layer-feature", // id
          { name: "第一个矢量图层" }, // props
          { zIndex: 10 }, // style
        );
        const gFirstTextLayer = new AILabel.Layer.Text(
          "first-layer-text", // id
          { name: "第一个文本图层" }, // props
          { zIndex: 12, opacity: 1 }, // style
        );
        const AIDrawingStyle = { strokeStyle: "#ff0", lineWidth: 1 };
        const ManualDrawingStyle = { strokeStyle: "#0f0", lineWidth: 1 };
        this.gMap.addLayer(gFirstTextLayer);
        this.gMap.addLayer(gFirstImageLayer);
        this.gMap.addLayer(gFirstFeatureLayer);
        this.gMap.setDrawingStyle(ManualDrawingStyle);
        if (!(this.isView === true)) {
          this.gMap.setMode("RECT");
          //
        }
        // 画框事件
        this.gMap.events.on("drawDone", (type, data) => {
          console.log(data);
          const rectFeature = new AILabel.Feature.Rect(
            `${+new Date()}`, // id
            data, // shape
            { name: "矩形" }, // props
            ManualDrawingStyle, // style
          );
          gFirstFeatureLayer.addFeature(rectFeature);
          this.updateRects(gFirstFeatureLayer);
        });
        // 选中框选区域
        this.gMap.events.on("featureSelected", (feature) => {
          // 高亮选中feature
          this.gMap.setActiveFeature(feature);
          const markerId = feature.props.deleteMarkerId;
          const mappedMarker = this.gMap.markerLayer.getMarkerById(markerId);
          if (mappedMarker) {
            return;
          }
          // 添加delete-icon
          const gFirstMarker = new AILabel.Marker(
            markerId, // id
            {
              src: require("@/assets/delete.svg"),
              position: feature.getPoints()[1], // 矩形右上角
              offset: {
                x: -40,
                y: -4,
              },
            }, // markerInfo
            { name: "第一个marker注记" }, // props
          );
          gFirstMarker.events.on("click", (marker) => {
            // 首先删除当前marker
            this.gMap.markerLayer.removeMarkerById(marker.id);
            // 删除对应feature
            gFirstFeatureLayer.removeFeatureById(feature.id);
            gFirstTextLayer.removeTextById(marker + "text");
            this.updateRects(gFirstFeatureLayer);
          });
          this.gMap.markerLayer.addMarker(gFirstMarker);
        });
        // 取消选中
        this.gMap.events.on("featureUnselected", (feature) => {
          this.gMap.setActiveFeature(null);
          this.gMap.markerLayer.removeMarkerById(feature.props.deleteMarkerId);
        });
        // 监听调整框选位置
        this.gMap.events.on("featureUpdated", (feature, shape) => {
          feature.updateShape(shape);
          const markerId = feature.props.deleteMarkerId;
          // 更新marker位置
          const targetMarker = this.gMap.markerLayer.getMarkerById(markerId);
          targetMarker.updatePosition(feature.getPoints()[1]);
          // 更新文本位置
          const textMark = gFirstTextLayer.getTextById(feature.id + "text");
          textMark?.updatePosition(feature.getPoints()[0]);
          this.updateRects(gFirstFeatureLayer);
        });

        // 初始化已选中区域
        this.value &&
          this.value.forEach((rect) => {
            const rectFeature = new AILabel.Feature.Rect(
              `${+new Date()}`, // id
              {
                height: (rect.stopY - rect.startY) * h,
                width: (rect.stopX - rect.startX) * w,
                x: rect.startX * w - w / 2,
                y: rect.startY * h - h / 2,
              }, // shape
              { name: "矩形" }, // props
              rect.markType === "AI" ? AIDrawingStyle : ManualDrawingStyle, // style
            );
            let text = "";
            switch (rect.detectLabel) {
              case "LivingGarbage":
                text = "生活垃圾";
                break;
              case "ConstructionGarbage":
                text = "建筑垃圾";
                break;
              case "HeavyGarbage":
                text = "大件垃圾";
                break;
              case "GreenGarbage":
                text = "绿化垃圾";
                break;
              case "Trash":
                text = "垃圾桶";
                break;
              case "PERSON":
                text = "人";
                break;
              case "CAR":
                text = "汽车";
                break;
              case "TRUCK":
                text = "卡车";
                break;
              default:
                break;
            }
            const gFirstText = new AILabel.Text(
              rectFeature.id + "text", // id
              { text: text, position: rectFeature.getPoints()[0], offset: { x: 1, y: -19 } }, // shape
              { name: "第一个文本对象" }, // props
              { fillStyle: "#000", strokeStyle: "#000", background: true, globalAlpha: 1, fontColor: rect.markType === "AI" ? "#ff0" : "#0f0" }, // style
            );
            gFirstTextLayer.addText(gFirstText);
            gFirstFeatureLayer.addFeature(rectFeature);
            // this.updateRects(gFirstFeatureLayer);
          });
      });
    },
    destoryLabelMap() {
      this.gMap && this.gMap.destroy();
    },
    updateRects(feature) {
      const rects = feature.getAllFeatures().map((f) => {
        const w = f.layer.dom.clientWidth;
        const h = f.layer.dom.clientHeight;
        const r_w = f.shape.width;
        const r_h = f.shape.height;
        const r_x = w / 2 + f.shape.x;
        const r_y = h / 2 + f.shape.y;
        return {
          startX: r_x / w,
          startY: r_y / h,
          stopX: (r_w + r_x) / w,
          stopY: (r_h + r_y) / h,
        };
      });
      this.rects = rects;
      this.$emit("update-rects", rects);
    },
  },
  beforeUnmount() {
    this.destoryLabelMap();
    window.onresize = null;
  },
});
</script>

<style lang="less" scoped>
.order-modal-mark {
  .mark {
    height: 394px;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
}
</style>
