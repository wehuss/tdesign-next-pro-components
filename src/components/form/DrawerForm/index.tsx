import { Drawer } from 'tdesign-vue-next'
import { defineComponent, ref, watch } from 'vue'
import type { ProFormProps } from '../ProForm'
import { ProForm } from '../ProForm'

export interface DrawerFormProps extends ProFormProps {
  // Drawer 相关属性
  visible?: boolean
  title?: string
  width?: string | number
  placement?: 'left' | 'right' | 'top' | 'bottom'
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

export const DrawerForm = defineComponent({
  name: 'DrawerForm',
  props: {
    // 继承 ProForm 的所有属性
    ...ProForm.props,
    // Drawer 特有属性
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    width: {
      type: [String, Number],
      default: 520,
    },
    placement: {
      type: String as () => 'left' | 'right' | 'top' | 'bottom',
      default: 'right',
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
    maskClosable: {
      type: Boolean,
      default: true,
    },
    trigger: null,
    triggerRender: {
      type: Function,
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

    // 显示抽屉
    const show = () => {
      internalVisible.value = true
    }

    // 隐藏抽屉
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
        console.error('Drawer form submit error:', error)
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
            hide() // 提交成功后关闭抽屉
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

        {/* 抽屉 */}
        <Drawer
          visible={internalVisible.value}
          header={props.title}
          size={props.width}
          placement={props.placement}
          destroyOnClose={props.destroyOnClose}
          closeOnOverlayClick={props.maskClosable}
          onCancel={handleCancel}
          onClose={handleCancel}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button onClick={handleCancel} style={{ marginRight: '8px' }}>
                取消
              </Button>
              <Button theme="primary" loading={loading.value} onClick={handleOk}>
                确定
              </Button>
            </div>
          }
        >
          <div style={{ padding: '16px' }}>
            <ProForm
              ref={formRef}
              {...props}
              submitter={false} // Drawer 自己处理提交按钮
              onFinish={handleFinish}
              onFinishFailed={handleFinishFailed}
            >
              {slots.default?.()}
            </ProForm>
          </div>
        </Drawer>
      </>
    )
  },
})

export default DrawerForm