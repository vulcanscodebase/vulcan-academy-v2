export interface ArrowAnnotation {
  top: number;
  left: number;
  caption: string;
  direction?: "up" | "down";
}

export interface Marker {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  image: string;
  clickable?: boolean;
  sequenceMarkers?: boolean;
  clickableMarkerIndex?: number;
  marker?: Marker;
  markers?: Marker[];
  arrowAnnotation?: ArrowAnnotation;
  arrowAnnotations?: ArrowAnnotation[];
}

export const steps: OnboardingStep[] = [
  {
    id: 1,
    title: "Start Interview",
    description: "Click 'Take Interview Now' to begin your mock interview.",
    image: "/onboarding/take-review.png",
    clickable: true,
    marker: { top: 77.5, left: 52, width: 16, height: 12 },
    arrowAnnotation: {
      top: 57,
      left: 60,
      caption: "Click here to start interview",
    },
  },
  {
    id: 2,
    title: "Fill Details",
    description: "Fill in the appropriate details for the mock interview.",
    image: "/onboarding/fill_details.png",
    sequenceMarkers: true,
    markers: [
      { top: 8, left: 15, width: 75, height: 15 },
      { top: 27, left: 15, width: 75, height: 13 },
      { top: 45, left: 15, width: 35, height: 10 },
      { top: 56, left: 15, width: 70, height: 43 },
    ],
    arrowAnnotations: [
      {
        top: 22,
        left: 50,
        caption: "Select your graduation degree",
        direction: "up",
      },
      {
        top: 15,
        left: 50,
        caption: "Choose role you are taking interview for",
      },
      {
        top: 33,
        left: 30,
        caption: "Select your mode of interview",
      },
      {
        top: 45,
        left: 50,
        caption:
          "Upload your resume here by using file upload or drag and drop",
      },
    ],
  },
  {
    id: 3,
    title: "Upload File",
    description:
      "Upload your resume here by using file upload or drag and drop.",
    image: "/onboarding/upload_file.png",
    clickableMarkerIndex: 0,
    markers: [{ top: 26, left: 5, width: 90, height: 10 }],
    arrowAnnotations: [
      {
        top: 16,
        left: 30,
        caption:
          "Upload your resume here by using file upload or drag and drop",
      },
    ],
  },
  {
    id: 4,
    title: "Filled Details",
    description: "Fill in the appropriate details for the mock interview.",
    image: "/onboarding/filled_details.png",
    sequenceMarkers: true,
    markers: [{ top: 91, left: 2, width: 96, height: 9 }],
    arrowAnnotations: [
      {
        top: 80,
        left: 50,
        caption: "Click to Continue to interview setup",
      },
    ],
  },
  {
    id: 5,
    title: "Instructions",
    description: "Read the rules, then click 'Start Interview' to continue.",
    image: "/onboarding/instructions.png",
    clickableMarkerIndex: 1,
    markers: [
      { top: 15, left: 4, width: 30, height: 10 },
      { top: 85.5, left: 49, width: 47, height: 8 },
    ],
    arrowAnnotations: [
      {
        top: 24,
        left: 19,
        caption: "Read the important instructions",
        direction: "up",
      },
      {
        top: 71,
        left: 72,
        caption: "Click here to start the interview",
        direction: "down",
      },
    ],
  },
  {
    id: 6,
    title: "Interview Hints",
    description: "Click 'Allow' when the browser asks for camera & microphone.",
    image: "/onboarding/interview-hints.png",
    clickableMarkerIndex: 1,
    markers: [
      { top: 66, left: 18, width: 8, height: 8 },
      { top: 81, left: 59, width: 18, height: 9 },
    ],
    arrowAnnotations: [
      {
        top: 52,
        left: 22,
        caption: "Click Allow for camera & mic access",
      },
      {
        top: 67,
        left: 68,
        caption: "Click here to start the interview",
      },
    ],
  },
  {
    id: 7,
    title: "Answer Questions",
    description: "Click 'Start Interview' to begin answering the AI questions.",
    image: "/onboarding/answer-questions.png",
    clickableMarkerIndex: 0,
    markers: [
      { top: 83, left: 61, width: 16, height: 10 },
      { top: 79, left: 2, width: 35, height: 20 },
    ],
    arrowAnnotations: [
      {
        top: 66,
        left: 69,
        caption: "Click to start answering questions",
      },
      {
        top: 63,
        left: 17,
        caption: "Your current question appears here",
      },
    ],
  },
  {
    id: 8,
    title: "Recording & End Interview",
    description: "Record your answers then click 'End Interview' when done.",
    image: "/onboarding/recording.jpeg",
    clickableMarkerIndex: 0,
    markers: [{ top: 59, left: 54, width: 17, height: 8 }],
    arrowAnnotations: [
      {
        top: 47,
        left: 62,
        caption: "Click to record your answer(20 secs)",
      },
    ],
  },
  {
    id: 9,
    title: "Stop & Submit",
    description:
      "When you finish recording, click 'Stop & Submit' to submit your answer or 'End Interview' to exit.",
    image: "/onboarding/stop-submit.png",
    clickableMarkerIndex: 0,
    markers: [{ top: 83.5, left: 55, width: 19, height: 10 }],
    arrowAnnotations: [
      {
        top: 67,
        left: 64,
        caption: "Click Stop & Submit to submit your answer",
      },
    ],
  },
  {
    id: 10,
    title: "End Interview",
    description:
      "Once all questions are answered, click 'End Interview' to finish and submit your session.",
    image: "/onboarding/End_interview.png",
    clickableMarkerIndex: 0,
    markers: [{ top: 83.5, left: 69.5, width: 15, height: 10 }],
    arrowAnnotations: [
      {
        top: 70,
        left: 76,
        caption: "Click End Interview to finish your session",
      },
    ],
  },
  {
    id: 11,
    title: "Download Report",
    description: "Download your report to track your interview progress.",
    image: "/onboarding/download_report.png",
    marker: { top: 68, left: 44, width: 27, height: 14 },
    arrowAnnotation: {
      top: 55,
      left: 57,
      caption: "Scroll down to download your interview report",
    },
  },
];
