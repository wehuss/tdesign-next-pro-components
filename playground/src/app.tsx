import { Divider, MessagePlugin } from "tdesign-vue-next";
import { defineComponent } from "vue";
import { FieldMoney } from "../../src/components";
import Pagination from "./components/Pagination.vue";

export default defineComponent({
  name: "PlaygroundApp",
  setup() {
    const handleClick = () => {
      MessagePlugin.success("TDesign Pro Components 开发环境运行正常！");
    };

    return () => (
      <div class="playground">
        <h1>TDesign Pro Components Playground</h1>
        <p>This is a development playground for testing components.</p>
        <Divider>基础组件测试</Divider>
        <FieldMoney modelValue={123} mode="edit" />
        <div style="height:1000px">
          <Pagination />
        </div>
      </div>
    );
  },
});
