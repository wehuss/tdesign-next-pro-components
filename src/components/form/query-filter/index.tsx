import {
  ChevronDownIcon,
  ChevronUpIcon,
  RefreshIcon,
  SearchIcon,
} from "tdesign-icons-vue-next";
import { Button, Col, FormItem, Row, Space } from "tdesign-vue-next";
import type { VNode } from "vue";
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { BaseForm } from "../base-form/base-form";

// 配置表单列变化的容器宽度断点
const BREAKPOINTS = {
  vertical: [
    [513, 1, "vertical"],
    [785, 2, "vertical"],
    [1057, 3, "vertical"],
    [Infinity, 4, "vertical"],
  ],
  default: [
    [513, 1, "vertical"],
    [701, 2, "vertical"],
    [1062, 3, "horizontal"],
    [1352, 3, "horizontal"],
    [Infinity, 4, "horizontal"],
  ],
  horizontal: [
    [513, 1, "vertical"],
    [701, 2, "vertical"],
    [1062, 3, "horizontal"],
    [1352, 3, "horizontal"],
    [Infinity, 4, "horizontal"],
  ],
};

export type SpanConfig =
  | number
  | {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };

export interface QueryFilterProps {
  // 查询表单特有属性
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  collapseRender?:
    | ((
        collapsed: boolean,
        showCollapseButton: boolean,
        hiddenNum?: number
      ) => VNode)
    | false;
  optionRender?:
    | ((searchConfig: any, formProps: any, dom: VNode[]) => VNode[])
    | false;
  searchText?: string;
  resetText?: string;
  submitButtonProps?: any;
  resetButtonProps?: any;
  // 布局相关
  layout?: "vertical" | "inline" | "horizontal";
  span?: SpanConfig;
  labelWidth?: number | "auto";
  defaultColsNumber?: number;
  defaultFormItemsNumber?: number;
  searchGutter?: number;
  split?: boolean;
  // 是否显示隐藏数量
  showHiddenNum?: boolean;
  // 是否忽略规则
  ignoreRules?: boolean;
  // 是否保留隐藏字段
  preserve?: boolean;
  // 容器样式
  containerStyle?: Record<string, any>;
  // 事件回调
  onCollapse?: (collapsed: boolean) => void;
  onSearch?: (values: any) => void;
  onReset?: (values: any) => void;
}

// 获取 span 配置
const getSpanConfig = (
  layout: string | undefined,
  width: number,
  span?: SpanConfig
): { span: number; layout: string } => {
  if (span && typeof span === "number") {
    return { span, layout: layout || "horizontal" };
  }

  console.log("layout", layout);
  const spanConfig =
    BREAKPOINTS[(layout as "default" | "vertical") || "default"];
  const breakPoint = spanConfig.find(
    (item) => width < (item[0] as number) + 16
  );

  if (!breakPoint) {
    return { span: 8, layout: "horizontal" };
  }

  return {
    span: 24 / (breakPoint[1] as number),
    layout: breakPoint[2] as string,
  };
};

export const QueryFilter = defineComponent({
  name: "QueryFilter",
  props: {
    // QueryFilter 特有属性
    defaultCollapsed: {
      type: Boolean,
      default: true,
    },
    collapsed: {
      type: Boolean,
      default: undefined,
    },
    collapseRender: {
      type: [Function, Boolean],
      default: undefined,
    },
    optionRender: {
      type: [Function, Boolean],
      default: undefined,
    },
    searchText: {
      type: String,
      default: "搜索",
    },
    resetText: {
      type: String,
      default: "重置",
    },
    submitButtonProps: {
      type: Object,
      default: () => ({}),
    },
    resetButtonProps: {
      type: Object,
      default: () => ({}),
    },
    layout: {
      type: String,
      default: "horizontal",
    },
    span: {
      type: [Number, Object],
    },
    labelWidth: {
      type: [Number, String],
      default: 80,
    },
    defaultColsNumber: {
      type: Number,
    },
    defaultFormItemsNumber: {
      type: Number,
    },
    searchGutter: {
      type: Number,
      default: 24,
    },
    split: {
      type: Boolean,
      default: false,
    },
    showHiddenNum: {
      type: Boolean,
      default: false,
    },
    ignoreRules: {
      type: Boolean,
      default: false,
    },
    preserve: {
      type: Boolean,
      default: true,
    },
    containerStyle: {
      type: Object,
      default: () => ({}),
    },
    onCollapse: {
      type: Function,
    },
    onSearch: {
      type: Function,
    },
    onReset: {
      type: Function,
    },
  },
  emits: ["update:collapsed", "collapse", "search", "reset", "finish"],
  setup(props, { slots, emit, expose }) {
    const formRef = ref();
    const containerRef = ref<HTMLDivElement>();
    const containerWidth = ref(1024);
    const internalCollapsed = ref(props.collapsed ?? props.defaultCollapsed);

    // 监听外部 collapsed 变化
    watch(
      () => props.collapsed,
      (newVal) => {
        if (newVal !== undefined) {
          internalCollapsed.value = newVal;
        }
      }
    );

    // 计算 span 配置
    const spanSize = computed(() =>
      getSpanConfig(
        props.layout,
        containerWidth.value + 16,
        props.span as SpanConfig
      )
    );

    // 计算显示数量
    const showLength = computed(() => {
      if (props.defaultFormItemsNumber !== undefined) {
        return props.defaultFormItemsNumber;
      }
      if (props.defaultColsNumber !== undefined) {
        const oneRowControlsNumber = 24 / spanSize.value.span - 1;
        return props.defaultColsNumber > oneRowControlsNumber
          ? oneRowControlsNumber
          : props.defaultColsNumber;
      }
      return Math.max(1, 24 / spanSize.value.span - 1);
    });

    // 切换折叠状态
    const toggleCollapsed = () => {
      const newCollapsed = !internalCollapsed.value;
      internalCollapsed.value = newCollapsed;
      emit("update:collapsed", newCollapsed);
      (props.onCollapse as any)?.(newCollapsed);
      emit("collapse", newCollapsed);
    };

    // 处理搜索
    const handleSearch = async () => {
      try {
        const values = formRef.value?.getFieldsValue?.() || {};
        (props.onSearch as any)?.(values);
        emit("search", values);
        emit("finish", values);
      } catch (error) {
        console.error("Query filter search error:", error);
      }
    };

    // 处理重置
    const handleReset = () => {
      formRef.value?.reset?.();
      const values = formRef.value?.getFieldsValue?.() || {};
      (props.onReset as any)?.(values);
      emit("reset", values);
    };

    // 监听容器宽度变化
    let resizeObserver: ResizeObserver | null = null;

    onMounted(() => {
      if (containerRef.value) {
        containerWidth.value = containerRef.value.offsetWidth;

        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.contentRect.width > 17) {
              containerWidth.value = entry.contentRect.width;
            }
          }
        });
        resizeObserver.observe(containerRef.value);
      }
    });

    onUnmounted(() => {
      resizeObserver?.disconnect();
    });

    // 暴露方法
    expose({
      submit: handleSearch,
      reset: handleReset,
      validate: () => formRef.value?.validate(),
      getFieldsValue: () => formRef.value?.getFieldsValue(),
      setFieldsValue: (values: any) => formRef.value?.setFieldsValue(values),
    });

    // 内容渲染
    const contentRender = (items: VNode[], submitter: VNode | null) => {
      // 处理表单项
      let totalSpan = 0;
      let totalSize = 0;
      let hiddenCount = 0;

      const processedItems = (items || []).map((item: any, index: number) => {
        const colSize = item?.props?.colSize ?? 1;
        const colSpan = Math.min(spanSize.value.span * colSize, 24);
        totalSpan += colSpan;
        totalSize += colSize;

        const hidden =
          item?.props?.hidden ||
          (internalCollapsed.value &&
            totalSize > showLength.value &&
            index > 0);

        if (hidden) {
          hiddenCount++;
          if (!props.preserve) {
            return null;
          }
        }

        const itemKey = item?.key || item?.props?.name || index;

        return (
          <Col
            key={itemKey}
            span={colSpan}
            style={{ display: hidden ? "none" : undefined }}
            class="pro-query-filter-row-split"
          >
            {item}
          </Col>
        );
      });

      // 计算 offset
      const currentSpan = totalSpan % 24;
      const submitterSpan = spanSize.value.span;
      const offsetSpan = currentSpan + submitterSpan;
      const offset = offsetSpan > 24 ? 24 - submitterSpan : 24 - offsetSpan;

      // 是否需要显示折叠按钮
      const needCollapseRender =
        totalSpan >= 24 || totalSize > showLength.value;

      // 默认操作按钮
      const defaultActions = [
        <Button
          key="search"
          theme="primary"
          icon={() => <SearchIcon />}
          onClick={handleSearch}
          {...props.submitButtonProps}
        >
          {props.searchText}
        </Button>,
        <Button
          key="reset"
          variant="outline"
          icon={() => <RefreshIcon />}
          onClick={handleReset}
          {...props.resetButtonProps}
        >
          {props.resetText}
        </Button>,
      ];

      // 折叠按钮
      const collapseButton =
        props.collapseRender !== false && needCollapseRender ? (
          typeof props.collapseRender === "function" ? (
            (props.collapseRender as any)(
              internalCollapsed.value,
              needCollapseRender,
              props.showHiddenNum ? hiddenCount : undefined
            )
          ) : (
            <Button
              key="collapse"
              variant="text"
              onClick={toggleCollapsed}
              style={{ paddingLeft: "8px" }}
            >
              {internalCollapsed.value ? "展开" : "收起"}
              {props.showHiddenNum && hiddenCount > 0 && (
                <span style={{ marginLeft: "4px" }}>({hiddenCount})</span>
              )}
              {internalCollapsed.value ? (
                <ChevronDownIcon style={{ marginLeft: "4px" }} />
              ) : (
                <ChevronUpIcon style={{ marginLeft: "4px" }} />
              )}
            </Button>
          )
        ) : null;

      // 操作区域
      const actionsNode =
        props.optionRender !== false
          ? typeof props.optionRender === "function"
            ? (props.optionRender as any)(
                { resetText: props.resetText, searchText: props.searchText },
                props,
                defaultActions
              )
            : defaultActions
          : null;

      return (
        <Row
          gutter={props.searchGutter}
          justify="start"
          class="pro-query-filter-row"
        >
          {processedItems}
          {actionsNode && (
            <Col
              key="submitter"
              span={submitterSpan}
              offset={offset}
              style={{ textAlign: "end" }}
            >
              <FormItem label=" " class="pro-query-filter-actions">
                <Space>
                  {actionsNode}
                  {collapseButton}
                </Space>
              </FormItem>
            </Col>
          )}
        </Row>
      );
    };

    return () => (
      <div
        ref={containerRef}
        class="pro-query-filter-container"
        style={props.containerStyle}
      >
        <BaseForm
          ref={formRef}
          layout={spanSize.value.layout as "vertical" | "inline"}
          isKeyPressSubmit
          class="pro-query-filter"
          onReset={handleReset}
          contentRender={contentRender}
          submitter={false}
          fieldProps={{
            style: { width: "100%" },
          }}
        >
          {slots.default?.()}
        </BaseForm>
      </div>
    );
  },
});

export default QueryFilter;
