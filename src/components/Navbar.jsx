import Logo from ".././assets/VOC.png";
import { NavLink } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import {
  Bars3BottomLeftIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FaTasks } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const logOut = () => {
    // Add logout logic here
    localStorage.removeItem("accessToken");
    navigate("/dowelleducation/workspace-login");
  }

  return (
    <nav className="md:py-3 py-2 px-5 border-b-gray-200 border">
      <div className=""></div>
      <div className="flex justify-between relative">
        <div className="flex items-center">
          {/* Mobile Menu Toggle Button */}
          <Bars3BottomLeftIcon
            className="w-9 flex md:hidden xl:hidden cursor-pointer text-deepblue"
            onClick={handleToggle}
          />

          {/* Logo */}
          <img
            src={Logo}
            alt="Dowell Logo"
            className="w-16 md:w-24 hidden md:block"
          />

          {/* Mobile Navbar */}
          <div
            className={`fixed top-0 left-0 h-screen w-60 bg-gray-100 transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } md:hidden`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
              <img
                src={Logo}
                alt="Dowell Logo"
                className="w-16 md:w-24 rounded-lg"
              />
              <XMarkIcon
                className="w-9 cursor-pointer text-deepblue"
                onClick={handleToggle}
              />
            </div>
            <ul className="flex flex-col py-6 px-5 space-y-5">

              <li>
                <NavLink
                  to="/dowelleducation/workspace-report"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-deepblue" : ""
                  }
                  onClick={handleToggle}
                >
                  Reports
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dowelleducation/workspace-userdetails"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-deepblue" : ""
                  }
                  onClick={handleToggle}
                >
                  User Details
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dowelleducation/workspace-scaledetails"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-deepblue" : ""
                  }
                  onClick={handleToggle}
                >
                  Scale Details
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Desktop Navbar */}
          <ul className="hidden md:flex items-center gap-8 ml-24 font-poppins text-[16px] font-normal">

            <li>
              <NavLink
                to="/dowelleducation/workspace-report"
                className={({ isActive }) =>
                  isActive ? "font-bold text-deepblue" : ""
                }
              >
                Reports
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dowelleducation/workspace-userdetails"
                className={({ isActive }) =>
                  isActive ? "font-bold text-deepblue" : ""
                }
              >
                User Details
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dowelleducation/workspace-scaledetails"
                className={({ isActive }) =>
                  isActive ? "font-bold text-deepblue" : ""
                }
              >
                Scale Details
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="my-auto">
          <UserCircleIcon
            className="w-9 text-black mr-3 cursor-pointer relative"
            onClick={handleProfile}
          />
          {profileOpen && (
            <>
              <div className="bg-white w-36 fixed top-11 md:top-20 right-0 flex justify-center mr-4 md:mr-10 rounded-md z-20 ">
                <div className="z-10">
                  <ul className="px-3">
                    <li className="flex items-center py-2 border-b">
                      <Cog6ToothIcon className="size-4" />
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm font-semibold text-black hover:text-green-800"
                      >
                        Settings
                      </a>
                    </li>
                    <li className="flex items-center py-2 border-b ">
                      <FaTasks className="size-4" />
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm font-semibold text-black hover:text-green-800"
                      >
                        Tasks
                      </a>
                    </li>
                    <li className="flex items-center py-2 border-b" onClick={logOut}>
                      <BiLogOut className="size-4.5" />
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm font-semibold text-black hover:text-green-800"
                      >
                      Log out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {profileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-1"
            onClick={handleProfile}
          ></div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
