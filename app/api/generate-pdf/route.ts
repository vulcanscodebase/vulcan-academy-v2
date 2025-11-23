export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { pdf } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import MyPDFDocument from "@/components/MyPDFDocument";
import React from "react";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { reportDate, reportId, allQuestionData, feedback, resumeAnalysis } = data;

  // MyPDFDocument already returns a <Document>
  const doc = React.createElement(MyPDFDocument, {
    reportDate,
    reportId,
    allQuestionData,
    feedback,
    resumeAnalysis,
  });

  const pdfBuffer = await pdf(doc as ReactElement<DocumentProps>).toBuffer();

  return new NextResponse(pdfBuffer as unknown as ArrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=Interview_Feedback_Report.pdf",
    },
  }); 
}
