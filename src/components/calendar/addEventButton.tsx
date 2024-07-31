import disabledDate from '../../utils/disabledDate'
import { Dayjs } from 'dayjs'
import AddButton from './AddButton'

const renderCell = (value: Dayjs) => {
  const isDisabled = disabledDate(value)

  return <>{!isDisabled && <AddButton />}</>
}

export default renderCell
