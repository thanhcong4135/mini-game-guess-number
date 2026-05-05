import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function Layout({ children, title, subtitle }: LayoutProps) {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {(title || subtitle) && (
          <header className="mb-8">
            {title && <h1 className="text-3xl font-bold tracking-normal text-ink sm:text-4xl">{title}</h1>}
            {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </main>
  );
}
