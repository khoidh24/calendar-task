import React from 'react'
import { Dayjs } from 'dayjs'
import useEventsStore from '../../store/eventsStore'
import { Badge } from 'antd'
import dayjs from 'dayjs'
import { Event } from '../../types'

interface EventRenderCellProps {
	value: Dayjs
	onEventSelect: (event: Event) => void
}

const EventRenderCell: React.FC<EventRenderCellProps> = ({
	value,
	onEventSelect,
}) => {
	const events = useEventsStore((state) => state.events)

	const eventsForDate = events.filter((event) => {
		if (!event.eventStartTime) return false
		const eventDate = dayjs(event.eventStartTime)
		return eventDate.isValid() && eventDate.isSame(value, 'day')
	})

	return (
		<ul
			className='events'
			style={{
				listStyle: 'none',
				padding: 0,
				display: 'flex',
				gap: 4,
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			{eventsForDate.map((event) => (
				<li
					key={event.id}
					onClick={(e) => {
						e.stopPropagation() // Prevent the click from bubbling up to the cell
						onEventSelect(event)
					}}
					style={{
						cursor: 'pointer',
						width: '100%',
						backgroundColor: 'white',
						borderRadius: 8,
						paddingTop: 2,
						paddingBottom: 2,
					}}
				>
					<Badge status='success' text={event.title} style={{ left: 8 }} />
				</li>
			))}
		</ul>
	)
}

export default EventRenderCell
