import { FilterIcon } from "tdesign-icons-vue-next";
import { Popup, Space } from "tdesign-vue-next";
import type { VNode } from "vue";
import { cloneVNode, computed, defineComponent, ref, watch } from "vue";
import { BaseForm } from "../base-form/base-form";
import type { LightFilterFooterRender } from "../typing";

export interface LightFilterProps {
  // 轻量筛选器特有属性
  /** 是否折叠所有字段 */
  collapse?: boolean;
  /** 收起的 label dom */
  collapseLabel?: VNode;
  /** 组件样式变体 */
  variant?: "outlined" | "filled" | "borderless";
  /** 忽略 rules */
  ignoreRules?: boolean;
  /** 自定义 footerRender */
  footerRender?: LightFilterFooterRender;
  /** 弹出位置 */
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  /** 尺寸 */
  size?: "small" | "medium" | "large";
  /** 初始值 */
  initialValues?: Record<string, any>;
  /** 表单数据 */
  data?: Record<string, any>;
  // 事件回调
  onFinish?: (values: any) => void;
  onReset?: () => void;
  onValuesChange?: (changedValues: any, allValues: any) => void;
}

export const LightFilter = defineComponent({
  name: "LightFilter",
  props: {
    // LightFilter 特有属性
    collapse: {
      type: Boolean,
      default: false,
    },
    collapseLabel: {
      type: Object,
    },
    variant: {
      type: String,
      default: "outlined",
    },
    ignoreRules: {
      type: Boolean,
      default: false,
    },
    footerRender: {
      type: [Function, Boolean],
    },
    placement: {
      type: String,
      default: "bottom-left",
    },
    size: {
      type: String,
      default: "medium",
    },
    initialValues: {
      type: Object,
      default: () => ({}),
    },
    onFinish: {
      type: Function,
    },
    onReset: {
      type: Function,
    },
    onValuesChange: {
      type: Function,
    },
    data: {
      type: Object,
      default: undefined,
    },
  },
  emits: ["finish", "reset", "valuesChange"],
  setup(props, { slots, emit, expose }) {
    const formRef = ref();
    const formValues = ref<Record<string, any>>({});
    const moreValues = ref<Record<string, any>>({});
    const popupVisible = ref(false);

    // 监听初始值
    watch(
      () => props.initialValues,
      (newVal) => {
        if (newVal) {
          formValues.value = { ...newVal };
          moreValues.value = { ...newVal };
        }
      },
      { immediate: true }
    );

    // 处理表单值变化
    const handleValuesChange = (changedValues: any, allValues: any) => {
      formValues.value = allValues;
      (props.onValuesChange as any)?.(changedValues, allValues);
      emit("valuesChange", changedValues, allValues);

      // 自动提交
      formRef.value?.submit?.();
    };

    // 处理重置
    const handleReset = () => {
      formRef.value?.reset?.();
      formValues.value = {};
      moreValues.value = {};
      (props.onReset as any)?.();
      emit("reset");
    };

    // 处理提交
    const handleFinish = (values: any) => {
      (props.onFinish as any)?.(values);
      emit("finish", values);
    };

    // 处理折叠区域确认
    const handleCollapseConfirm = () => {
      const newValues = { ...formValues.value, ...moreValues.value };
      formValues.value = newValues;
      formRef.value?.setFieldsValue?.(newValues);
      formRef.value?.submit?.();
      popupVisible.value = false;
    };

    // 处理折叠区域清除
    const handleCollapseClear = () => {
      // 清除折叠区域的值
      const clearValues: Record<string, any> = {};
      Object.keys(moreValues.value).forEach((key) => {
        clearValues[key] = undefined;
      });
      moreValues.value = {};
      const newValues = { ...formValues.value, ...clearValues };
      formValues.value = newValues;
      formRef.value?.setFieldsValue?.(newValues);
    };

    // 是否有有效值
    const hasEffectiveValue = computed(() => {
      return Object.keys(formValues.value).some((key) => {
        const value = formValues.value[key];
        return Array.isArray(value)
          ? value.length > 0
          : value !== undefined && value !== null && value !== "";
      });
    });

    // 暴露方法
    expose({
      reset: handleReset,
      submit: () => formRef.value?.submit?.(),
      getFieldsValue: () => formRef.value?.getFieldsValue?.(),
      setFieldsValue: (values: any) => formRef.value?.setFieldsValue?.(values),
    });

    // 内容渲染
    const contentRender = (items: VNode[]) => {
      const outsideItems: VNode[] = [];
      const collapseItems: VNode[] = [];

      // 分离外部项和折叠项
      (items || []).forEach((item: any) => {
        const secondary = item?.props?.secondary;
        if (secondary || props.collapse) {
          collapseItems.push(item);
        } else {
          outsideItems.push(item);
        }
      });

      // 渲染折叠标签
      const renderCollapseLabel = () => {
        if (props.collapseLabel) {
          return props.collapseLabel;
        }
        if (props.collapse) {
          return <FilterIcon class="pro-light-filter-collapse-icon" />;
        }
        return <span class="pro-light-filter-label">更多筛选</span>;
      };

      // 渲染折叠内容
      const renderCollapseContent = () => {
        return (
          <div class="pro-light-filter-dropdown">
            {collapseItems.map((child: any, index) => {
              const key = child?.key || index;
              const name = child?.props?.name;
              const fieldProps = child?.props?.fieldProps || {};

              const newFieldProps = {
                ...fieldProps,
                onChange: (e: any) => {
                  const value = e?.target ? e.target.value : e;
                  moreValues.value = {
                    ...moreValues.value,
                    [name]: value,
                  };
                },
              };

              // 设置当前值
              if (name && moreValues.value.hasOwnProperty(name)) {
                newFieldProps.value = moreValues.value[name];
              }

              return (
                <div class="pro-light-filter-line" key={key}>
                  {cloneVNode(child, {
                    fieldProps: newFieldProps,
                  })}
                </div>
              );
            })}

            {/* Footer */}
            {props.footerRender !== false && (
              <div class="pro-light-filter-footer">
                {typeof props.footerRender === "function" ? (
                  (props.footerRender as any)(
                    handleCollapseConfirm,
                    handleCollapseClear
                  )
                ) : (
                  <Space>
                    <a onClick={handleCollapseClear}>清除</a>
                    <a onClick={handleCollapseConfirm}>确认</a>
                  </Space>
                )}
              </div>
            )}
          </div>
        );
      };

      return (
        <div
          class={[
            "pro-light-filter",
            `pro-light-filter-${props.size}`,
            { "pro-light-filter-effective": hasEffectiveValue.value },
          ]}
        >
          <div class="pro-light-filter-container">
            {/* 外部项 */}
            {outsideItems.map((child: any, index) => {
              if (!child?.props) return child;

              const key = child?.key || index;
              const fieldProps = child?.props?.fieldProps || {};

              return (
                <div class="pro-light-filter-item" key={key}>
                  {cloneVNode(child, {
                    fieldProps: {
                      ...fieldProps,
                      placement: fieldProps.placement || props.placement,
                    },
                    proFieldProps: {
                      ...child?.props?.proFieldProps,
                      light: true,
                      label: child?.props?.label,
                      variant: props.variant,
                    },
                    variant: props.variant,
                  })}
                </div>
              );
            })}

            {/* 折叠项 */}
            {collapseItems.length > 0 && (
              <div class="pro-light-filter-item" key="more">
                <Popup
                  visible={popupVisible.value}
                  onVisibleChange={(visible: boolean) => {
                    popupVisible.value = visible;
                  }}
                  placement={props.placement as any}
                  trigger="click"
                  content={renderCollapseContent}
                >
                  <span class="pro-light-filter-trigger">
                    {renderCollapseLabel()}
                  </span>
                </Popup>
              </div>
            )}
          </div>
        </div>
      );
    };

    return () => (
      <BaseForm
        ref={formRef}
        contentRender={contentRender}
        data={props.data}
        formItemProps={{
          labelAlign: "left",
        }}
        fieldProps={{
          style: { width: undefined },
        }}
        onValuesChange={handleValuesChange}
        onFinish={handleFinish}
        submitter={false}
      >
        {slots.default?.()}
      </BaseForm>
    );
  },
});

export default LightFilter;
