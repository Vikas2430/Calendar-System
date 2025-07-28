import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc } from "firebase/firestore"

const firebaseConfig = {
  // Your Firebase config here
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const sampleBookings = [
  {
    clientId: "1",
    clientName: "Sriram Krishnan",
    clientPhone: "+91 98765 43210",
    callType: "onboarding",
    date: "2024-01-18",
    startTime: "11:10",
    endTime: "11:50",
    isRecurring: false,
    createdAt: new Date(),
  },
  {
    clientId: "2",
    clientName: "Shilpa Sharma",
    clientPhone: "+91 87654 32109",
    callType: "follow-up",
    date: "2024-01-18",
    startTime: "15:50",
    endTime: "16:10",
    isRecurring: true,
    recurringStartDate: "2024-01-18",
    createdAt: new Date(),
  },
]

async function seedData() {
  try {
    for (const booking of sampleBookings) {
      await addDoc(collection(db, "bookings"), booking)
      console.log("Added booking:", booking.clientName)
    }
    console.log("Seeding completed!")
  } catch (error) {
    console.error("Error seeding data:", error)
  }
}

// Uncomment to run: node scripts/seed-firebase.js
// seedData();
