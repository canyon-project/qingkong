import BottomNav from '../components/BottomNav';
import AuthGuard from '../components/AuthGuard';

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      {children}
      <BottomNav />
    </AuthGuard>
  );
}
