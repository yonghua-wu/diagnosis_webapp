<script lang="tsx">
import { defineComponent, PropType, toRefs } from "vue";
import { useRouter } from "vue-router";

interface Item {
  name: string;
  router: () => void;
}

type Items = Item | string;

export default defineComponent({
  name: "BreadcrumbComponent",
  props: {
    items: {
      type: Array as PropType<Items[]>,
      default: () => [],
    },
  },
  setup(props) {
    const router = useRouter();
    const { items } = toRefs(props);
    return () => (
      <a-breadcrumb class="container-breadcrumb">
        <a-breadcrumb-item>
          <icon-apps />
        </a-breadcrumb-item>
        {items.value.map((item, index) => {
          if (typeof item == "string") {
            return <a-breadcrumb-item key={index}>{item}</a-breadcrumb-item>;
          } else {
            return (
              <a-breadcrumb-item key={index} onClick={() => item.router()} class="breadcrumb-clickable">
                {item.name}
              </a-breadcrumb-item>
            );
          }
        })}
      </a-breadcrumb>
    );
  },
});
</script>

<style scoped lang="less">
.container-breadcrumb {
  margin: 16px 0;
  :deep(.breadcrumb-clickable) {
    cursor: pointer;
    &:hover {
      color: rgb(var(--primary-6));
    }
  }
}
</style>
