export interface Client {
  id: string
  name: string
  phone: string
}

export interface Booking {
  id: string
  clientId: string
  clientName: string
  clientPhone: string
  callType: "onboarding" | "follow-up"
  date: string // YYYY-MM-DD format
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  isRecurring: boolean
  recurringStartDate?: string // For follow-ups, the original booking date
  createdAt: any // Firebase timestamp
}

export interface TimeSlotData {
  time: string
  booking: Booking | null
  isAvailable: boolean
}
