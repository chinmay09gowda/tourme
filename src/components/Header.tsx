export default function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 py-4">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <img src="/image.png" alt="TourMe Logo" className="h-16 w-16" />
        <h1 className="ml-4 text-3xl font-bold text-white">TourMe</h1>
      </div>
    </header>
  );
}
