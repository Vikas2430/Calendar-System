"use client"

import { useState } from "react"
import Calendar from "@/components/Calendar"
import { format } from "date-fns"
import DatabaseSeeder from "@/components/DatabaseSeeder"

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showSeeder, setShowSeeder] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                HealthTick Calendar
              </h1>
              <p className="text-blue-100 mt-1 text-lg">Manage your coaching calls with precision</p>
              </div>
            <div className="flex lg:items-center flex-col lg:flex-row gap-3">
                <button
                  onClick={() => setShowSeeder(!showSeeder)}
                className="lg:px-4 lg:py-2 px-3 py-2 text-sm bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl"
                >
                  {showSeeder ? "Hide" : "Seed Data"}
                </button>
                <input
                  type="date"
                  value={format(selectedDate, "yyyy-MM-dd")}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 transition-all duration-300"
                />
            </div>
              </div>
            </div>
          </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
          {showSeeder && (
            <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-green-50 to-emerald-50">
              <DatabaseSeeder />
            </div>
          )}

          <Calendar selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  )
}
