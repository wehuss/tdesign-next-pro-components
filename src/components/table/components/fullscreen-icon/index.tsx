/**
 * FullscreenIcon 全屏切换组件
 * 用于切换表格的全屏显示状态
 * 参考 ant-design/pro-components FullscreenIcon 组件
 */

import { FullscreenExitIcon, FullscreenIcon } from 'tdesign-icons-vue-next'
import { Button, Tooltip } from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'

export interface FullscreenIconProps {
  fullscreenIcon?: VNode
  exitFullscreenIcon?: VNode
  onFullscreenChange?: (isFullscreen: boolean) => void
}

// 检测是否在浏览器环境
const isBrowser = () => {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export default defineComponent({
  name: 'FullScreenIcon',
  props: {
    fullscreenIcon: [Object, Function] as PropType<VNode>,
    exitFullscreenIcon: [Object, Function] as PropType<VNode>,
    onFullscreenChange: {
      type: Function as PropType<(isFullscreen: boolean) => void>,
    },
  },
  emits: ['fullscreenChange'],
  setup(props, { emit }) {
    const isFullscreen = ref(false)

    // 监听全屏状态变化
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement

      isFullscreen.value = !!fullscreenElement
      emit('fullscreenChange', isFullscreen.value)
      props.onFullscreenChange?.(isFullscreen.value)
    }

    // 切换全屏状态
    const toggleFullscreen = async () => {
      if (!isBrowser()) return

      try {
        if (!isFullscreen.value) {
          // 进入全屏
          const element = document.documentElement
          if (element.requestFullscreen) {
            await element.requestFullscreen()
          } else if ((element as any).webkitRequestFullscreen) {
            await (element as any).webkitRequestFullscreen()
          } else if ((element as any).mozRequestFullScreen) {
            await (element as any).mozRequestFullScreen()
          } else if ((element as any).msRequestFullscreen) {
            await (element as any).msRequestFullscreen()
          }
        } else {
          // 退出全屏
          if (document.exitFullscreen) {
            await document.exitFullscreen()
          } else if ((document as any).webkitExitFullscreen) {
            await (document as any).webkitExitFullscreen()
          } else if ((document as any).mozCancelFullScreen) {
            await (document as any).mozCancelFullScreen()
          } else if ((document as any).msExitFullscreen) {
            await (document as any).msExitFullscreen()
          }
        }
      } catch (error) {
        console.error('Fullscreen toggle failed:', error)
      }
    }

    onMounted(() => {
      if (!isBrowser()) return

      // 添加全屏状态变化监听
      document.addEventListener('fullscreenchange', handleFullscreenChange)
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.addEventListener('mozfullscreenchange', handleFullscreenChange)
      document.addEventListener('MSFullscreenChange', handleFullscreenChange)
    })

    onUnmounted(() => {
      if (!isBrowser()) return

      // 移除全屏状态变化监听
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    })

    return () => {
      const tooltipContent = isFullscreen.value ? '退出全屏' : '全屏'
      const icon = isFullscreen.value
        ? props.exitFullscreenIcon || <FullscreenExitIcon />
        : props.fullscreenIcon || <FullscreenIcon />

      return (
        <Tooltip content={tooltipContent}>
          <Button variant="text" shape="square" icon={() => icon} onClick={toggleFullscreen} />
        </Tooltip>
      )
    }
  },
})
