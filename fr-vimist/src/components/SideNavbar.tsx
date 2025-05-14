import {
  MdDashboard,
  MdOutlineInventory,
  MdPayments,
  MdSettings,
  MdHome,
  MdShoppingBag,
} from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { BiSolidPurchaseTag, BiLogOut, BiLogIn } from "react-icons/bi";
import { TbReportSearch } from "react-icons/tb";
import logo from "../assets/images/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../features/authentication/authHook";
import { useFetchSettings } from "../features/settings/settingsHook";
import { useEffect } from "react";
interface SideNavbarProps {
  collapsed: boolean;
  toggleNavbar: () => void;
}

const SideNavbar = ({ collapsed, toggleNavbar }: SideNavbarProps) => {
  const navigate = useNavigate();
  const myToken = sessionStorage.getItem("accessToken");
  const myRole = sessionStorage.getItem("role");
  const { logout } = useLogout();

  const { data: confData } = useFetchSettings();
  
  useEffect(() =>{
    if (confData){

      document.documentElement.style.setProperty('--primary-color', confData[0]?.primary_color, 'important');
      document.documentElement.style.setProperty('--secondary-color', confData[0]?.secondary_color, 'important');
      document.title = confData[0]?.system_name;
    }
  }, [confData]);

  return (
    <>
      {/* 📱 Mobile Navbar - Visible Only on Small Screens */}
      <div className="md:vn-hidden vn-fixed vn-top-0 vn-left-0 vn-w-full vn-bg-white vn-shadow-md vn-border-b vn-border-indigo-600">
        <div className="vn-flex vn-gap-2 vn-max-w-[100%] vn-justify-evenly vn-items-center">
          <div className="vn-flex vn-flex-col vn-items-center vn-justify-between vn-px-2 vn-py-2 vn-w-[10%]">
            <img
              src={confData.length > 0 ? confData[0]?.logo : logo}
              alt="logo"
              className="vn-w-10 vn-h-10 vn-rounded-full"
            />
            <h1 className="vn-text-lg vn-font-bold">{confData ? confData[0]?.system_name : "App Not Configured"}</h1>
          </div>
          <div className="vn-flex vn-justify-between vn-w-[80%]">
            {/* Scrollable Navbar Items */}
            <div className="vn-overflow-x-auto vn-whitespace-nowrap vn-py-2 vn-w-[80%]">
              <ul>
                {myToken && myRole === "Admin" && (
                <span className="vn-flex vn-gap-4">
                <NavItem to="/dashboard" icon={<MdDashboard />} label="Dashboard" />
                <NavItem
                  to="/inventory"
                  icon={<MdOutlineInventory />}
                  label="Inventory"
                />
                <NavItem
                  to="/sales"
                  icon={<FcSalesPerformance />}
                  label="Sales"
                />
                <NavItem
                  to="/purchases"
                  icon={<BiSolidPurchaseTag />}
                  label="Purchases"
                />
                <NavItem
                  to="/payments"
                  icon={<MdPayments />}
                  label="Payments"
                />
                <NavItem
                  to="/reports"
                  icon={<TbReportSearch />}
                  label="Reports"
                />
                <NavItem
                  to="/settings"
                  icon={<MdSettings />}
                  label="Settings"
                />
                </span>
                )}
                { (!myToken || myRole == 'Customer') &&(
                <span className="vn-flex vn-gap-2 vn-items-center">
                <NavItem to="/" icon={<MdHome />} label="Home" />
                <NavItem
                  to="/catalogue"
                  icon={<MdShoppingBag />}
                  label="Catalogue"
                />
                </span>
                )}
              </ul>
            </div>
            {/* Login/Logout Button */}
            <div className="vn-flex vn-w-[10%] vn-items-center vn-justify-center">
              <button
                className="vn-flex vn-items-center vn-border vn-rounded-lg vn-bg-gray-200 hover:vn-bg-gray-300 vn-px-2 vn-h-10"
                onClick={() => (myToken ? logout() : navigate("/login"))}
              >
                {myToken ? <BiLogOut /> : <BiLogIn />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🖥 Desktop Sidebar - Visible Only on Large Screens */}
      <div
        className={`vn-hidden md:vn-block vn-fixed vn-top-0 vn-left-0 vn-border-r vn-border-indigo-600 vn-overflow-hidden vn-transition-all vn-duration-300 
          ${
            collapsed ? "vn-w-[60px] vn-h-screen" : "vn-w-[200px] vn-h-screen"
          }`}
      >
        {/* Logo & Toggle */}
        <div className="vn-flex vn-flex-col vn-items-center vn-pt-6">
          <img
            src={confData.length > 0 ? confData[0]?.logo : logo}
            alt="logo"
            className="vn-w-10 vn-h-10 vn-rounded-full"
          />
          <h1
            className={`${
              collapsed ? "vn-hidden" : "vn-block"
            } vn-text-lg vn-font-bold`}
          >
            {confData ? confData[0]?.system_name : "App Not Configured"}
          </h1>
          <button
            onClick={toggleNavbar}
            className="vn-text-xl vn-cursor-pointer vn-mt-4"
          >
            {collapsed ? ">>>>" : "✖"}
          </button>
        </div>

        {/* Navigation */}
        <ul className="vn-flex vn-flex-col vn-gap-3 vn-mt-4">
          {/* Admin Navbar */}
          {myToken && myRole === "Admin" && (
          <span>
            <NavItem
              to="/dashboard"
              icon={<MdDashboard />}
              label="Dashboard"
              collapsed={collapsed}
            />
            <NavItem
              to="/inventory"
              icon={<MdOutlineInventory />}
              label="Inventory"
              collapsed={collapsed}
            />
            <NavItem
              to="/sales"
              icon={<FcSalesPerformance />}
              label="Sales"
              collapsed={collapsed}
            />
            <NavItem
              to="/purchases"
              icon={<BiSolidPurchaseTag />}
              label="Purchases"
              collapsed={collapsed}
            />
            <NavItem
              to="/payments"
              icon={<MdPayments />}
              label="Payments"
              collapsed={collapsed}
            />
            <NavItem
              to="/reports"
              icon={<TbReportSearch />}
              label="Reports"
              collapsed={collapsed}
            />
            <NavItem
              to="/settings"
              icon={<MdSettings />}
              label="Settings"
              collapsed={collapsed}
            />
          </span>
          )}
          {(!myToken || myRole == 'Customer') && (
          <span>
            <NavItem
              to="/"
              icon={<MdHome />}
              label="Home"
              collapsed={collapsed}
            />
            <NavItem
              to="/catalogue"
              icon={<MdShoppingBag />}
              label="Catalogue"
              collapsed={collapsed}
            />
          </span>
          )}
        </ul>

        {/* Login/Logout Button */}
        <div className="vn-absolute vn-bottom-5 vn-w-full vn-text-center">
          <button
            className="vn-flex vn-items-center vn-gap-2 vn-mx-auto vn-px-3 vn-py-1 vn-border vn-rounded-lg vn-bg-gray-200 hover:vn-bg-gray-300"
            onClick={() => (myToken ? logout() : navigate("/login"))}
          >
            {myToken ? <BiLogOut /> : <BiLogIn />}
            {!collapsed && (myToken ? "Logout" : "Login")}
          </button>
        </div>
      </div>
    </>
  );
};

// Reusable NavItem component
const NavItem = ({
  to,
  icon,
  label,
  collapsed,
}: {
  to: string;
  icon: JSX.Element;
  label: string;
  collapsed?: boolean;
}) => (
  <li>
    <Link
      to={to}
      className="vn-flex vn-items-center vn-gap-3 vn-px-4 vn-py-2 hover:vn-bg-indigo-200 vn-rounded-md vn-transition-all vn-duration-300"
    >
      {icon}
      {collapsed === undefined || !collapsed ? <span>{label}</span> : null}
    </Link>
  </li>
);

export default SideNavbar;
