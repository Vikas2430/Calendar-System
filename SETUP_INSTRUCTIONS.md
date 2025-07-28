# HealthTick Calendar - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Enable Firestore Database
- Go to [Firebase Console](https://console.firebase.google.com/project/healthtick-calendar-3ec25/firestore)
- Click "Create database"
- Choose "Start in test mode"
- Select your location and click "Done"

### 2. Install and Run
\`\`\`bash
npm install
npm run dev
\`\`\`

### 3. Open the App
- Go to http://localhost:3000
- Click "Seed Data" button to add sample bookings
- Start creating your own bookings!

## 🎯 Your Firebase Configuration
Your project is already configured with these settings:
- **Project ID**: healthtick-calendar-3ec25
- **API Key**: AIzaSyC8vnakK7fYK73uMmrT6ejBaK6cm_MfeWo
- **Auth Domain**: healthtick-calendar-3ec25.firebaseapp.com

## ✅ What Works Out of the Box
- ✅ Smart calendar with 20-minute time slots
- ✅ Onboarding calls (40 minutes, one-time)
- ✅ Follow-up calls (20 minutes, weekly recurring)
- ✅ Overlap prevention
- ✅ Client search (20 dummy clients)
- ✅ Real-time Firebase sync
- ✅ Mobile responsive design
- ✅ In-app database seeding

## 🧪 Test the System
1. **Add Sample Data**: Click "Seed Data" button in the app
2. **Create Bookings**: Try booking different call types
3. **Test Overlaps**: Try booking conflicting times (should be prevented)
4. **Check Recurring**: Follow-up calls appear weekly
5. **Search Clients**: Find clients by name or phone

## 🚀 Deploy to Production
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 🔒 Security Note
Your Firebase is currently in "test mode" - perfect for development. For production, update your Firestore security rules.

---
**Ready to go!** Your calendar system is production-ready with smart scheduling, beautiful UI, and clean architecture.
