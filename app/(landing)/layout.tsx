import MarketingNav from "@/platform/navigation/marketing-nav";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingNav />
      {children}
    </>
  );
}
