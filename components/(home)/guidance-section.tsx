// // app/guidance/page.tsx (or pages/guidance.tsx if not App Router)
// "use client";

// import { useState } from "react";
// import guidanceDataJson from "@/data/guidance-data.json";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";


// type Option = {
//   text: string;
//   nextStep?: string;
//   answer?: string;
//   answers?: string[];
//   link?: string;
//   links?: string[];
//   question?: string;
//   options?: Option[];
// };

// type GuidanceData = {
//   [key: string]: {
//     question: string;
//     options: Option[];
//   };
// };


// const guidanceData: GuidanceData = guidanceDataJson as GuidanceData;


// export function GuidanceSection() {
//   const [currentStep, setCurrentStep] = useState("startingPoint");
//   const [finalAnswers, setFinalAnswers] = useState<string[] | null>(null);
//   const [finalLinks, setFinalLinks] = useState<string[] | null>(null);

//   const handleOptionClick = (option: Option) => {
//     if (option.answer || option.answers) {
//       setFinalAnswers(option.answer ? [option.answer] : option.answers || []);
//       setFinalLinks(option.link ? [option.link] : option.links || []);
//     } else if (option.nextStep) {
//       setCurrentStep(option.nextStep);
//     } else {
//       console.error("Invalid option:", option);
//     }
//   };

//   const handleRestart = () => {
//     setCurrentStep("startingPoint");
//     setFinalAnswers(null);
//     setFinalLinks(null);
//   };

//   const currentData = guidanceData[currentStep];

//   if (!currentData) {
//     return (
//       <div className="p-8">
//         <p className="text-red-500">⚠️ Error: Guidance data not found.</p>
//         <Button
//           onClick={handleRestart}
//           className="mt-4 bg-vulcan-accent-blue text-vulcan-white hover:bg-vulcan-accent-blue/90"
//         >
//           Restart
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <section className="w-full py-16 md:py-28 lg:py-40 bg-background">
//       <div className="px-4 sm:px-6 lg:px-12 xl:px-16">
//         {/* Heading */}
//         <h2 className="text-left text-lg sm:text-xl md:text-2xl text-foreground/80 dark:text-foreground/80 mb-4">
//           Find your path, tailored just for you!
//         </h2>
//         <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground dark:text-foreground mb-12 text-left leading-snug">
//           Your Personalized Guidance Assistant
//         </p>

//         {/* Guidance Flow */}
//         <div className="guidance-system">
//           {finalAnswers ? (
//             <div className="p-6 bg-vulcan-white dark:bg-gray-900 rounded-3xl shadow-lg">
//               <h2 className="text-xl font-semibold mb-6">Here’s Your Recommendation</h2>
//               <ul className="list-disc list-inside space-y-2 mb-6">
//                 {finalAnswers.map((answer, index) => (
//                   <li key={index}>
//                     {finalLinks && finalLinks[index] ? (
//                       <a
//                         href={finalLinks[index]}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-vulcan-accent-blue hover:underline"
//                       >
//                         {answer}
//                       </a>
//                     ) : (
//                       answer
//                     )}
//                   </li>
//                 ))}
//               </ul>
//               <Button
//                 onClick={handleRestart}
//                 className="bg-vulcan-accent-blue text-vulcan-white hover:bg-vulcan-accent-blue/90"
//               >
//                 Discover More
//               </Button>
//             </div>
//           ) : (
//             <div className="p-6 bg-vulcan-white dark:bg-gray-900 rounded-3xl shadow-lg">
//               <h2 className="text-left text-lg sm:text-xl md:text-2xl text-foreground/80 dark:text-foreground/80 mb-4">{currentData.question}</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {currentData.options.map((option, index) => (
//                   <div
//                     key={index}
//                     onClick={() => handleOptionClick(option)}
//                     className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow hover:shadow-xl cursor-pointer transition text-center hover:bg-vulcan-accent-blue hover:text-white"
//                   >
//                     {option.text}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }


