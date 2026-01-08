import type { FormInstanceFunctions, SubmitContext } from "tdesign-vue-next";
import { Form, FormItem, Loading } from "tdesign-vue-next";
import type { PropType, Ref } from "vue";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import {
  createFieldManager,
  createFieldStore,
  provideFieldContext,
  type FieldStore,
} from "../field-context";
import { provideGridContext } from "../helpers/index.tsx";
import type { ProFormGroupProps } from "../typing";
import {
  createEditOrReadOnlyContext,
  provideEditOrReadOnlyContext,
} from "./edit-or-read-only-context";
import { Submitter } from "./submitter";

export interface ProFormInstance extends FormInstanceFunctions {
  getFieldsFormatValue?: (allData?: boolean, omitNil?: boolean) => any;
  getFieldFormatValue?: (nameList?: any, omitNil?: boolean) => any;
  getFieldFormatValueObject?: (nameList?: any, omitNil?: boolean) => any;
  validateFieldsReturnFormatValue?: (
    nameList?: any[],
    omitNil?: boolean
  ) => Promise<any>;
  nativeElement?: HTMLElement;
  /** 获取所有字段值（通过字段注册机制） */
  getFieldsValue?: () => Record<string, any>;
  /** 获取单个字段值 */
  getFieldValue?: (name: string | string[]) => any;
  /** 设置字段值 */
  setFieldValue?: (name: string | string[], value: any) => void;
  /** 批量设置字段值 */
  setFieldsValue?: (values: Record<string, any>) => void;
  /** 重置所有字段到初始值 */
  resetFields?: () => void;
  /** 重置指定字段到初始值 */
  resetFieldsToInitial?: (names?: (string | string[])[]) => void;
}

/**
 * 从验证结果中提取错误字段信息
 */
function extractErrorFields(
  validateResult: any
): Array<{ name: string; errors: string[] }> {
  if (validateResult === true) return [];
  if (!validateResult || typeof validateResult !== "object") return [];

  const errorFields: Array<{ name: string; errors: string[] }> = [];

  for (const [fieldName, fieldResult] of Object.entries(validateResult)) {
    if (fieldResult === true) continue;

    const errors: string[] = [];
    if (Array.isArray(fieldResult)) {
      fieldResult.forEach((item: any) => {
        if (item && item.result === false && item.message) {
          errors.push(item.message);
        }
      });
    }

    if (errors.length > 0) {
      errorFields.push({ name: fieldName, errors });
    }
  }

  return errorFields;
}

export type BaseFormProps = any;

export const BaseForm = defineComponent({
  name: "BaseForm",
  inheritAttrs: false,
  props: {
    // 基础表单属性
    layout: {
      type: String as PropType<"vertical" | "inline">,
      default: "vertical",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    submitter: {
      type: [Object, Boolean] as PropType<any>,
      default: () => ({}),
    },
    // TDesign Form 的 data prop，用于表单数据绑定
    data: {
      type: Object as PropType<Record<string, any>>,
      default: undefined,
    },
    // 初始值，用于重置表单
    initialValues: {
      type: Object as PropType<Record<string, any>>,
      default: undefined,
    },
    onFinish: {
      type: [Function, Array] as PropType<
        | ((formData: any) => Promise<boolean | void> | void)
        | Array<(formData: any) => Promise<boolean | void> | void>
      >,
    },
    onFinishFailed: {
      type: [Function, Array] as PropType<
        ((errorInfo: any) => void) | Array<(errorInfo: any) => void>
      >,
    },
    onReset: {
      type: [Function, Array] as PropType<(() => void) | Array<() => void>>,
    },
    onValuesChange: {
      type: Function as PropType<(changedValues: any, allValues: any) => void>,
    },
    onLoadingChange: {
      type: Function as PropType<(loading: boolean) => void>,
    },
    formRef: {
      type: Object as PropType<Ref<ProFormInstance | undefined>>,
    },
    // 网格布局
    grid: {
      type: Boolean,
      default: false,
    },
    colProps: {
      type: Object,
      default: () => ({}),
    },
    rowProps: {
      type: Object,
      default: () => ({}),
    },
    // 其他属性
    contentRender: {
      type: Function as PropType<
        (items: any[], submitter: any, form: ProFormInstance) => any
      >,
    },
    fieldProps: {
      type: Object,
      default: () => ({}),
    },
    proFieldProps: {
      type: Object,
      default: () => ({}),
    },
    formItemProps: {
      type: Object,
      default: () => ({}),
    },
    groupProps: {
      type: Object as PropType<ProFormGroupProps>,
      default: () => ({}),
    },
    formComponentType: {
      type: String as PropType<"DrawerForm" | "ModalForm" | "QueryFilter">,
    },
    isKeyPressSubmit: {
      type: Boolean,
      default: false,
    },
    autoFocusFirstInput: {
      type: Boolean,
      default: true,
    },
    omitNil: {
      type: Boolean,
      default: true,
    },
    dateFormatter: {
      type: [String, Function, Boolean] as PropType<
        string | ((value: any, valueType: string) => string | number) | false
      >,
      default: "string",
    },
    onInit: {
      type: Function as PropType<(values: any, form: ProFormInstance) => void>,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    request: {
      type: Function as PropType<(params: any) => Promise<any>>,
    },
    formKey: {
      type: String,
      default: "",
    },
    syncToUrl: {
      type: [Boolean, Function] as PropType<
        boolean | ((values: any, type: "get" | "set") => any)
      >,
      default: false,
    },
    syncToUrlAsImportant: {
      type: Boolean,
      default: false,
    },
    extraUrlParams: {
      type: Object,
      default: () => ({}),
    },
    syncToInitialValues: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["finish", "finishFailed", "loadingChange", "init", "reset"],
  setup(props, { slots, emit, expose }) {
    const formRef = ref<ProFormInstance>();
    const loading = ref(props.loading);
    const initialData = ref<any>(props.initialValues || {});
    const initialDataLoading = ref(false);

    // 创建字段存储和管理器
    const fieldStore: FieldStore = createFieldStore();
    const fieldManager = createFieldManager(fieldStore);

    // 监听loading变化
    watch(
      () => props.loading,
      (newLoading) => {
        loading.value = newLoading || false;
      }
    );

    watch(loading, (newLoading) => {
      props.onLoadingChange?.(newLoading);
      emit("loadingChange", newLoading);
    });

    // 监听 initialValues 变化
    watch(
      () => props.initialValues,
      (newInitialValues) => {
        if (newInitialValues) {
          initialData.value = newInitialValues;
        }
      },
      { deep: true }
    );

    /**
     * 获取表单值
     * 优先使用 data prop，其次使用字段注册机制收集值
     */
    const getFormValues = (): Record<string, any> => {
      // 优先使用 data prop
      if (props.data) {
        return props.data;
      }
      // 使用字段注册机制收集值
      return fieldManager.getFieldsValue();
    };

    /**
     * 处理表单提交 - 适配 TDesign Form 的 SubmitContext
     * TDesign Form 的 onSubmit 事件接收 SubmitContext 对象，包含：
     * - e: FormSubmitEvent
     * - validateResult: 验证结果 (true 表示通过，对象表示有错误)
     * - firstError: 第一个错误信息
     * - fields: 字段信息
     */
    const handleSubmit = async (context: SubmitContext) => {
      console.log("sub!");
      const { validateResult, firstError } = context;

      // 验证失败 - 调用 onFinishFailed
      if (validateResult !== true) {
        const errorInfo = {
          validateResult,
          firstError,
          errorFields: extractErrorFields(validateResult),
        };

        if (props.onFinishFailed) {
          const handlers = Array.isArray(props.onFinishFailed)
            ? props.onFinishFailed
            : [props.onFinishFailed];
          for (const handler of handlers) {
            if (typeof handler === "function") {
              handler(errorInfo);
            }
          }
        }
        emit("finishFailed", errorInfo);
        return;
      }

      // 验证成功 - 获取表单值并调用 onFinish
      if (loading.value) return;

      try {
        loading.value = true;

        // 获取表单值
        const values = getFormValues();

        if (props.onFinish) {
          // 支持 onFinish 为数组形式（Vue 事件监听器可能是数组）
          const finishHandlers = Array.isArray(props.onFinish)
            ? props.onFinish
            : [props.onFinish];
          let result: any;
          for (const handler of finishHandlers) {
            if (typeof handler === "function") {
              result = await handler(values);
            }
          }
          emit("finish", values);
          return result;
        } else {
          emit("finish", values);
        }
      } catch (error) {
        console.error("Form submit error:", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };

    // 保留旧的 handleFinish 方法用于直接调用（如 expose）
    const handleFinish = async (values: any) => {
      if (loading.value) return;

      try {
        loading.value = true;

        if (props.onFinish) {
          const finishHandlers = Array.isArray(props.onFinish)
            ? props.onFinish
            : [props.onFinish];
          let result: any;
          for (const handler of finishHandlers) {
            if (typeof handler === "function") {
              result = await handler(values);
            }
          }
          emit("finish", values);
          return result;
        } else {
          emit("finish", values);
        }
      } catch (error) {
        console.error("Form submit error:", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };

    // 处理重置 - 支持重置到初始值
    const handleReset = () => {
      console.log("reset!");
      // 调用 TDesign Form 的 reset 方法
      formRef.value?.reset();

      // 使用字段管理器重置到初始值
      if (props.initialValues) {
        fieldManager.setFieldsValue(props.initialValues);
      } else {
        fieldManager.resetFields();
      }

      if (props.onReset) {
        const handlers = Array.isArray(props.onReset)
          ? props.onReset
          : [props.onReset];
        for (const handler of handlers) {
          if (typeof handler === "function") {
            handler();
          }
        }
      }
      emit("reset");
    };

    // 提供上下文 - 使用响应式模式以便在 readonly 变化时自动更新
    const editOrReadOnlyMode = computed(() =>
      props.readonly ? "read" : "edit"
    );
    provideEditOrReadOnlyContext(
      createEditOrReadOnlyContext(editOrReadOnlyMode)
    );

    provideFieldContext({
      formRef,
      fieldProps: props.fieldProps,
      proFieldProps: props.proFieldProps,
      formItemProps: props.formItemProps,
      groupProps: props.groupProps,
      formComponentType: props.formComponentType,
      formKey: props.formKey,
      setFieldValueType: (_name: any, _config: any) => {
        // TODO: 实现字段类型设置逻辑
      },
      // 字段注册和值收集方法
      registerField: fieldManager.registerField,
      unregisterField: fieldManager.unregisterField,
      getFieldsValue: fieldManager.getFieldsValue,
      getFieldValue: fieldManager.getFieldValue,
      setFieldValue: fieldManager.setFieldValue,
      setFieldsValue: fieldManager.setFieldsValue,
      resetFields: fieldManager.resetFields,
      resetFieldsToInitial: fieldManager.resetFieldsToInitial,
    });

    provideGridContext({
      grid: props.grid,
      colProps: props.colProps,
    });

    // 初始化
    onMounted(() => {
      // 如果有初始值，设置到字段
      if (props.initialValues) {
        fieldManager.setFieldsValue(props.initialValues);
      }

      if (props.onInit) {
        props.onInit(initialData.value, formRef.value!);
        emit("init", initialData.value, formRef.value);
      }
    });

    // 暴露方法给父组件
    if (props.formRef) {
      // eslint-disable-next-line vue/no-mutating-props
      props.formRef.value = formRef.value;
    }

    // 创建增强的表单实例
    const enhancedFormInstance = computed(() => ({
      ...formRef.value,
      getFieldsValue: fieldManager.getFieldsValue,
      getFieldValue: fieldManager.getFieldValue,
      setFieldValue: fieldManager.setFieldValue,
      setFieldsValue: fieldManager.setFieldsValue,
      resetFields: fieldManager.resetFields,
      resetFieldsToInitial: fieldManager.resetFieldsToInitial,
    }));

    expose({
      formRef,
      handleFinish,
      handleReset,
      // 暴露字段管理方法
      getFieldsValue: fieldManager.getFieldsValue,
      getFieldValue: fieldManager.getFieldValue,
      setFieldValue: fieldManager.setFieldValue,
      setFieldsValue: fieldManager.setFieldsValue,
      resetFields: fieldManager.resetFields,
      resetFieldsToInitial: fieldManager.resetFieldsToInitial,
    });

    const test = () => {
      console.log("test", formRef);
    };
    return () => {
      const items = slots.default?.();

      // 渲染提交按钮
      const submitterNode =
        props.submitter !== false ? (
          <FormItem>
            <Submitter
              {...(typeof props.submitter === "object" ? props.submitter : {})}
              onSubmit={() => {
                formRef.value?.submit();
                test();
              }}
              onReset={handleReset}
              submitButtonProps={{
                loading: loading.value,
                ...(typeof props.submitter === "object"
                  ? props.submitter.submitButtonProps
                  : {}),
              }}
            />
          </FormItem>
        ) : null;

      const contentRender = props.contentRender
        ? () =>
            props.contentRender!(
              items || [],
              submitterNode,
              enhancedFormInstance.value as ProFormInstance
            )
        : () => (
            <>
              {items}
              {submitterNode}
            </>
          );

      // 加载状态
      if (props.request && initialDataLoading.value) {
        return (
          <div
            style={{
              paddingTop: "50px",
              paddingBottom: "50px",
              textAlign: "center",
            }}
          >
            <Loading />
          </div>
        );
      }

      return (
        <Form
          ref={formRef}
          layout={props.layout}
          data={props.data}
          onSubmit={handleSubmit}
          onReset={handleReset}
        >
          {contentRender}
        </Form>
      );
    };
  },
});

export default BaseForm;
