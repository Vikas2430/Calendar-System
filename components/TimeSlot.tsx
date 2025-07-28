"use client"

import type { TimeSlotData } from "@/lib/types"
import { Trash2, Clock, User, Phone, Edit } from "lucide-react"

interface TimeSlotProps {
  slot: TimeSlotData
  onSlotClick: (time: string) => void
  onDeleteBooking: (bookingId: string) => void
  onEditBooking: (booking: any) => void
}

export default function TimeSlot({ slot, onSlotClick, onDeleteBooking, onEditBooking }: TimeSlotProps) {
  const { time, booking, isAvailable } = slot

  if (!booking && isAvailable) {
    return (
      <div
        onClick={() => onSlotClick(time)}
        className="group flex items-center justify-between p-6 border border-gray-200/50 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:scale-[1.02] bg-white/60 backdrop-blur-sm"
      >
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-lg font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">{time}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">Available</span>
          <div className="w-2 h-2 bg-green-400 rounded-full group-hover:bg-green-500 transition-colors"></div>
        </div>
      </div>
    )
  }

  // Slot is occupied by a booking's duration but doesn't start here
  if (!booking && !isAvailable) {
    return (
      <div className="flex items-center justify-between p-6 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 cursor-not-allowed opacity-75">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-gray-200 rounded-lg">
            <Clock className="h-5 w-5 text-gray-500" />
          </div>
          <span className="text-lg font-semibold text-gray-500">{time}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Occupied</span>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    )
  }

  // At this point, booking should not be null
  if (!booking) {
    return null
  }

  const getCallTypeColor = (callType: string) => {
    return callType === "onboarding" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
  }

  const getCallTypeDuration = (callType: string) => {
    return callType === "onboarding" ? "40 min" : "20 min"
  }

  return (
    <div className="p-6 border border-gray-200/50 rounded-xl bg-gradient-to-r from-white to-gray-50/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] backdrop-blur-sm">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Header with time and actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">{time}</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEditBooking(booking)}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title="Edit booking"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDeleteBooking(booking.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Delete booking"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Client information - compact design */}
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-900">{booking.clientName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{booking.clientPhone}</span>
        </div>
      </div>

        {/* Call type and duration - horizontal layout */}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getCallTypeColor(booking.callType)}`}>
            {booking.callType === "onboarding" ? "Onboarding" : "Follow-up"}
            {booking.isRecurring && " (R)"}
          </span>
          <div className="flex items-center space-x-1.5 px-2 py-1.5 bg-gray-50 rounded-lg">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-600">{getCallTypeDuration(booking.callType)}</span>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">{time}</span>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-lg">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">{booking.clientName}</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-lg">
                <Phone className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700">{booking.clientPhone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${getCallTypeColor(booking.callType)}`}>
              {booking.callType === "onboarding" ? "Onboarding" : "Follow-up"}
              {booking.isRecurring && " (Recurring)"}
            </span>
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">{getCallTypeDuration(booking.callType)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEditBooking(booking)}
              className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:shadow-md"
              title="Edit booking"
            >
              <Edit className="h-5 w-5" />
            </button>
        <button
          onClick={() => onDeleteBooking(booking.id)}
              className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 hover:shadow-md"
          title="Delete booking"
        >
              <Trash2 className="h-5 w-5" />
        </button>
          </div>
        </div>
      </div>
    </div>
  )
}
