import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface EmptyStateProps {
    title: string;
    description: string;
    buttonText: string;
    href: string;
}

export function EmptyState({title, description, buttonText,href}: EmptyStateProps) {
    return (
        <div className="flex flex-col flex-1 h-full items-center justify-center gap-4 rounded-md border border-dashed p-8 text-center animate-in fade-in-50 bg-muted/30">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Ban className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
                {title}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
                {description}
            </p>
            <Link href={href} className={buttonVariants({ size: "lg" })}>
                <PlusCircle className="w-4 h-4 mr-2" />
                {buttonText}
            </Link>
        </div>
    );
}
