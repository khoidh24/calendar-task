// components/CalendarView.tsx
import { Calendar } from 'antd'
import disabledDate from '../../utils/disabledDate'
import EventRenderCell from './EventRenderCell'

const CalendarView: React.FC = () => {
	return <Calendar disabledDate={disabledDate} cellRender={EventRenderCell} />
}

export default CalendarView
