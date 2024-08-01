import { PlusOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { useState } from 'react'
import AddForm from '../add/AddForm'
import RenderDateElement from './RenderDateElement'
import { RenderDateElementProps } from '../../types'

const AddButton: React.FC<RenderDateElementProps> = ({ date }) => {
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
			>
				<AddForm setIsModalVisible={setIsModalVisible} />
			</Modal>
		</>
	)
}

export default AddButton
