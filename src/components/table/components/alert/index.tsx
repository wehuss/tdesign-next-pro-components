import { Alert, Button, Space } from 'tdesign-vue-next'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableAlert',
  setup() {
    // TODO: 实现批量操作状态管理
    const selectedRowKeys = []
    const selectedRows = []

    return () => {
      if (selectedRowKeys.length === 0) {
        return null
      }

      return (
        <div class="t-pro-table-alert">
          <Alert
            theme="info"
            message={() => (
              <Space>
                <span>已选择 {selectedRowKeys.length} 项</span>
                <Button variant="text" size="small">
                  清空
                </Button>
              </Space>
            )}
          />
        </div>
      )
    }
  },
})
