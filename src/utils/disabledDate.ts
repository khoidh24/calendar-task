import dayjs, { Dayjs } from 'dayjs'

export default function disabledDate(current: Dayjs) {
  return current.isBefore(dayjs().startOf('day'))
}
