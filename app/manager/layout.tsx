export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <main className="p-6">
          {children}
        </main>
      </div>
    </>
  )
}
