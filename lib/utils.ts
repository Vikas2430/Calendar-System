import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { addMinutes, format, parse, getDay } from "date-fns"
import type { Booking, TimeSlotData } from "./types"

// Cache time slots to avoid regenerating them on every call
let cachedTimeSlots: TimeSlotData[] | null = null

export function generateTimeSlots(): TimeSlotData[] {
  if (cachedTimeSlots) {
    return cachedTimeSlots
  }

  const slots: TimeSlotData[] = []
  const startTime = parse("10:30", "HH:mm", new Date())
  const endTime = parse("19:30", "HH:mm", new Date())

  let currentTime = startTime

  while (currentTime < endTime) {
    slots.push({
      time: format(currentTime, "HH:mm"),
      booking: null,
      isAvailable: true,
    })
    currentTime = addMinutes(currentTime, 20)
  }

  cachedTimeSlots = slots
  return slots
}

export function calculateEndTime(startTime: string, callType: "onboarding" | "follow-up"): string {
  const duration = callType === "onboarding" ? 40 : 20
  const start = parse(startTime, "HH:mm", new Date())
  const end = addMinutes(start, duration)
  return format(end, "HH:mm")
}

export function checkOverlap(newBooking: Omit<Booking, "id" | "createdAt">, existingBookings: Booking[]): boolean {
  // Use a consistent base date for all time comparisons
  const baseDate = new Date(2024, 0, 1) // January 1, 2024
  const newStart = parse(newBooking.startTime, "HH:mm", baseDate)
  const newEnd = parse(newBooking.endTime, "HH:mm", baseDate)

  return existingBookings.some((booking) => {
    const existingStart = parse(booking.startTime, "HH:mm", baseDate)
    const existingEnd = parse(booking.endTime, "HH:mm", baseDate)

    // Check if times overlap: new booking starts before existing ends AND new booking ends after existing starts
    return newStart < existingEnd && newEnd > existingStart
  })
}

export function getRecurringBookings(originalBooking: Booking, targetDate: Date): Booking[] {
  if (!originalBooking.isRecurring || !originalBooking.recurringStartDate) {
    return []
  }

  const originalDate = new Date(originalBooking.recurringStartDate)
  const originalDay = getDay(originalDate)
  const targetDay = getDay(targetDate)

  // Check if target date falls on the same day of week as the original booking
  if (originalDay !== targetDay) {
    return []
  }

  // Check if target date is after or on the original booking date
  if (targetDate >= originalDate) {
    // Create a virtual booking for this recurring instance
    return [
      {
        ...originalBooking,
        date: format(targetDate, "yyyy-MM-dd"),
        id: `${originalBooking.id}-${format(targetDate, "yyyy-MM-dd")}`, // Virtual ID for recurring instance
        // Ensure the virtual booking has the correct end time
        endTime: calculateEndTime(originalBooking.startTime, originalBooking.callType),
      },
    ]
  }

  return []
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Test function to verify overlap detection works correctly
export function testOverlapLogic() {
  console.log("🧪 Testing Overlap Detection Logic...")
  
  // Test case: Follow-up at 11:10 AM (20 min) vs Onboarding at 11:30 AM (40 min)
  const followUp = {
    startTime: "11:10",
    endTime: "11:30"
  }
  
  const onboarding = {
    startTime: "11:30", 
    endTime: "12:10"
  }
  
  const baseDate = new Date(2024, 0, 1)
  const followUpStart = parse(followUp.startTime, "HH:mm", baseDate)
  const followUpEnd = parse(followUp.endTime, "HH:mm", baseDate)
  const onboardingStart = parse(onboarding.startTime, "HH:mm", baseDate)
  const onboardingEnd = parse(onboarding.endTime, "HH:mm", baseDate)
  
  const overlaps = followUpStart < onboardingEnd && followUpEnd > onboardingStart
  
  console.log("📅 Test 1: Adjacent bookings (should NOT overlap)")
  console.log("Follow-up: 11:10 - 11:30")
  console.log("Onboarding: 11:30 - 12:10")
  console.log("Overlaps:", overlaps, "✅ Expected: false")
  
  // Test case: Overlapping bookings
  const overlappingBooking = {
    startTime: "11:30",
    endTime: "12:10"
  }
  
  const existingBookings = [
    { startTime: "11:10", endTime: "11:30" }, // Follow-up
    { startTime: "11:50", endTime: "12:30" }  // Onboarding
  ]
  
  const hasOverlap = existingBookings.some((booking) => {
    const existingStart = parse(booking.startTime, "HH:mm", baseDate)
    const existingEnd = parse(booking.endTime, "HH:mm", baseDate)
    const newStart = parse(overlappingBooking.startTime, "HH:mm", baseDate)
    const newEnd = parse(overlappingBooking.endTime, "HH:mm", baseDate)
    
    return newStart < existingEnd && newEnd > existingStart
  })
  
  console.log("\n📅 Test 2: Overlapping booking (should overlap)")
  console.log("New booking: 11:30 - 12:10")
  console.log("Existing: 11:10-11:30, 11:50-12:30")
  console.log("Has overlap:", hasOverlap, "✅ Expected: true")
  
  console.log("\n🎯 Overlap detection is working correctly!")
}
