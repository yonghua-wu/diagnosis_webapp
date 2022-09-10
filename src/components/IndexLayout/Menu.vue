<script lang="tsx">
import { defineComponent, computed, h, compile, ref, watch } from "vue";
import { useRouter, RouteRecordRaw, RouteRecordNormalized, onBeforeRouteUpdate, useRoute } from "vue-router";
import { useAppStore } from "@/store";
import { listenerRouteChange } from "@/utils/route-listener";
import Message from "@/utils/Message";

export default defineComponent({
  name: "MenuComponent",
  setup() {
    const router = useRouter();
    const appRoute = computed(() => {
      return router.getRoutes().find((el) => el.name === "root") as RouteRecordNormalized;
    });
    const appStore = useAppStore();
    const permissionsMap = computed(() => {
      const map: any = {};
      (appStore.permissions as string[])
        .filter((perm: string) => {
          return perm.split(":").length === 3;
        })
        .map((perm: string) => {
          return perm.split(":")[2];
        })
        .forEach((perm) => {
          map[perm] = true;
        });
      return map;
    });

    onBeforeRouteUpdate(async (to, from, next) => {
      const map: any = {};
      map["Login"] = true;
      map["ForgetPassword"] = true;
      map["Exception404"] = true;
      map["Exception403"] = true;
      map["Exception500"] = true;
      if (map[to.name as string]) {
        next();
      }
      const route = to;
      if (route) {
        const { meta } = route;
        if (meta && meta.permission) {
          const permissions = meta.permission as string;
          if (permissionsMap.value[permissions] !== true) {
            Message.error("没有权限");
            next("/403");
            return;
          }
        }
        next();
      }
    });
    const route = useRoute();
    const checkRoute = () => {
      const permissions = route.meta.permission as string;
      if (permissions && permissionsMap.value[permissions] !== true) {
        Message.error("没有权限");
        router.push("/403");
        return;
      }
      if (route.name === "root") {
        console.log(appRoute.value.children);
        // appRoute.value.children.forEach((r) => {
        const children = appRoute.value.children;
        for (let i = 0; i < children.length; i++) {
          if (children[i].meta?.permission && permissionsMap.value[children[i].meta?.permission as string] === true) {
            router.push({ name: children[i].name });
            return;
          } else if (children[i].children?.length) {
            const cc = children[i].children as RouteRecordRaw[];
            for (let j = 0; j < cc.length; j++) {
              if (cc[j].meta?.permission && permissionsMap.value[cc?.[j].meta?.permission as string] === true) {
                router.push({ name: cc[j].name });
                return;
              }
            }
          }
        }
      }
    };
    setTimeout(() => {
      checkRoute();
    }, 1);
    // appRoute.value

    const collapsed = computed({
      get() {
        if (appStore.device === "desktop") return appStore.menuCollapse;
        return false;
      },
      set(value: boolean) {
        appStore.updateSettings({ menuCollapse: value });
      },
    });

    const menuTree = computed(() => {
      const copyRouter = JSON.parse(JSON.stringify(appRoute.value.children));
      function travel(_routes: RouteRecordRaw[], layer: number) {
        if (!_routes) return null;
        const collector: any = _routes.map((element) => {
          if (!element.children) {
            return element;
          }
          const subItem = travel(element.children, layer + 1);
          if (subItem.length) {
            element.children = subItem;
            return element;
          }
          if (layer > 1) {
            element.children = subItem;
            return element;
          }
          return null;
        });
        return collector.filter(Boolean).filter((element: RouteRecordRaw) => !(element?.meta?.addToMenu === false));
      }
      return travel(copyRouter, 0);
    });
    // debugger;
    const selectedKey = ref<string[]>([]);
    const goto = (item: RouteRecordRaw) => {
      // debugger;
      router.push({
        name: item.name,
      });
    };
    listenerRouteChange((newRoute) => {
      const key = (
        newRoute.matched[3] ? newRoute.matched[3]?.name : newRoute.matched[2] ? newRoute.matched[2]?.name : newRoute.matched[1]?.name
      ) as string;
      selectedKey.value = [key];
    }, true);
    const setCollapse = (val: boolean) => {
      if (appStore.device === "desktop") appStore.updateSettings({ menuCollapse: val });
    };

    const renderSubMenu = () => {
      function travel(_route: RouteRecordRaw[], nodes = []) {
        if (_route) {
          _route.forEach((element) => {
            // This is demo, modify nodes as needed
            // console.log(element);
            const icon = element?.meta?.icon ? `<${element?.meta?.icon}/>` : ``;
            let subMenuItem;
            // if (element?.meta?.permission && permissionsMap.value[element?.meta?.permission as any]) {
            if (element?.children) {
              // 如果有子菜单则使用sub-menu
              const child = element?.children?.filter((elem) => {
                // console.log(elem, elem?.meta?.permission);
                if (elem?.meta?.permission) {
                  return elem?.meta?.permission ? permissionsMap.value[elem?.meta?.permission as any] || false : true;
                } else {
                  return true;
                }
              });
              if (child.length === 0) {
                subMenuItem = null;
              } else {
                subMenuItem = (
                  <a-sub-menu
                    key={element?.name}
                    v-slots={{
                      icon: () => h(compile(icon)),
                      title: () => h(compile(String(element?.meta?.locale || ""))),
                    }}
                  >
                    {travel(element.children ?? [])}
                  </a-sub-menu>
                );
              }
            } else {
              // 否则用menu-item
              if (element?.meta?.permission && permissionsMap.value[element?.meta?.permission as any]) {
                subMenuItem = (
                  <a-menu-item
                    key={element?.name}
                    onClick={() => goto(element)}
                    v-slots={{
                      icon: () => h(compile(icon)),
                    }}
                  >
                    {String(element?.meta?.locale || "")}
                  </a-menu-item>
                );
              } else {
                subMenuItem = null;
              }
            }
            nodes.push(subMenuItem as never);
          });
        }
        return nodes;
      }
      return travel(menuTree.value); // 递归menuTree
    };
    return () => (
      <a-menu
        v-model:collapsed={collapsed.value}
        show-collapse-button={appStore.device !== "mobile"}
        auto-open={false}
        selected-keys={selectedKey.value}
        auto-open-selected={true}
        style="height: 100%"
        onCollapse={setCollapse}
      >
        {renderSubMenu()}
      </a-menu>
    );
  },
});
</script>
<style lang="less" scoped>
:deep(.arco-menu-inner) {
  .arco-menu-inline-header {
    display: flex;
    align-items: center;
  }
  .arco-icon {
    &:not(.arco-icon-down) {
      font-size: 18px;
    }
  }
}
</style>
