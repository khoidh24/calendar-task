import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { EventsState, Event } from '../types'
import { v4 as uuidv4 } from 'uuid'

const useEventsStore = create<EventsState>()(
	persist(
		(set) => ({
			events: [],
			addEvent: (event: Event) =>
				set((state) => ({
					events: [...state.events, { ...event, id: uuidv4() }],
				})),
			removeEvent: (id: string) =>
				set((state) => ({
					events: state.events.filter((e) => e.id !== id),
				})),
			updateEvent: (updatedEvent) =>
				set((state) => ({
					events: state.events.map((event) =>
						event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
					),
				})),
		}),
		{
			name: 'events-storage',
			storage: createJSONStorage(() => localStorage),
		}
	)
)

export default useEventsStore
