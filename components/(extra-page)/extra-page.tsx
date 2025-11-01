// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { toast } from "sonner";
// import { getAllCourses } from "../api/coursesApi";
// import { requestHandler } from "@/utils/auth";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Button } from "@/components/ui/button";

// interface Course {
//   _id: string;
//   title: string;
//   description?: string;
//   thumbnail?: string;
//   price?: number;
// }

// export function Course() {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [modalContent, setModalContent] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 7;

//   const openModal = (content: string) => setModalContent(content);
//   const closeModal = () => setModalContent(null);

//   const getCourses = async () => {
//     await requestHandler(
//       async () => await getAllCourses(currentPage, limit),
//       setLoading,
//       (res) => {
//         setCourses(res.data || []);
//         setTotalPages(res.pagination?.totalPages || 1);
//       },
//       (errMsg) => toast.error(errMsg || "Failed to load courses")
//     );
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     getCourses();
//   }, [currentPage]);

//   const renderShimmerCards = () =>
//     Array.from({ length: 3 }).map((_, i) => (
//       <Card key={i} className="p-4 rounded-2xl border border-border">
//         <Skeleton className="h-48 w-full rounded-lg mb-4" />
//         <Skeleton className="h-5 w-3/4 mb-2" />
//         <Skeleton className="h-4 w-2/3 mb-1" />
//         <Skeleton className="h-4 w-1/2 mb-1" />
//         <div className="flex gap-3 mt-4">
//           <Skeleton className="h-10 w-24 rounded-lg" />
//           <Skeleton className="h-10 w-24 rounded-lg" />
//         </div>
//       </Card>
//     ));

//   const renderNoCoursesMessage = () => (
//     <div className="col-span-full text-center mt-10">
//       <p className="text-lg text-foreground/80 mb-2">
//         No courses available at the moment.
//       </p>
//       <p className="text-sm text-foreground/60">
//         Please check back later!
//       </p>
//     </div>
//   );

//   const renderCourses = () =>
//     courses.map((course) => (
//       <Card
//         key={course._id}
//         className="group rounded-2xl border border-border shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
//       >
//         <CardHeader className="p-0">
//           <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
//             <Image
//               src={course.thumbnail || "/assets/course-placeholder.png"}
//               alt={course.title}
//               fill
//               className="object-cover transition-transform duration-300 group-hover:scale-110"
//             />
//           </div>
//         </CardHeader>
//         <CardContent className="p-5">
//           <CardTitle className="text-lg font-semibold text-foreground/90 truncate">
//             {course.title}
//           </CardTitle>
//           <p className="text-sm text-foreground/60 mt-2 line-clamp-2">
//             {course.description || "No description available."}
//           </p>
//           <div className="flex items-center justify-between mt-5">
//             <span className="text-sm font-medium text-foreground/80">
//               ₹{course.price ?? "Free"}
//             </span>
//             <div className="flex gap-2">
//               <Button
//                 onClick={() => openModal(course.description || "")}
//                 variant="outline"
//                 className="text-sm"
//               >
//                 View Details
//               </Button>
//               <Button className="bg-vulcan-accent-blue text-white hover:bg-vulcan-accent-blue/90 text-sm">
//                 Enroll
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     ));

//   return (
//     <div className="min-h-screen bg-vulcan-white dark:bg-vulcan-deep-navy pt-24 pb-20 px-6 md:px-10">
//       {/* Header */}
//       <header className="text-center mb-10">
//         <h1 className="text-3xl font-semibold text-foreground/90 mb-2">
//           Explore Our Courses
//         </h1>
//         <p className="text-foreground/60 text-sm">
//           Find the best courses to start learning today.
//         </p>
//       </header>

//       {/* Course Grid */}
//       <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {loading
//           ? renderShimmerCards()
//           : courses.length === 0
//           ? renderNoCoursesMessage()
//           : renderCourses()}
//       </section>

//       {/* Pagination */}
//       {courses.length > 7 && (
//         <div className="flex justify-center mt-10 gap-3">
//           <Button
//             variant="outline"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           >
//             Previous
//           </Button>
//           <span className="px-4 py-2 text-sm text-foreground/70">
//             Page {currentPage} of {totalPages}
//           </span>
//           <Button
//             variant="outline"
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//           >
//             Next
//           </Button>
//         </div>
//       )}

//       {/* Modal */}
//       {modalContent && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//           <div className="bg-white dark:bg-vulcan-surface rounded-2xl shadow-lg w-[90%] max-w-lg p-6 relative">
//             <button
//               onClick={closeModal}
//               className="absolute top-3 right-3 text-foreground/70 hover:text-foreground"
//             >
//               ✕
//             </button>
//             <div
//               className="text-sm text-foreground/80 leading-relaxed"
//               dangerouslySetInnerHTML={{ __html: modalContent }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
