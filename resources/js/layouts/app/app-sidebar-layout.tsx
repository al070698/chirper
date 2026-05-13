import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent
                variant="sidebar"
                className="flex min-h-screen flex-col overflow-x-hidden"
            >
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <main className="flex-1">{children}</main>
                <footer className="border-t border-sidebar-border/70 px-4 py-4 text-center text-sm text-muted-foreground md:px-6">
                    © 2026 Rafael Gilberto Hernández Jiménez — Chirper
                </footer>
            </AppContent>
        </AppShell>
    );
}
