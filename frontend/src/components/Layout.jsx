import Sidebar from './Sidebar';

export default function Layout({ children, title }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-8 page-enter">
          {title && (
            <h1 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Syne' }}>
              {title}
            </h1>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
