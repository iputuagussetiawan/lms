import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Github } from "lucide-react";
import React from "react";

const LoginPage = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Welcome back!</CardTitle>
                <CardDescription>Login with your Github Email Account</CardDescription>
            </CardHeader>
            <CardContent>
                <Button 
                    className="w-full"
                    variant={"outline"}
                >
                    <Github className="h-4 w-4" />
                    Sign in with Github
                </Button>
            </CardContent>
        </Card>
    );
};

export default LoginPage;
