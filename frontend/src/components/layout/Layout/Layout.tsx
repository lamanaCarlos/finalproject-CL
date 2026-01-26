import type { ReactNode } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';

export interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const Layout = ({
  children,
  showHeader = true,
  showFooter = true,
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showHeader && <Header />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};
