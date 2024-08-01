import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { EventsState, Event } from '../types'

const useEventsStore = create<EventsState>()(
  persist(
    (set) => ({
      events: [],
      addEvent: (event: Event) =>
        set((state) => ({
          events: [...state.events, event]
        })),
      removeEvent: (id: string) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id)
        })),
      updateEvent: (updatedEvent: Event) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === updatedEvent.id ? { ...e, ...updatedEvent } : e
          )
        }))
    }),
    {
      name: 'events-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default useEventsStore
