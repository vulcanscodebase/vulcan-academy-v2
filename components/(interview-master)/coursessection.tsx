"use client";

import { useEffect, useState } from "react";
import { getAllCourses } from "../api/coursesApi";
import { requestHandler } from "@/utils/auth";
import { Shimmer } from "./shimmer";
import { CourseCardPublic } from "./coursescardpublic";
import { Pagination } from "./pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function CourseSection() {
  const [courses, setCourses] = useState<any[]>([]);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 7;

  // open & close modal
  const openModal = (content: string) => setModalContent(content);
  const closeModal = () => setModalContent(null);

  // fetch all courses
  const getCourses = async () => {
    await requestHandler(
      async () => await getAllCourses(currentPage, limit),
      setLoading,
      (res: any) => {
        // same logic as old one
        setCourses(res.data);
        setTotalPages(res.pagination.totalPages);
      },
      (errMsg: string) => {
        console.error(errMsg);
      }
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getCourses();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // shimmer loading
  const renderShimmerCards = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="rounded-xl border border-border shadow-sm bg-card p-4 space-y-3"
      >
        <Shimmer type="image" width="100%" height="200px" />
        <Shimmer type="text" width="90%" height="20px" />
        <Shimmer type="text" width="100%" height="16px" />
        <Shimmer type="text" width="100%" height="16px" />
        <Shimmer type="text" width="80%" height="16px" />
        <div className="flex justify-between gap-3 mt-3">
          <Shimmer type="button" borderRadius="8px" height="45px" />
          <Shimmer type="button" borderRadius="8px" height="45px" />
        </div>
      </div>
    ));
  };

  // no courses message
  const renderNoCoursesMessage = () => (
    <div className="w-full text-center text-muted-foreground py-10">
      <p>No courses available at the moment. Please check back later!</p>
    </div>
  );

  // render courses
  const renderCourses = () => {
    if (!courses || courses.length === 0) {
      return renderNoCoursesMessage();
    }

    return courses.map((course: any) => (
      <CourseCardPublic key={course._id} course={course} openModal={openModal} />
    ));
  };

  return (
    <section className="w-full min-h-screen px-6 md:px-12 py-30">
      {/* Header */}
      <header className="">
        <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground text-balance">
         Interview Master
        </h1>
      </header>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? renderShimmerCards() : renderCourses()}
      </div>

      {/* Pagination */}
      {courses.length > 7 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modal */}
      <Dialog open={!!modalContent} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
          </DialogHeader>
          <div
            className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: modalContent || "" }}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
