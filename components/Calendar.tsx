"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { format, isSameDay, startOfDay, parse } from "date-fns"
import TimeSlot from "./TimeSlot"
import BookingModal from "./BookingModal"
import EditBookingModal from "./EditBookingModal"
import { useBookings } from "@/hooks/useBookings"
import type { Booking, TimeSlotData } from "@/lib/types"
import { generateTimeSlots, checkOverlap, getRecurringBookings } from "@/lib/utils"

interface CalendarProps {
  selectedDate: Date
}

export default function Calendar({ selectedDate }: CalendarProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const { bookings, loading, addBooking, deleteBooking, updateBooking } = useBookings()

  const getDayBookings = useCallback((date: Date, allBookings: Booking[]): Booking[] => {
    const dayBookings: Booking[] = []

    allBookings.forEach((booking) => {
      // Direct bookings for this date
      if (isSameDay(new Date(booking.date), date)) {
        dayBookings.push(booking)
      }
      // Recurring follow-up bookings
      else if (booking.isRecurring && booking.callType === "follow-up") {
        const recurringBookings = getRecurringBookings(booking, date)
        dayBookings.push(...recurringBookings)
      }
    })

    return dayBookings
  }, [])

  // Memoize day bookings to avoid recalculating on every render
  const dayBookings = useMemo(() => {
    return getDayBookings(selectedDate, bookings)
  }, [selectedDate, bookings, getDayBookings])

  // Memoize time slots with bookings to avoid recalculating on every render
  const timeSlots = useMemo(() => {
    const slots = generateTimeSlots()
    const baseDate = new Date(2024, 0, 1) // Consistent base date for all comparisons

    return slots.map((slot) => {
      // Find if there's a booking that starts at this exact time
      const booking = dayBookings.find((b) => b.startTime === slot.time)
      
      // Check if this time slot falls within any existing booking's duration
      const isOccupied = dayBookings.some((b) => {
        const bookingStart = parse(b.startTime, "HH:mm", baseDate)
        const bookingEnd = parse(b.endTime, "HH:mm", baseDate)
        const slotTime = parse(slot.time, "HH:mm", baseDate)
        
        // Check if slot time falls within the booking duration
        return slotTime >= bookingStart && slotTime < bookingEnd
      })

      return {
        ...slot,
        booking: booking || null,
        isAvailable: !isOccupied,
      }
    })
  }, [dayBookings])

  const handleSlotClick = useCallback((time: string) => {
    setSelectedSlot(time)
    setIsBookingModalOpen(true)
  }, [])

  const handleBookingSubmit = useCallback(async (bookingData: Omit<Booking, "id" | "createdAt">) => {
    const dayBookings = getDayBookings(selectedDate, bookings)

    // Check for overlaps
    const hasOverlap = checkOverlap(bookingData, dayBookings)
    if (hasOverlap) {
      alert("This booking would overlap with an existing call. Please choose a different time.")
      return
    }

    await addBooking(bookingData)
    setIsBookingModalOpen(false)
    setSelectedSlot(null)
  }, [selectedDate, bookings, getDayBookings, addBooking])

  const handleDeleteBooking = useCallback(async (bookingId: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      await deleteBooking(bookingId)
    }
  }, [deleteBooking])

  const handleEditBooking = useCallback((booking: any) => {
    setSelectedBooking(booking)
    setIsEditModalOpen(true)
  }, [])

  const handleEditSubmit = useCallback(async (bookingData: any) => {
    try {
      await updateBooking(selectedBooking.id, bookingData)
      setIsEditModalOpen(false)
      setSelectedBooking(null)
    } catch (error) {
      console.error("Error updating booking:", error)
      alert("Failed to update booking. Please try again.")
    }
  }, [selectedBooking, updateBooking])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-blue-400 opacity-20"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </h2>
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-800">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
          {timeSlots.filter((slot) => slot.booking).length} calls scheduled today
        </div>
      </div>

      <div className="grid gap-3 max-w-4xl mx-auto">
        {timeSlots.map((slot) => (
          <TimeSlot 
            key={slot.time} 
            slot={slot} 
            onSlotClick={handleSlotClick} 
            onDeleteBooking={handleDeleteBooking}
            onEditBooking={handleEditBooking}
          />
        ))}
      </div>

      {isBookingModalOpen && (
        <BookingModal
          selectedDate={selectedDate}
          selectedTime={selectedSlot}
          onClose={() => {
            setIsBookingModalOpen(false)
            setSelectedSlot(null)
          }}
          onSubmit={handleBookingSubmit}
        />
      )}

      {isEditModalOpen && selectedBooking && (
        <EditBookingModal
          booking={selectedBooking}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedBooking(null)
          }}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  )
}
