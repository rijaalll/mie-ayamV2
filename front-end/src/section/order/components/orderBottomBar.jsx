import { Home, Clock, Menu, ShoppingCart } from "lucide-react";

export default function BottomNav({ activeView, setActiveView, cart }) {
    return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden z-40">
      <div className="flex">
        <button
          onClick={() => setActiveView("menu")}
          className={`flex-1 p-4 text-center ${activeView === "menu" ? "text-blue-600 bg-blue-50" : "text-gray-600"}`}
        >
          <Home size={20} className="mx-auto mb-1" />
          <span className="text-xs">Menu</span>
        </button>
        <button
          onClick={() => setActiveView("pesanan")}
          className={`flex-1 p-4 text-center ${activeView === "pesanan" ? "text-green-600 bg-green-50" : "text-gray-600"}`}
        >
          <Clock size={20} className="mx-auto mb-1" />
          <span className="text-xs">Pesanan</span>
        </button>
        <button
          onClick={() => setActiveView("keranjang")}
          className={`flex-1 p-4 text-center relative ${activeView === "keranjang" ? "text-orange-600 bg-orange-50" : "text-gray-600"}`}
        >
          <ShoppingCart size={20} className="mx-auto mb-1" />
          {cart.length > 0 && (
            <span className="absolute top-2 right-1/2 transform translate-x-2 -translate-y-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
          <span className="text-xs">Keranjang</span>
        </button>
      </div>
    </div>
  );
}