"use client";

import { Sidebar } from "@/app/(dashboard)/workspace/[workspaceId]/sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="h-full bg-background overflow-hidden">
            <div className="h-full w-full bg-card flex overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col h-full bg-background">
                    <div className="flex-1 overflow-hidden">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
