import create from 'zustand'
import { Dayjs } from 'dayjs'

interface Event {
  title: string
  content: string
  eventStartTime: Dayjs
  eventEndTime: Dayjs
}

interface EventsState {
  events: Event[]
  addEvent: (event: Event) => void
  removeEvent: (index: number) => void
}

const useEventsStore = create<EventsState>((set) => ({
  events: [],
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  removeEvent: (index) =>
    set((state) => ({
      events: state.events.filter((_, i) => i !== index)
    }))
}))

export default useEventsStore
