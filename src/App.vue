<template>
  <router-view />
</template>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  max-width: 2560px;
  margin: 0 auto;
  position: relative;
}

.trigger {
  padding: 10px;
  width: 200px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}

.arco-picker {
  width: 100%;
}

::-webkit-scrollbar {
  width: 14px; /* 纵向滚动条*/
  height: 14px; /* 横向滚动条 */
  // padding: 4px;
  background-color: rgba(0, 0, 0, 0);
}

/*定义滚动条轨道 内阴影*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  background-color: rgba(0, 0, 0, 0);
}

/*定义滑块 内阴影*/
::-webkit-scrollbar-thumb {
  border: 5px solid transparent;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  // background-color: #ccc;
  // border-radius: 16px;
  background-clip: padding-box;
  border-radius: 7px;
  background-color: var(--color-text-4);
  transition: all 2s;
}
::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-text-3);
}
.container {
  padding: 0 20px 0px 20px;
}
@media screen and (max-width: 800px) {
  .container {
    padding: 0 8px 0px 8px !important;
  }
}
</style>
