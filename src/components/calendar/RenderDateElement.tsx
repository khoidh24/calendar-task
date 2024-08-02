import React, { useState } from 'react'
import useEventsStore from '../../store/eventsStore'
import { Event, RenderDateElementProps } from '../../types'
import dayjs from 'dayjs'
import { Badge, Card, Modal } from 'antd'
import CardViewDetail from './CardViewDetail'

const RenderDateElement: React.FC<RenderDateElementProps> = ({ date }) => {
	const events = useEventsStore((state) => state.events)
	const [isShowModalDetail, setIsShowModalDetail] = useState(false)
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
	const [isEditing, setIsEditing] = useState<boolean>(false)

	const eventsForDate = events.filter((event) =>
		dayjs(event.eventStartTime).isSame(date, 'day')
	)

	const handleDetailOk = () => {
		setSelectedEvent(null)
		setIsShowModalDetail(false)
	}

	const handleDetailCancel = () => {
		setSelectedEvent(null)
		setIsShowModalDetail(false)
		setIsEditing(false)
	}

	const handleEventClick = (event: Event) => {
		setSelectedEvent(event)
		setIsShowModalDetail(true)
		setIsEditing(false)
	}

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'flex-start',
				width: '100%',
				flexDirection: 'column',
				gap: 4,
			}}
		>
			{eventsForDate.map((event) => (
				<div
					key={event.id}
					style={{ width: '90%' }}
					onClick={() => handleEventClick(event)}
				>
					<Badge.Ribbon text='TEST' color='green'>
						<Card
							title={null}
							size='small'
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								flexDirection: 'row',
							}}
						>
							<strong style={{ fontSize: 10 }}>{event.title}</strong>
							<p style={{ fontSize: 10 }}>
								{event.eventStartTime
									? dayjs(event.eventStartTime).format('h:mm A')
									: null}
								{event.eventEndTime &&
									' - ' + dayjs(event.eventEndTime).format('h:mm A')}
							</p>
						</Card>
					</Badge.Ribbon>
				</div>
			))}
			<Modal
				centered
				title='Event detail'
				open={isShowModalDetail}
				onOk={handleDetailOk}
				onCancel={handleDetailCancel}
				footer={null}
			>
				{selectedEvent && (
					<CardViewDetail
						event={selectedEvent}
						onClose={handleDetailCancel}
						isEditing={isEditing}
						setIsEditing={setIsEditing}
					/>
				)}
			</Modal>
		</div>
	)
}

export default RenderDateElement
