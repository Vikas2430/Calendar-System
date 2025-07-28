# HealthTick Calendar System

A modern, intelligent calendar system for managing coaching calls with smart scheduling and recurring appointments.

## 🚀 Features

- **Smart Calendar UI**: Daily view with 20-minute time slots (10:30 AM - 7:30 PM)
- **Two Call Types**: 
  - Onboarding calls (40 minutes, one-time)
  - Follow-up calls (20 minutes, weekly recurring)
- **Intelligent Scheduling**: Prevents overlapping appointments
- **Client Management**: Searchable client database with 20 dummy clients
- **Real-time Updates**: Firebase integration for live calendar updates
- **Responsive Design**: Works perfectly on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase account
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd healthtick-calendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Get your Firebase configuration keys

4. **Environment Setup**
   - Create `.env.local` in the root directory
   - Add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Firebase Schema

### Bookings Collection
```typescript
{
  id: string                    // Auto-generated document ID
  clientId: string             // Reference to client
  clientName: string           // Client's full name
  clientPhone: string          // Client's phone number
  callType: 'onboarding' | 'follow-up'  // Type of call
  date: string                 // Date in YYYY-MM-DD format
  startTime: string            // Start time in HH:MM format
  endTime: string              // End time in HH:MM format
  isRecurring: boolean         // Whether this is a recurring appointment
  recurringStartDate?: string  // Original date for recurring appointments
  createdAt: timestamp         // Firebase server timestamp
}
```

### Clients (Static Data)
```typescript
{
  id: string      // Unique identifier
  name: string    // Full name
  phone: string   // Phone number with country code
}
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main calendar page
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles and Tailwind
├── components/
│   ├── Calendar.tsx          # Main calendar component
│   ├── TimeSlot.tsx          # Individual time slot component
│   ├── BookingModal.tsx      # Booking creation modal
│   └── ClientSearch.tsx      # Client search and selection
├── hooks/
│   └── useBookings.ts        # Firebase bookings management
├── lib/
│   ├── firebase.ts           # Firebase configuration
│   ├── types.ts              # TypeScript type definitions
│   └── utils.ts              # Utility functions
└── data/
    └── clients.ts            # Static client data (20 dummy clients)
```

## 🎯 Key Features Explained

### Smart Scheduling Logic
- **No Overlaps**: System prevents booking conflicts automatically
- **Duration Aware**: Onboarding calls (40 min) span multiple 20-min slots
- **Recurring Logic**: Follow-up calls repeat weekly on the same day/time

### User Experience
- **Intuitive Interface**: Clean, modern design with clear visual indicators
- **Real-time Updates**: Changes appear instantly across all sessions
- **Mobile Responsive**: Works seamlessly on all device sizes
- **Search Functionality**: Quick client lookup by name or phone

### Business Logic
- **Time Slots**: 20-minute intervals from 10:30 AM to 7:30 PM
- **Call Types**: 
  - Onboarding: 40 minutes, one-time only
  - Follow-up: 20 minutes, weekly recurring
- **Validation**: Comprehensive overlap detection and prevention

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically


## 🧪 Testing

### Manual Testing Checklist:
- [ ] Create onboarding call (40 minutes)
- [ ] Create follow-up call (20 minutes, recurring)
- [ ] Verify no overlapping bookings allowed
- [ ] Test client search functionality
- [ ] Verify recurring calls appear on correct dates
- [ ] Test delete functionality
- [ ] Check mobile responsiveness



**Built with ❤️ for HealthTick**
