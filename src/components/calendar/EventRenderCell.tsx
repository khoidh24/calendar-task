import disabledDate from '../../utils/disabledDate'
import { Dayjs } from 'dayjs'
import AddButton from './AddButton'

const EventRenderCell = (value: Dayjs) => {
	const isDisabled = disabledDate(value)

	return <>{!isDisabled && <AddButton date={value} />}</>
}

export default EventRenderCell
