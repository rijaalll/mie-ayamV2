import { X, Home, Clock } from "lucide-react";

export default function Sidebar ({ isOpen, onClose, activeView, setActiveView, categories, activeCategory, setActiveCategory }) {
    return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between p-4 border-b lg:hidden">
        <h2 className="text-lg font-bold">Menu</h2>
        <button onClick={onClose} className="p-2">
          <X size={20} />
        </button>
      </div>
      
      <nav className="p-4 space-y-2">
        <button
          onClick={() => {setActiveView("menu"); setActiveCategory("semua"); onClose();}}
          className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
            activeView === "menu" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
          }`}
        >
          <Home size={20} />
          Semua Menu
        </button>
        
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => {setActiveView("menu"); setActiveCategory(category.name); onClose();}}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              activeView === "menu" && activeCategory === category.name ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            }`}
          >
            {category.name}
          </button>
        ))}
        
        <button
          onClick={() => {setActiveView("pesanan"); onClose();}}
          className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
            activeView === "pesanan" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
          }`}
        >
          <Clock size={20} />
          Pesanan Saya
        </button>
      </nav>
    </div>
    );
}
