import { ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Navbar() {
  return (
    <Card className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-8">
      <div className="container flex h-16 items-center px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Task Management
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Organize and track your tasks
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
