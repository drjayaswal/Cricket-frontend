export function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full opacity-30 animate-ping"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 font-bold">
          Loading
        </div>
      </div>
    </div>
  );
}
