import dayjs, { Dayjs } from 'dayjs'

export default function getDisabledEndTimes(startTime: Dayjs) {
  if (!startTime) return []
  const startMoment = dayjs(startTime)
  const disabledTimes = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const time = dayjs().hour(hour).minute(minute).second(0)
      if (time.isBefore(startMoment, 'minute')) {
        disabledTimes.push(time.format('HH:mm'))
      }
    }
  }
  return disabledTimes
}
