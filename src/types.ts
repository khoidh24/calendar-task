import { Dayjs } from 'dayjs'

export interface Event {
  title: string
  content: string
  eventStartTime: Dayjs
  eventEndTime: Dayjs
}

export interface FormValues {
  events: Event[]
}
