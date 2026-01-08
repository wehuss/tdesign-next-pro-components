import { Dialog } from "tdesign-vue-next";
import type { VNode } from "vue";
import { cloneVNode, defineComponent, ref, watch } from "vue";
import { BaseForm } from "../base-form/base-form";
import type { SubmitterProps } from "../base-form/submitter";
import type { ProFormProps } from "../pro-form";

export interface ModalFormProps extends ProFormProps {
  // Modal 相关属性
  visible?: boolean;
  open?: boolean; // 兼容 antd 的 open 属性
  title?: string;
  width?: string | number;
  destroyOnClose?: boolean;
  maskClosable?: boolean;
  closable?: boolean;
  confirmLoading?: boolean;
  // 提交超时
  submitTimeout?: number;
  // 触发器相关
  trigger?: VNode;
  // Modal 配置
  modalProps?: Record<string, any>;
  // 事件回调
  onOpenChange?: (open: boolean) => void;
  onVisibleChange?: (visible: boolean) => void;
  onCancel?: () => void;
  onOk?: () => void;
}

export const ModalForm = defineComponent({
  name: "ModalForm",
  props: {
    // 继承 BaseForm 的所有属性
    ...BaseForm.props,
    // Modal 特有属性
    visible: {
      type: Boolean,
      default: undefined,
    },
    open: {
      type: Boolean,
      default: undefined,
    },
    title: {
      type: String,
    },
    width: {
      type: [String, Number],
      default: 800,
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
    maskClosable: {
      type: Boolean,
      default: true,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    confirmLoading: {
      type: Boolean,
      default: false,
    },
    submitTimeout: {
      type: Number,
    },
    trigger: {
      type: Object as () => VNode,
    },
    modalProps: {
      type: Object,
      default: () => ({}),
    },
    onOpenChange: {
      type: Function as () => (open: boolean) => void,
    },
    onVisibleChange: {
      type: Function as () => (visible: boolean) => void,
    },
    onCancel: {
      type: Function as () => () => void,
    },
    onOk: {
      type: Function as () => () => void,
    },
    onFinish: {
      type: Function as () => (values: any) => Promise<any>,
    },
    submitter: {
      type: [Object, Boolean] as () => SubmitterProps | false,
      default: undefined,
    },
  },
  emits: [
    "update:visible",
    "update:open",
    "openChange",
    "visibleChange",
    "cancel",
    "ok",
    "finish",
    "finishFailed",
  ],
  setup(props, { slots, emit, expose }) {
    const formRef = ref();
    const footerRef = ref<HTMLDivElement | null>(null);
    // 支持 open 和 visible 两种属性
    const propsOpen = props.open ?? props.visible ?? false;
    const internalOpen = ref(propsOpen);
    const loading = ref(false);

    // 监听外部 open/visible 变化
    watch(
      () => props.open ?? props.visible,
      (newVal) => {
        if (newVal !== undefined) {
          internalOpen.value = newVal;
        }
      }
    );

    // 监听内部 open 变化
    watch(internalOpen, (newVal) => {
      emit("update:visible", newVal);
      emit("update:open", newVal);
      props.onOpenChange?.(newVal);
      props.onVisibleChange?.(newVal);
      emit("openChange", newVal);
      emit("visibleChange", newVal);
    });

    // 显示弹窗
    const show = () => {
      internalOpen.value = true;
    };

    // 隐藏弹窗
    const hide = () => {
      internalOpen.value = false;
    };

    // 重置表单
    const resetFields = () => {
      if (props.destroyOnClose && formRef.value) {
        formRef.value.reset?.();
      }
    };

    // 处理取消
    const handleCancel = () => {
      // 提交表单loading时，阻止弹框关闭
      if (props.submitTimeout && loading.value) return;
      props.onCancel?.();
      emit("cancel");
      hide();
    };

    // 处理表单提交
    const handleFinish = async (values: any) => {
      const response = props.onFinish?.(values);

      if (props.submitTimeout && response instanceof Promise) {
        loading.value = true;
        const timer = setTimeout(() => {
          loading.value = false;
        }, props.submitTimeout);

        try {
          const result = await response;
          clearTimeout(timer);
          loading.value = false;
          // 返回真值，关闭弹框
          if (result) {
            emit("finish", values);
            hide();
          }
          return result;
        } catch (error) {
          clearTimeout(timer);
          loading.value = false;
          throw error;
        }
      }

      const result = await response;
      // 返回真值，关闭弹框
      if (result) {
        emit("finish", values);
        hide();
      }
      return result;
    };

    // 处理表单提交失败
    const handleFinishFailed = (errorInfo: any) => {
      emit("finishFailed", errorInfo);
    };

    // 处理弹窗关闭后
    const handleAfterClose = () => {
      if (props.destroyOnClose) {
        resetFields();
      }
      props.modalProps?.afterClose?.();
    };

    // 暴露方法
    expose({
      show,
      hide,
      open: show,
      close: hide,
      submit: () => formRef.value?.submit(),
      reset: () => formRef.value?.reset(),
      validate: () => formRef.value?.validate(),
      getFieldsValue: () => formRef.value?.getFieldsValue(),
      setFieldsValue: (values: any) => formRef.value?.setFieldsValue(values),
    });

    // 构建 submitter 配置
    const getSubmitterConfig = () => {
      if (props.submitter === false) {
        return false;
      }

      const defaultConfig: SubmitterProps = {
        searchConfig: {
          submitText: props.modalProps?.okText ?? "确认",
          resetText: props.modalProps?.cancelText ?? "取消",
        },
        resetButtonProps: {
          disabled: props.submitTimeout ? loading.value : false,
          onClick: handleCancel,
        },
        submitButtonProps: {
          loading: loading.value,
        },
      };

      return {
        ...defaultConfig,
        ...(typeof props.submitter === "object" ? props.submitter : {}),
      };
    };

    // 内容渲染
    const contentRender = (formDom: any, submitter: any) => {
      return (
        <>
          {formDom}
          {footerRef.value && submitter ? (
            <div ref={footerRef}>{submitter}</div>
          ) : (
            submitter
          )}
        </>
      );
    };

    // 渲染触发器
    const renderTrigger = () => {
      if (!props.trigger) return null;

      return cloneVNode(props.trigger, {
        onClick: (e: Event) => {
          show();
          // 调用原有的 onClick
          const originalOnClick = (props.trigger as any)?.props?.onClick;
          originalOnClick?.(e);
        },
      });
    };

    return () => (
      <>
        {/* 弹窗 */}
        <Dialog
          {...props.modalProps}
          visible={internalOpen.value}
          header={props.title}
          width={props.width}
          destroyOnClose={props.destroyOnClose}
          closeOnOverlayClick={props.maskClosable}
          closable={props.closable}
          onCancel={handleCancel}
          onClose={handleCancel}
          onClosed={handleAfterClose}
          footer={
            props.submitter !== false ? (
              <div
                ref={footerRef}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              />
            ) : null
          }
        >
          <BaseForm
            ref={formRef}
            formComponentType="ModalForm"
            layout="vertical"
            {...props}
            submitter={getSubmitterConfig()}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            contentRender={contentRender}
          >
            {slots.default?.()}
          </BaseForm>
        </Dialog>

        {/* 触发器 */}
        {renderTrigger()}
      </>
    );
  },
});

export default ModalForm;
