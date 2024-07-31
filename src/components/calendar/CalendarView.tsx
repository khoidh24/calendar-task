import { Calendar } from 'antd'
import disabledDate from '../../utils/disabledDate'
import RenderCell from './addEventButton'

const CalendarView: React.FC = () => {
  return <Calendar disabledDate={disabledDate} cellRender={RenderCell} />
}

export default CalendarView
