import { FormInstance } from 'antd'
import { Dayjs } from 'dayjs'

export interface Event {
  id: string
  title: string
  content: string
  eventStartTime: Dayjs | undefined
  eventEndTime?: Dayjs
  address: string
  province: string
  district: string
  ward: string
}

export interface EventsState {
  events: Event[]
  addEvent: (event: Event) => void
  removeEvent: (id: string) => void
  updateEvent: (updatedEvent: Event) => void
}

export interface FormValues {
  events: Event[]
}

export interface DetailModalProps {
  event: Event
  onClose: () => void
}

export interface RenderDateElementProps {
  date: Dayjs
}

export interface updateFormProps {
  id: string
  title: string
  content: string
  eventStartTime?: Dayjs | undefined
  eventEndTime?: Dayjs | undefined
  address?: string | undefined
  province?: string | undefined
  district?: string | undefined
  ward?: string | undefined
}

export interface CardViewDetailProps extends DetailModalProps {
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
}

export interface Ward {
  name: string
  type: string
  slug: string
  name_with_type: string
  path: string
  path_with_type: string
  code: string
  parent_code: string
}

export interface AddFormProps {
  setIsModalVisible: (visible: boolean) => void
  form: FormInstance
}

export interface District {
  name: string
  type: string
  slug: string
  name_with_type: string
  path: string
  path_with_type: string
  code: string
  parent_code: string
  'xa-phuong': {
    [code: string]: Ward
  }
}

interface Province {
  name: string
  name_with_type: string
  type: string
  code: string
  'quan-huyen': {
    [code: string]: District
  }
}

export interface LocationData {
  [code: string]: Province
}
