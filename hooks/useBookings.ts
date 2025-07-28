"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Booking } from "@/lib/types"

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "bookings"),
      (snapshot) => {
        const bookingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[]

        setBookings(bookingsData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching bookings:", error)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  const addBooking = async (bookingData: Omit<Booking, "id" | "createdAt">) => {
    try {
      await addDoc(collection(db, "bookings"), {
        ...bookingData,
        createdAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error adding booking:", error)
      throw error
    }
  }

  const deleteBooking = async (bookingId: string) => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId))
    } catch (error) {
      console.error("Error deleting booking:", error)
      throw error
    }
  }

  const updateBooking = async (bookingId: string, bookingData: Partial<Booking>) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        ...bookingData,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error updating booking:", error)
      throw error
    }
  }

  return {
    bookings,
    loading,
    addBooking,
    deleteBooking,
    updateBooking,
  }
}
