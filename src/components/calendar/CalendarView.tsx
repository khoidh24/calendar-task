import React, { useState, useCallback } from 'react'
import { Calendar, Modal } from 'antd'
import type { Dayjs } from 'dayjs'
import AddForm from '../add/AddForm'
import disabledDate from '../../utils/disabledDate'
import EventRenderCell from './EventRenderCell'
import CardViewDetail from './CardViewDetail'
import { Event } from '../../types'

const CalendarView: React.FC = () => {
	const [isAddModalVisible, setIsAddModalVisible] = useState(false)
	const [isViewModalVisible, setIsViewModalVisible] = useState(false)
	const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
	const [isEditing, setIsEditing] = useState(false)

	const onSelect = useCallback(
		(date: Dayjs) => {
			if (!isViewModalVisible) {
				setSelectedDate(date)
				setIsAddModalVisible(true)
			}
		},
		[isViewModalVisible]
	)

	const onEventSelect = useCallback((event: Event) => {
		setSelectedEvent(event)
		setIsViewModalVisible(true)
		setIsEditing(false)
		setIsAddModalVisible(false)
	}, [])

	const handleAddCancel = useCallback(() => {
		setIsAddModalVisible(false)
		setSelectedDate(null)
	}, [])

	const handleViewCancel = useCallback(() => {
		setIsViewModalVisible(false)
		setSelectedEvent(null)
		setIsEditing(false)
	}, [])

	return (
		<>
			<Calendar
				disabledDate={disabledDate}
				cellRender={(value) => (
					<EventRenderCell value={value} onEventSelect={onEventSelect} />
				)}
				onSelect={onSelect}
			/>
			<Modal
				centered
				title={`Add new event for ${selectedDate?.format('MMMM D, YYYY')}`}
				open={isAddModalVisible}
				onCancel={handleAddCancel}
				footer={null}
				width={700}
				destroyOnClose
			>
				<AddForm setIsModalVisible={setIsAddModalVisible} />
			</Modal>
			<Modal
				centered
				title='Event Details'
				open={isViewModalVisible}
				onCancel={handleViewCancel}
				footer={null}
			>
				{selectedEvent && (
					<CardViewDetail
						event={selectedEvent}
						onClose={handleViewCancel}
						isEditing={isEditing}
						setIsEditing={setIsEditing}
					/>
				)}
			</Modal>
		</>
	)
}

export default CalendarView
