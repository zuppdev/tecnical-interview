"use client";

import { usePathname, useRouter } from "next/navigation";
import { Navbar01 } from "@/components/ui/navbar";
import { ClipboardList } from "lucide-react";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
  onCtaClick?: () => void;
}

export function AppLayout({ children, onCtaClick }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navigationLinks = [
    { href: "/dashboard", label: "Dashboard", active: pathname === "/dashboard" },
    { href: "/tasks", label: "Tasks", active: pathname === "/tasks" },
  ];

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar01
        logo={<ClipboardList className="h-6 w-6" />}
        navigationLinks={navigationLinks.map((link) => ({
          ...link,
          onClick: () => handleNavClick(link.href),
        }))}
        signInText="Sign In"
        ctaText="Add Task"
        onCtaClick={onCtaClick}
      />
      {children}
    </div>
  );
}
