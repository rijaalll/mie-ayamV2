export default function EmptyModal({ children, setIsOpen }) {

    return (
        <div className="fixed top-0 left-0 w-full h-[100dvh] flex justify-center items-center bg-zinc-200/20 backdrop-blur-sm z-[51]">
            <button className="fixed top-5 right-5 w-auto h-auto" onClick={() => setIsOpen(false)} type="button">
                <span className="bi bi-x-lg text-xl"></span>
            </button>
            {children}
        </div>
    );
}