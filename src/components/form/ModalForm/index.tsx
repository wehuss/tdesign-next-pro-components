import { Dialog } from 'tdesign-vue-next'
import { defineComponent, ref, watch } from 'vue'
import type { ProFormProps } from '../ProForm'
import { ProForm } from '../ProForm'

export interface ModalFormProps extends ProFormProps {
  // Modal 相关属性
  visible?: boolean
  title?: string
  width?: string | number
  destroyOnClose?: boolean
  maskClosable?: boolean
  closable?: boolean
  confirmLoading?: boolean
  // 触发器相关
  trigger?: any
  triggerRender?: () => any
  // 事件回调
  onVisibleChange?: (visible: boolean) => void
  onCancel?: () => void
  onOk?: () => void
}

export const ModalForm = defineComponent({
  name: 'ModalForm',
  props: {
    // 继承 ProForm 的所有属性
    ...ProForm.props,
    // Modal 特有属性
    visible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [String, Number],
      default: 520,
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
    trigger: null,
    triggerRender: Function,
    onVisibleChange: Function,
    onCancel: Function,
    onOk: Function,
  },
  emits: ['update:visible', 'visibleChange', 'cancel', 'ok', 'finish', 'finishFailed'],
  setup(props, { slots, emit, expose }) {
    const formRef = ref()
    const internalVisible = ref(props.visible)
    const loading = ref(false)

    // 监听外部 visible 变化
    watch(() => props.visible, (newVal) => {
      internalVisible.value = newVal
    })

    // 监听内部 visible 变化
    watch(internalVisible, (newVal) => {
      emit('update:visible', newVal)
      if (props.onVisibleChange) {
        props.onVisibleChange(newVal)
      }
      emit('visibleChange', newVal)
    })

    // 显示弹窗
    const show = () => {
      internalVisible.value = true
    }

    // 隐藏弹窗
    const hide = () => {
      internalVisible.value = false
    }

    // 处理取消
    const handleCancel = () => {
      if (props.onCancel) {
        props.onCancel()
      }
      emit('cancel')
      hide()
    }

    // 处理确定
    const handleOk = async () => {
      try {
        loading.value = true
        await formRef.value?.submit()
        if (props.onOk) {
          props.onOk()
        }
        emit('ok')
      } catch (error) {
        console.error('Modal form submit error:', error)
      } finally {
        loading.value = false
      }
    }

    // 处理表单提交成功
    const handleFinish = async (values: any) => {
      try {
        if (props.onFinish) {
          const result = await props.onFinish(values)
          if (result !== false) {
            emit('finish', values)
            hide() // 提交成功后关闭弹窗
          }
        } else {
          emit('finish', values)
          hide()
        }
      } catch (error) {
        console.error('Form finish error:', error)
      }
    }

    // 处理表单提交失败
    const handleFinishFailed = (errorInfo: any) => {
      emit('finishFailed', errorInfo)
    }

    // 暴露方法
    expose({
      show,
      hide,
      submit: () => formRef.value?.submit(),
      reset: () => formRef.value?.reset(),
      validate: () => formRef.value?.validate(),
    })

    return () => (
      <>
        {/* 触发器 */}
        {(props.trigger || props.triggerRender) && (
          <div onClick={show}>
            {props.triggerRender ? props.triggerRender() : props.trigger}
          </div>
        )}

        {/* 弹窗 */}
        <Dialog
          visible={internalVisible.value}
          header={props.title}
          width={props.width}
          destroyOnClose={props.destroyOnClose}
          closeOnOverlayClick={props.maskClosable}
          closable={props.closable}
          confirmLoading={loading.value || props.confirmLoading}
          onCancel={handleCancel}
          onConfirm={handleOk}
          onClose={handleCancel}
        >
          <ProForm
            ref={formRef}
            {...props}
            submitter={false} // Modal 自己处理提交按钮
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
          >
            {slots.default?.()}
          </ProForm>
        </Dialog>
      </>
    )
  },
})

export default ModalForm