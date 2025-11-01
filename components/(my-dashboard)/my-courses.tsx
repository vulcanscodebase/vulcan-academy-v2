"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { getPurchasedCoursesApi } from "../api/coursesApi";
import { requestHandler } from "@/utils/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Course {
  courseId: string;
  title: string;
  thumbnail?: string;
  description?: string;
  progress?: number;
}

export function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const getCourses = async () => {
    await requestHandler(
      async () => await getPurchasedCoursesApi(),
      setLoading,
      (res) => {
        setCourses(res.courses || []);
      },
      (errMsg) => toast.error(errMsg || "Failed to load courses")
    );
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="min-h-screen  dark:bg-vulcan-deep-navy pt-24 pb-16 px-6 md:px-10">
      {/* Header */}
      <header className="flex flex-col items-center mb-12">
        <h1 className="text-3xl font-semibold text-foreground/90 mb-2">
          My Courses
        </h1>
        <p className="text-foreground/60 text-sm">
          View all your purchased courses here.
        </p>
      </header>

      {/* Content */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-40 w-full rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))
          : courses.length === 0
          ? (
            <div className="col-span-full text-center mt-10">
              <p className="text-lg text-foreground/80 mb-2">
                Looks like you haven’t purchased a course yet!
              </p>
              <Link
                href="/interview"
                className="text-vulcan-accent-blue font-medium hover:underline"
              >
                View Courses
              </Link>
            </div>
          )
          : courses.map((course) => (
              <Card
                key={course.courseId}
                className="group border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl"
              >
                <CardHeader className="p-0">
                  <div className="relative w-full h-44 overflow-hidden rounded-t-2xl">
                    <Image
                      src={
                        course.thumbnail ||
                        "/assets/course-placeholder.png"
                      }
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </CardHeader>

                <CardContent className="p-5">
                  <CardTitle className="text-lg font-semibold text-foreground/90 truncate">
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-foreground/60 mt-2 line-clamp-2">
                    {course.description || "No description available."}
                  </p>

                  {course.progress !== undefined && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-foreground/70 mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-vulcan-accent-blue rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
      </section>
    </div>
  );
}
