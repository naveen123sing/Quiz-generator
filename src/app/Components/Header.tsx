import { SparklesIcon } from '../Components/Icon';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: '#4F46E5' }}>
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-medium text-gray-900">AI Quiz Generator</h1>
          </div>
          
          {/* <nav className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              About
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Help
            </a>
          </nav> */}
        </div>
      </div>
    </header>
  );
}