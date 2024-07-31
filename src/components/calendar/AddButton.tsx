import { PlusOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { useState } from 'react'
import AddForm from '../add/AddForm'

const AddButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModalHandler = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={showModalHandler}>
        Add event
      </Button>
      <Modal
        title='Add new event'
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <AddForm />
      </Modal>
    </>
  )
}

export default AddButton
