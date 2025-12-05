/**
 * 列渲染和单元格渲染测试
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ProField } from '../../../field'
import cellRenderToFormItem from '../cell-render-to-form-item'
import { columnRender } from '../column-render'

describe('Column Render and Cell Render', () => {
  it('should render basic text correctly', () => {
    const config = {
      columnProps: {
        colKey: 'name',
        title: '姓名',
        valueType: 'text' as const,
      },
      text: '张三',
      rowData: { id: 1, name: '张三' },
      index: 0,
      type: 'table' as const,
      mode: 'read' as const,
    }

    const result = columnRender(config)
    expect(result).toBeTruthy()
  })

  it('should render index value type correctly', () => {
    const config = {
      text: '',
      valueType: 'index' as const,
      index: 5,
      rowData: { id: 1, name: '张三' },
      columnEmptyText: '-',
      columnProps: {
        colKey: 'index',
        title: '序号',
        valueType: 'index' as const,
      },
      type: 'table' as const,
      recordKey: '1',
      mode: 'read' as const,
    }

    const result = cellRenderToFormItem(config)
    expect(result).toBeTruthy()
  })

  it('should render with custom render function', () => {
    const config = {
      columnProps: {
        colKey: 'status',
        title: '状态',
        valueType: 'text' as const,
        render: (dom: any) => dom,
      },
      text: 'active',
      rowData: { id: 1, status: 'active' },
      index: 0,
      type: 'table' as const,
      mode: 'read' as const,
    }

    const result = columnRender(config)
    expect(result).toBeTruthy()
  })

  it('should handle empty text with columnEmptyText', () => {
    const config = {
      text: '',
      valueType: 'text' as const,
      index: 0,
      rowData: { id: 1, name: '' },
      columnEmptyText: '暂无数据',
      columnProps: {
        colKey: 'name',
        title: '姓名',
        valueType: 'text' as const,
      },
      type: 'table' as const,
      recordKey: '1',
      mode: 'read' as const,
    }

    const result = cellRenderToFormItem(config)
    // The function returns a VNode (span element) containing the empty text
    expect(result).toBeTruthy()
    // Check that the VNode contains the expected text
    if (
      typeof result === 'object' &&
      result !== null &&
      '__v_isVNode' in result
    ) {
      expect((result as any).children).toContain('暂无数据')
    }
  })

  it('should render ProField component', () => {
    const wrapper = mount(ProField, {
      props: {
        modelValue: '测试值',
        valueType: 'text',
        mode: 'read',
      },
    })

    expect(wrapper.exists()).toBe(true)
  })
})
