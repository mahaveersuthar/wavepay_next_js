export default function CleanComingSoon() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="bg-white px-16 py-12 rounded-2xl shadow-sm border border-slate-200 text-center">
        
        {/* Subtle Decorative Icon */}
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
          <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
        </div>

        {/* Text */}
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Coming Soon
        </h1>
        
        <div className="mt-2 h-1 w-8 bg-indigo-500 mx-auto rounded-full" />
        
        <p className="mt-4 text-slate-500 text-sm font-medium">
          Something new is on the way.
        </p>
      </div>
    </div>
  );
}