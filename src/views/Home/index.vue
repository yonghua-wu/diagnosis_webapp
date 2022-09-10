<template>
  <div class="home-view">
    <div class="layout-navbar">
      <NavBar />
    </div>
    <div class="features">
      <div class="feature" @click="$router.push({ name: 'RealtimeVideo' })">
        <div class="pic">
          <img :src="require('@/assets/todo.svg')" alt="" />
        </div>
        <div class="title">巡检中心</div>
      </div>
      <div class="feature">
        <div class="pic">
          <img :src="require('@/assets/todo.svg')" alt="" />
        </div>
        <div class="title">设备管理</div>
      </div>
      <div class="feature">
        <div class="pic">
          <img :src="require('@/assets/todo.svg')" alt="" />
        </div>
        <div class="title">客户服务</div>
      </div>
      <div class="feature">
        <div class="pic">
          <img :src="require('@/assets/todo.svg')" alt="" />
        </div>
        <div class="title">系统管理</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "@/components/IndexLayout/NavBar.vue";
export default defineComponent({
  name: "home-view",
  components: {
    NavBar,
  },
  setup() {
    //
  },
});
</script>

<style lang="less" scoped>
@nav-size-height: 60px;
@layout-max-width: 1100px;
.home-view {
  .layout-navbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: @nav-size-height;
  }
  .features {
    padding-top: calc(60px + 12px);
    width: 1000px;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    // justify-content: space-between;
    align-content: flex-start;
    flex-wrap: wrap;
    .disabled {
      background-color: var(--color-fill-1);
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.08);
    }
    .feature {
      overflow: hidden;
      position: relative;
      width: 23%;
      margin-right: 2.6667%;
      margin-bottom: 36px;
      height: 220px;
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid var(--color-border-2);
      box-sizing: border-box;
      transition: all 0.2s;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      &:nth-child(4n) {
        margin-right: 0px;
      }
      &:hover {
        background-color: var(--color-fill-1);
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.08);
        .bg-img {
          opacity: 0.03;
        }
        .title {
          font-weight: 600;
          // color: $--color-primary;
        }
        .pic {
          img {
            max-height: 101px;
            max-width: 101px;
          }
        }
      }
      .bg-img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 400px;
        opacity: 0;
        transition: all 0.2s;
      }
      .pic {
        height: 75%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        img {
          transition: all 0.2s;
          max-width: 91px;
          max-height: 91px;
          height: 100%;
          width: 100%;
        }
      }
      .title {
        font-weight: 400;
      }
    }
  }
}
</style>
