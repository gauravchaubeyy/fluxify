import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="flex justify-between items-center  mx-auto p-3 bg-red-700">
      <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
        <span className="text-black">fluxify</span>
      </h1>
      <form className="bg-slate-100 p-3 rounded-lg flex items-center ">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none w-24 sm:w-64 "
        />
      </form>

      <ul className="flex gap-4">
        <button className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-950 text-white hover:bg-white hover:text-black">
          W
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-950 text-black hover:bg-black hover:text-white">
          B
        </button>

        <Link to="/upload">
          <button className="w-8 h-8 aspect-square-full border-gray-950 flex items-center justify-center border text-black hover:bg-black hover:text-white font-bold text-2xl">
            +
          </button>
        </Link>
      </ul>
    </div>
  );
}
