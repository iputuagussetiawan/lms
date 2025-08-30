import {
  IconTrendingUp,
  IconUsers,
  IconBook2,
  IconFile,
  IconShoppingBagCheck,
} from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminGetDashboardStatus } from "@/app/data/admin/admin-get-dashboard-status";

export async function SectionCards() {
  const {totalCourse, totalLesson, totalCustomers, totalSignup} =await adminGetDashboardStatus();
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      {/* Total Users */}
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription className="flex items-center gap-2 text-muted-foreground">
              <IconUsers className="size-4" />
              Total User Sign Up
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              { totalSignup }
            </CardTitle>
          </div>
          <IconTrendingUp className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Registered users on this platform
          </p>
        </CardFooter>
      </Card>

      {/* Total Customers */}
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription className="flex items-center gap-2 text-muted-foreground">
              <IconShoppingBagCheck className="size-4" />
              Total Customers
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              { totalCustomers }
            </CardTitle>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Users who have enrolled courses</p>
        </CardFooter>
      </Card>

      {/* Total Courses */}
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription className="flex items-center gap-2 text-muted-foreground">
              <IconBook2 className="size-4" />
              Total Courses
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              { totalCourse }
            </CardTitle>
          </div>
          <IconTrendingUp className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Available Courses On The Platform
          </p>
        </CardFooter>
      </Card>

      {/* Total Lessons */}
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription className="flex items-center gap-2 text-muted-foreground">
              <IconFile className="size-4" />
              Total Lessons
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              { totalLesson }
            </CardTitle>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Total Learning Content Available
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
