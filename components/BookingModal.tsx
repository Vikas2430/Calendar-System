"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { X } from "lucide-react"
import ClientSearch from "./ClientSearch"
import type { Booking, Client } from "@/lib/types"
import { calculateEndTime } from "@/lib/utils"

interface BookingModalProps {
  selectedDate: Date
  selectedTime: string | null
  onClose: () => void
  onSubmit: (booking: Omit<Booking, "id" | "createdAt">) => void
}

export default function BookingModal({ selectedDate, selectedTime, onClose, onSubmit }: BookingModalProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [callType, setCallType] = useState<"onboarding" | "follow-up">("onboarding")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClient || !selectedTime) {
      alert("Please select a client and time slot")
      return
    }

    setIsSubmitting(true)

    const endTime = calculateEndTime(selectedTime, callType)

    const bookingData: any = {
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientPhone: selectedClient.phone,
      callType,
      date: format(selectedDate, "yyyy-MM-dd"),
      startTime: selectedTime,
      endTime,
      isRecurring: callType === "follow-up",
    }

    // Only add recurringStartDate if it's a follow-up call
    if (callType === "follow-up") {
      bookingData.recurringStartDate = format(selectedDate, "yyyy-MM-dd")
    }

    const booking: Omit<Booking, "id" | "createdAt"> = bookingData

    try {
      await onSubmit(booking)
    } catch (error) {
      console.error("Error creating booking:", error)
      alert("Failed to create booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg mx-4 border border-white/20 mt-8 mb-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Book New Call
            </h2>
            <p className="text-sm text-gray-600 mt-1">Schedule your coaching session</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Date & Time</label>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200/50">
              <p className="text-base font-medium text-gray-900">
                {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Client</label>
            <ClientSearch selectedClient={selectedClient} onClientSelect={setSelectedClient} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Call Type</label>
            <div className="space-y-4">
              <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                <input
                  type="radio"
                  name="callType"
                  value="onboarding"
                  checked={callType === "onboarding"}
                  onChange={(e) => setCallType(e.target.value as "onboarding")}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-4">
                  <span className="text-base font-semibold text-gray-900">Onboarding Call</span>
                  <p className="text-sm text-gray-600 mt-1">40 minutes • One-time only</p>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all duration-300 cursor-pointer">
                <input
                  type="radio"
                  name="callType"
                  value="follow-up"
                  checked={callType === "follow-up"}
                  onChange={(e) => setCallType(e.target.value as "follow-up")}
                  className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <div className="ml-4">
                  <span className="text-base font-semibold text-gray-900">Follow-up Call</span>
                  <p className="text-sm text-gray-600 mt-1">20 minutes • Weekly recurring</p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedClient || isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Booking...
                </div>
              ) : (
                "Book Call"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
