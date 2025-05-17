import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addAgents } from "../Redux/Slices/AgentSlice";
import { addTasks } from "../Redux/Slices/TaskSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);
  const url = window.location.href;
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(addAgents([]));
    dispatch(addTasks([]));
    navigate("/login");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [url]);

  return (
    <nav className=" fixed w-full text-white p-2 bg-[rgb(127,158,196)]">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-[rgb(127,158,196)]">
        {/* Logo */}
        <div className="cursor-pointer flex items-center h-[3.5rem] text-[1.5rem] font-bold">
          <span className="bg-[black] px-1 rounded-lg text-[white]">LO</span>{" "}
          <span className="">GO</span>
        </div>

        {token && (
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        )}

        {/* Links */}
        {token && (
          <div
            className={`md:flex items-center space-x-4 transition-all duration-300 ease-in-out ${
              isOpen
                ? "block absolute top-16 left-0 w-full bg-[rgb(127,158,196)] p-4"
                : "hidden"
            }`}
          >
            <Link
              to="/"
              className="block md:inline-block text-lg px-2  rounded text-primary py-2 md:hover:text-[white] md:hover:bg-[black] hover:text-[yellow] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/agents"
              className="block md:inline-block text-lg px-2 rounded text-primary py-2 md:hover:text-[white] md:hover:bg-[black] hover:text-[yellow] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Agents
            </Link>
            <Link
              to="/tasks"
              className="block md:inline-block text-lg px-2 rounded text-primary py-2 md:hover:text-[white] md:hover:bg-[black] hover:text-[yellow] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Tasks
            </Link>
            {token && (
              <button
                onClick={handleLogout}
                className="block md:inline-block text-lg px-2 rounded text-primary py-2 md:hover:text-[white] md:hover:bg-[black] hover:text-[yellow] transition-all duration-200"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
