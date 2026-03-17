export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-forest-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🌉</span>
            </div>
            <span className="font-display font-bold text-lg text-white">Food<span className="text-primary-400">Bridge</span></span>
          </div>
          <p className="text-sm text-center">Bridging the gap between food surplus and food insecurity.</p>
          <p className="text-xs">© {new Date().getFullYear()} XEEL Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}