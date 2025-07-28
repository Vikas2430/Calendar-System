"use client"

import { useState } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2, Database, CheckCircle, AlertCircle } from "lucide-react"

export default function DatabaseSeeder() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null)

  const sampleBookings = [
    {
      clientId: "1",
      clientName: "Sriram Krishnan",
      clientPhone: "+91 98765 43210",
      callType: "onboarding" as const,
      date: "2024-01-29",
      startTime: "11:10",
      endTime: "11:50",
      isRecurring: false,
    },
    {
      clientId: "2",
      clientName: "Shilpa Sharma",
      clientPhone: "+91 87654 32109",
      callType: "follow-up" as const,
      date: "2024-01-29",
      startTime: "15:50",
      endTime: "16:10",
      isRecurring: true,
      recurringStartDate: "2024-01-29",
    },
    {
      clientId: "3",
      clientName: "Rahul Gupta",
      clientPhone: "+91 76543 21098",
      callType: "follow-up" as const,
      date: "2024-01-30",
      startTime: "14:30",
      endTime: "14:50",
      isRecurring: true,
      recurringStartDate: "2024-01-30",
    },
  ]

  const seedDatabase = async () => {
    setIsSeeding(true)
    setSeedResult(null)

    try {
      const promises = sampleBookings.map((booking) =>
        addDoc(collection(db, "bookings"), {
          ...booking,
          createdAt: serverTimestamp(),
        }),
      )

      await Promise.all(promises)

      setSeedResult({
        success: true,
        message: `Successfully added ${sampleBookings.length} sample bookings to your database!`,
      })
    } catch (error) {
      console.error("Error seeding database:", error)
      setSeedResult({
        success: false,
        message: `Failed to seed database: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <Database className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Database Seeder</h2>
      </div>

      <p className="text-gray-600 mb-6">
        Add sample bookings to your database to test the calendar system. This will create 3 sample appointments with
        different clients and call types.
      </p>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Sample bookings that will be created:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {sampleBookings.map((booking, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>
                <strong>{booking.clientName}</strong> - {booking.callType} call on {booking.date} at {booking.startTime}
                {booking.isRecurring && " (recurring weekly)"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={seedDatabase}
        disabled={isSeeding}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSeeding ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Seeding Database...</span>
          </>
        ) : (
          <>
            <Database className="h-4 w-4" />
            <span>Seed Database with Sample Data</span>
          </>
        )}
      </button>

      {seedResult && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${
            seedResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}
        >
          {seedResult.success ? (
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          )}
          <div>
            <p className={`font-medium ${seedResult.success ? "text-green-800" : "text-red-800"}`}>
              {seedResult.success ? "Success!" : "Error"}
            </p>
            <p className={`text-sm ${seedResult.success ? "text-green-700" : "text-red-700"}`}>{seedResult.message}</p>
          </div>
        </div>
      )}
    </div>
  )
}
