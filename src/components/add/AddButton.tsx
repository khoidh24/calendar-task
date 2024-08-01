import { PlusOutlined } from '@ant-design/icons'
import { Button, Modal, Form } from 'antd'
import { useState } from 'react'
import AddForm from '../add/AddForm'
import RenderDateElement from '../calendar/RenderDateElement'
import { RenderDateElementProps } from '../../types'

const AddButton: React.FC<RenderDateElementProps> = ({ date }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const showModalHandler = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  return (
    <>
      <RenderDateElement date={date} />
      <Button
        style={{ marginTop: 20 }}
        icon={<PlusOutlined />}
        onClick={showModalHandler}
      >
        Add event
      </Button>
      <Modal
        centered
        title='Add new event'
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={700}
        style={{ marginTop: 20, marginBottom: 20 }}
        destroyOnClose={true}
      >
        <AddForm setIsModalVisible={setIsModalVisible} form={form} />
      </Modal>
    </>
  )
}

export default AddButton
