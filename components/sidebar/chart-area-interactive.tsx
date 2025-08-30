"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive area chart"

const dummyEnrollmentData = [
  { date: "2023-01-01", enrollments: 310 },
  { date: "2023-01-02", enrollments: 192 },
  { date: "2023-01-03", enrollments: 356 },
  { date: "2023-01-04", enrollments: 248 },
  { date: "2023-01-05", enrollments: 361 },
  { date: "2023-01-06", enrollments: 497 },
  { date: "2023-01-07", enrollments: 265 },
  { date: "2023-01-08", enrollments: 474 },
  { date: "2023-01-09", enrollments: 127 },
  { date: "2023-01-10", enrollments: 341 },
  { date: "2023-01-11", enrollments: 267 },
  { date: "2023-01-12", enrollments: 136 },
  { date: "2023-01-13", enrollments: 397 },
  { date: "2023-01-14", enrollments: 218 },
  { date: "2023-01-15", enrollments: 495 },
  { date: "2023-01-16", enrollments: 462 },
  { date: "2023-01-17", enrollments: 80 },
  { date: "2023-01-18", enrollments: 389 },
  { date: "2023-01-19", enrollments: 291 },
  { date: "2023-01-20", enrollments: 404 },
  { date: "2023-01-21", enrollments: 235 },
  { date: "2023-01-22", enrollments: 108 },
  { date: "2023-01-23", enrollments: 221 },
  { date: "2023-01-24", enrollments: 315 },
  { date: "2023-01-25", enrollments: 472 },
  { date: "2023-01-26", enrollments: 329 },
  { date: "2023-01-27", enrollments: 451 },
  { date: "2023-01-28", enrollments: 199 },
  { date: "2023-01-29", enrollments: 368 },
  { date: "2023-01-30", enrollments: 146 }
];
const chartConfig={
  enrollments: {
    label: "Enrollments",
    color: "var(--primary)",
  }
}satisfies ChartConfig


interface ChartAreaInteractiveProps{
  data:{
    date: string
    enrollments: number
  }[]
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const totalEnrollmentsNumber=React.useMemo(
    ()=> data.reduce((acc, curr) => acc + curr.enrollments, 0),
    [data]
  )
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollment</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Total Enrollments for the last 30 days: {totalEnrollmentsNumber}</span>
          <span className="@[540px]/card:hidden">Last 30 days :{totalEnrollmentsNumber} </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6" >
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart margin={{ right: 12, left: 12}} data={data}>
            <CartesianGrid vertical={false} />
            <XAxis 
              dataKey={"date"} 
              tickLine={false} 
              axisLine={false} 
              tickMargin={8} 
              interval={"preserveStartEnd"}  
              tickFormatter={(value) =>{ 
                const date = new Date(value);
                return date.toLocaleString("en-US", { 
                  month: "short", 
                  day: "numeric" 
                })
              }}
              />

              <ChartTooltip content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) =>{
                    const date = new Date(value);
                    return date.toLocaleString("en-US", { 
                      month: "short", 
                      day: "numeric" 
                    })
                  }}
                />
              }/>
              <Bar dataKey="enrollments" fill="var(--color-enrollments)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
