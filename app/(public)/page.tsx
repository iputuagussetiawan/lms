import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ChartBar, Gamepad2, GroupIcon } from "lucide-react";
import Link from "next/link";

interface featureProps{
    title:string,
    description:string,
    icon:React.ReactNode
}

const features:featureProps[]= [
    {
        title:"Comprehensive Course",
        description:"Access a vast collection of courses, covering a wide range of topics and levels of expertise.",
        icon:<BookOpen/>
    },
    {
        title:"Interactive Learning",
        description:"Engage in interactive learning experiences, including quizzes, assignments, and interactive sessions.",
        icon:<Gamepad2/>
    },
    {
        title:"Progress Tracking",
        description:"Monitor your progress and track your learning journey, ensuring you stay motivated and on track with your goals.",
        icon:<ChartBar/>
    },
    {
        title:"Community Support",
        description:"Connect with a vibrant community of learners, share knowledge, and receive support from fellow learners.",
        icon:<GroupIcon/>
    }
]



export default function Home() {
    return (
        <>
            <section className="relative py-20">
                <div className="flex flex-col items-center text-center space-y-8">
                    <Badge variant={"outline"}>The best way to learn.</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Elevate your Learning Experience
                    </h1>
                    <p className="max-wh-[700px] text-muted-foreground md:text-xl">
                        Discover a new why to learn with our modern, interactive Learning Management System. Access hight-quality courses anytime, anywhere, on any device. Join our vibrant community of learners and unlock a world of knowledge. Start your learning journey today!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link className={buttonVariants({ size: "lg" })} href="/courses">Explore Courses</Link>
                        <Link className={buttonVariants({ size: "lg", variant: "outline" })} href="/login">Sign in</Link>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-42">
                {features.map((feature, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="text-4xl mb-4">
                                {feature.icon}
                            </div>
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground">
                                {feature.description}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </>
    );
}
