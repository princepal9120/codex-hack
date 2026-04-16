import DashboardNav from "@/platform/navigation/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen px-4 py-4 lg:px-6 lg:py-6">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row">
        <DashboardNav />
        <main className="surface-soft min-h-[calc(100vh-3rem)] flex-1 rounded-[2rem] p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
