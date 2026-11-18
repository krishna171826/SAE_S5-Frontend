export default function PageLayout({ children }) {

    return (
        <div className="relative h-screen bg-[url(/background-image.jpg)] bg-cover bg-center">
            {/* calque sombre pour assombrir le fond */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* div pour le logo */}
            <div className="absolute z-10 top-4 left-4 flex items-center gap-2 bg-gray-100 rounded-full pl-2 pr-4 py-1 shadow-md">
                <img src="/logo.png" alt="Logo RecSpot" className="h-9 w-auto" />
                <span className="text-xl font-extrabold text-emerald-900">RecSpot</span>
            </div>
            <div className="relative z-10 h-full">
                {children}
            </div>

        </div>

    )
}