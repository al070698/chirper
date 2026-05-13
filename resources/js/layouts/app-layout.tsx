import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
    <div className="flex min-h-screen flex-col">
        <main className="flex-1">
            {children}
        </main>

        <footer className="border-t border-sidebar-border/70 px-6 py-4 text-center text-sm text-muted-foreground">
            © 2026 Rafael Gilberto Hernández Jiménez
        </footer>
    </div>
        </AppLayoutTemplate>
    );
}
