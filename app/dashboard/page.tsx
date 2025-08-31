import { EmptyState } from "@/components/general/EmptyState";
import { getAllCourse } from "../data/course/get-all-course";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { PublicCourseCard } from "../(public)/_components/PublicCourseCard";
import { CourseProgressCard } from "./_components/CourseProgressCard";

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([getAllCourse(), getEnrolledCourses()]);
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">Here you can see all the courses you have enrolled</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No Courses Found"
          description="Enroll in a course to get started"
          buttonText="Enroll Now"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {enrolledCourses.map((course) => (
            <CourseProgressCard key={course.course.id} data={course} />
          ))}
        </div>
      )}
      <section className="mt-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">Here you can see all the courses you can purchase</p>
        </div>

        {courses.filter(
          (course)=>
          !enrolledCourses.some(
            ({course:enrolledCourse}) => enrolledCourse.id === course.id)
        ).length === 0 ? (
          <EmptyState
            title="No Courses Found"
            description="Create a course to get started"
            buttonText="Create Course"
            href="/admin/courses/create"
          />
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {courses.filter(
            (course)=>
                !enrolledCourses.some(
                  ({course:enrolledCourse}) => enrolledCourse.id === course.id)
              ).map((course) => (
                <PublicCourseCard key={course.id} data={course} />
              ))}
          </div>
        )}
      </section>
    </>
  );
}