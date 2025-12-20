# Vulcan Prep 360 - Complete Integration Guide

## 🎯 Complete User Flow

### Admin Side:
1. **Admin adds licenses** to user accounts via admin panel
2. Each license = 1 interview credit
3. Admin can view all user interviews and statistics

### User Side:
1. **User signs in** to their account
2. **Navigates to Interview tab** (`/interview`)
3. **Automatically redirected to upload page** if authenticated
4. **Uploads resume PDF** and selects job role
5. **Reviews preparation guide** with tips
6. **Takes AI interview** with video/audio recording
7. **Receives detailed feedback** with metrics
8. **Downloads PDF report**
9. **Views past interviews** from profile page
10. **License is deducted** after completing interview

---

## 📁 Project Structure

### Pages Created:

```
/vulcan-academy-v2/app/
├── interview/
│   ├── page.tsx                              # Landing page (redirects to upload if logged in)
│   ├── upload/page.tsx                       # Resume upload + job role selection
│   ├── ai/
│   │   ├── instructions/page.tsx             # Interview preparation guide
│   │   └── page.tsx                          # Main AI interview (video/audio)
│   └── feedback/page.tsx                     # Detailed feedback report
│
└── user-profile/
    ├── page.tsx                               # User profile (shows remaining interviews)
    └── interviews/
        ├── page.tsx                           # List all past interviews
        └── [interviewId]/page.tsx             # Detailed interview view
```

### API Routes:

```
/vulcan-academy-v2/app/api/
├── extract-pdf/route.ts                       # Extract text from PDF
├── questions/route.ts                         # Generate interview questions
├── transcribe/route.ts                        # Transcribe audio using AssemblyAI
├── transcript/[transcriptId]/route.ts         # Get transcription results
├── followup/[transcriptId]/route.ts           # Generate follow-up questions
├── resumeEva/route.ts                         # Evaluate resume (role-specific)
├── resumeEvagen/route.ts                      # Evaluate resume (general)
├── interview-feedback/route.ts                # Generate overall feedback
└── generate-pdf/route.ts                      # Generate PDF report
```

### Components:

```
/vulcan-academy-v2/components/
└── (interview-master)/
    └── bot.tsx                                # AI interviewer avatar with TTS
```

### Data Files:

```
/vulcan-academy-v2/app/data/
└── questions.json                             # Interview questions by job role
```

---

## 🔐 Authentication & Authorization

### Frontend Protection:
- All interview pages check for `accessToken` in localStorage
- Redirects to `/signin` if not authenticated
- `/interview` page shows login prompt for unauthenticated users
- Authenticated users are auto-redirected to `/interview/upload`

### Backend Protection:
- All `/api/interviews/*` routes require authentication
- User must have valid JWT token (cookies)
- Interview ownership verified before allowing access

### License System:
- User's `licenses` field tracks available interviews
- Each completed interview deducts 1 license
- User cannot start interview with 0 licenses
- Abandoned interviews don't deduct licenses

---

## 🎨 User Interface Features

### Main Interview Page (`/interview`):
- ✅ Shows login prompt if not authenticated
- ✅ Auto-redirects to upload page if logged in
- ✅ Beautiful hero section with feature showcase
- ✅ "Sign In" and "Create Account" buttons

### Upload Page (`/interview/upload`):
- ✅ Drag & drop PDF upload
- ✅ Job role dropdown with search
- ✅ Form validation (PDF only, max 5MB)
- ✅ Progress indicator (Step 2 of 5)
- ✅ Resume analysis with AI
- ✅ ATS score calculation

### AI Interview Page (`/interview/ai`):
- ✅ Live video recording
- ✅ AI bot avatar with text-to-speech
- ✅ Question-by-question recording
- ✅ Real-time transcription
- ✅ Performance metrics calculation
- ✅ Dynamic follow-up questions

### Feedback Page (`/interview/feedback`):
- ✅ Overall performance score
- ✅ Detailed metrics (confidence, body language, knowledge, fluency, skill relevance)
- ✅ Strengths and improvements breakdown
- ✅ Interview tips
- ✅ Resume ATS score and tips
- ✅ Downloadable PDF report
- ✅ Question-by-question analysis
- ✅ Audio playback for each answer

### User Profile:
- ✅ "Remaining Interviews" badge showing available licenses
- ✅ "My Interviews" button to view past interviews
- ✅ Beautiful card layout

### My Interviews Page (`/user-profile/interviews`):
- ✅ List of all past interviews
- ✅ Interview cards with status, date, and score
- ✅ Filter by status (completed, in progress, abandoned)
- ✅ "View Details" and "Download Report" buttons
- ✅ "New Interview" button

### Interview Details Page (`/user-profile/interviews/[id]`):
- ✅ Full performance breakdown
- ✅ Overall score and metrics
- ✅ Strengths, improvements, and tips
- ✅ Question-by-question analysis
- ✅ Download report button

---

## 🔌 Backend Integration

### API Endpoints Used:

#### Interview Management:
```
POST   /api/interviews/start                   # Start new interview session
POST   /api/interviews/complete                # Complete interview & deduct license
GET    /api/interviews/:interviewId            # Get interview details
GET    /api/interviews/user/:userId            # Get all user interviews
POST   /api/interviews/:interviewId/abandon    # Abandon interview (no deduction)
PUT    /api/interviews/:interviewId/feedback   # Update interview with feedback
```

#### User Data:
```
GET    /api/users/:userId                      # Get user profile with licenses
PUT    /api/users/:userId                      # Update user profile
```

### Data Flow:

1. **Start Interview:**
   - Frontend calls `/api/interviews/start`
   - Backend creates interview document
   - Checks user has sufficient licenses
   - Returns interview ID

2. **During Interview:**
   - Audio recorded per question
   - Sent to `/api/transcribe`
   - Transcription retrieved from `/api/transcript/:id`
   - Follow-up questions from `/api/followup/:id`

3. **Complete Interview:**
   - Frontend calls `/api/interviews/complete`
   - Backend saves all data
   - Deducts 1 license from user
   - Creates transaction record

4. **View Past Interviews:**
   - Frontend calls `/api/interviews/user/:userId`
   - Returns paginated list of interviews
   - Click to view details via `/api/interviews/:interviewId`

---

## 📦 Required Dependencies

### New Dependencies Added:
```json
{
  "@ai-sdk/google": "^1.2.22",         // Google AI integration
  "@react-pdf/renderer": "^4.3.0",     // PDF generation
  "ai": "^4.3.17",                     // AI SDK
  "formidable": "^3.5.4",              // File upload handling
  "framer-motion": "^12.23.3",         // Animations
  "pdf-parse": "^1.1.1"                // PDF text extraction
}
```

### Installation:
```bash
cd vulcan-academy-v2
npm install
```

---

## 🔧 Environment Variables Required

### Add to `.env.local`:
```env
# AssemblyAI for transcription
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here

# Backend API URL
NEXT_PUBLIC_SERVER_URI=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Google AI (if using Gemini for resume evaluation)
GOOGLE_API_KEY=your_google_api_key_here
```

---

## 🚀 How to Run

### 1. Start Backend Server:
```bash
cd vulcan-server-v2
npm install
npm run dev
# Should run on http://localhost:5000
```

### 2. Start Frontend:
```bash
cd vulcan-academy-v2
npm install
npm run dev
# Should run on http://localhost:3000
```

### 3. Test the Flow:

1. **Admin Setup:**
   - Login as admin
   - Add licenses to test user account

2. **User Flow:**
   - Login as user
   - Go to `/interview` (auto-redirects to `/interview/upload`)
   - Upload resume PDF
   - Select job role
   - Click "Continue to Interview Setup"
   - Review instructions
   - Click "Start Interview"
   - Grant camera/microphone permissions
   - Answer questions one by one
   - Click "End Interview" after last question
   - View feedback report
   - Download PDF report
   - Go to Profile → My Interviews
   - View past interview details

---

## 🎯 Key Features

### ✅ Resume Analysis:
- PDF text extraction
- ATS score calculation
- Resume improvement tips
- Role-specific or general evaluation

### ✅ AI Interview:
- Text-to-speech for questions
- Video recording of interview
- Audio recording per question
- Real-time transcription using AssemblyAI
- Dynamic follow-up questions
- Performance metrics calculation

### ✅ Detailed Feedback:
- Confidence scoring
- Body language analysis
- Knowledge assessment
- Fluency evaluation
- Skill relevance rating
- Personalized tips and improvements

### ✅ Data Persistence:
- All interviews saved to database
- Question-by-question transcripts
- Performance metrics stored
- Accessible from user profile
- PDF report generation

### ✅ License Management:
- Admin controls user licenses
- Real-time license tracking
- License deduction on completion
- No deduction for abandoned interviews
- Display remaining interviews in profile

---

## 📊 Database Schema

### Interview Model:
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  jobRole: string,
  startedAt: Date,
  completedAt: Date,
  status: 'started' | 'in_progress' | 'completed' | 'abandoned',
  resume: {
    text: string,
    fileName: string,
    evaluation: object
  },
  questionsData: [{
    question: string,
    questionNumber: number,
    transcript: string,
    metrics: {
      confidence: number,
      bodyLanguage: number,
      knowledge: number,
      skillRelevance: number,
      fluency: number,
      feedback: string
    },
    audioURL: string
  }],
  report: {
    strengths: string[],
    improvements: string[],
    tips: string[],
    overallFeedback: string,
    metrics: {
      avgConfidence: number,
      avgBodyLanguage: number,
      avgKnowledge: number,
      avgSkillRelevance: number,
      avgFluency: number,
      totalQuestions: number
    }
  },
  metadata: object
}
```

### User Model (Updated):
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  licenses: number,        // Available interviews
  // ... other fields
}
```

### Transaction Model:
```typescript
{
  _id: ObjectId,
  type: 'credited' | 'deducted',
  userId: ObjectId,
  amount: number,
  reason: string,
  interviewId: ObjectId,
  balanceBefore: number,
  balanceAfter: number,
  status: 'completed',
  createdAt: Date
}
```

---

## 🎨 UI/UX Highlights

- **Gradient Themes:** Blue to purple throughout
- **Smooth Animations:** Framer Motion for all transitions
- **Responsive Design:** Mobile-first approach
- **Loading States:** Spinners and skeletons
- **Error Handling:** User-friendly error messages
- **Progress Indicators:** Step tracking (1/5, 2/5, etc.)
- **Status Badges:** Color-coded interview status
- **Star Ratings:** Visual metric display
- **Card Layouts:** Modern, clean design
- **Backdrop Blur:** Glassmorphism effects

---

## 🔒 Security Features

- JWT authentication required
- Protected API routes
- Interview ownership verification
- File upload validation (PDF only, max 5MB)
- Sanitized audio URLs
- CORS configured
- Rate limiting on transcription
- Error logging without exposing internals

---

## 🐛 Troubleshooting

### Issue: "Insufficient licenses"
- **Solution:** Admin needs to add licenses to user account

### Issue: "Microphone not working"
- **Solution:** Grant browser permissions, use Chrome/Edge

### Issue: "Transcription timeout"
- **Solution:** Check AssemblyAI API key and quota

### Issue: "PDF upload fails"
- **Solution:** Ensure PDF is valid, unencrypted, under 5MB

### Issue: "Backend connection failed"
- **Solution:** Check NEXT_PUBLIC_SERVER_URI is correct and backend is running

---

## 📝 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Add environment variables to `.env.local`
3. ✅ Start backend server
4. ✅ Start frontend server
5. ✅ Test admin adding licenses
6. ✅ Test user taking interview
7. ✅ Verify interview is saved to database
8. ✅ Check profile shows remaining interviews
9. ✅ View past interviews from profile

---

## 🎉 Integration Complete!

Vulcan Prep 360 is now fully integrated into Academy V2 with:
- ✅ Authentication & authorization
- ✅ Resume upload & analysis
- ✅ AI-powered interviews
- ✅ Real-time transcription
- ✅ Performance metrics
- ✅ Detailed feedback reports
- ✅ License management
- ✅ Interview history in profile
- ✅ PDF report generation
- ✅ Complete backend integration

**Both projects are now combined into a single, cohesive product!**

