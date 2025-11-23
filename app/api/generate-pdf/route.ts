export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import React from "react";

// Inline PDF Document Component using React.createElement (no JSX)
const InterviewReportPDF = ({ reportDate, reportId, allQuestionData, feedback, resumeAnalysis }: any) => {
  const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
    section: { marginBottom: 15 },
    heading: { fontSize: 16, marginBottom: 10, fontWeight: 'bold' },
    text: { marginBottom: 5, lineHeight: 1.5 },
    bold: { fontWeight: 'bold' },
  });

  const questionsSection = allQuestionData && allQuestionData.length > 0 
    ? React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.heading }, 'Questions & Answers'),
        ...allQuestionData.map((q: any, i: number) => 
          React.createElement(View, { key: i, style: { marginBottom: 10 } },
            React.createElement(Text, { style: styles.bold }, `Q${i + 1}: ${q.question}`),
            React.createElement(Text, { style: styles.text }, `A: ${q.answer}`)
          )
        )
      )
    : null;

  const resumeSection = resumeAnalysis
    ? React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.heading }, 'Resume Analysis'),
        React.createElement(Text, { style: styles.text }, resumeAnalysis)
      )
    : null;

  return React.createElement(Document, {},
    React.createElement(Page, { size: 'A4', style: styles.page },
      React.createElement(Text, { style: styles.title }, 'Interview Feedback Report'),
      
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.text }, `Report ID: ${reportId}`),
        React.createElement(Text, { style: styles.text }, `Date: ${reportDate}`)
      ),

      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.heading }, 'Overall Feedback'),
        React.createElement(Text, { style: styles.text }, feedback || 'No feedback available')
      ),

      questionsSection,
      resumeSection
    )
  );
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { reportDate, reportId, allQuestionData, feedback, resumeAnalysis } = data;

    const doc = React.createElement(InterviewReportPDF, {
      reportDate,
      reportId,
      allQuestionData,
      feedback,
      resumeAnalysis,
    });

    const pdfBuffer = await pdf(doc).toBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=Interview_Feedback_Report.pdf",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
