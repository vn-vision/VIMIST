import {
  MdDashboard,
  MdOutlineInventory,
  MdPayments,
  MdSettings,
} from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { BiSolidPurchaseTag, BiLogOut, BiLogIn } from "react-icons/bi";
import { TbReportSearch } from "react-icons/tb";
import logo from "../assets/images/logo.jpg";
import { Link } from "react-router-dom";
import { useLogout } from "../features/authentication/authHook";
import { useNavigate } from "react-router-dom";

interface SideNavbarProps {
  collapsed: boolean;
  toggleNavbar: () => void;
}

const SideNavbar = ({ collapsed, toggleNavbar }: SideNavbarProps) => {
  const navigate = useNavigate();
  // check login status
  const myToken = sessionStorage.getItem('accessToken');
  const { logout} = useLogout();

  return (
    <div
      className={`vn-fixed vn-top-0 vn-left-0 vn-flex vn-flex-col vn-min-h-screen vn-justify-between vn-border-2 vn-border-indigo-600 vn-overflow-hidden ${
        collapsed ? "vn-w-[10%]" : "vn-w-[2%]"
      }`}
    >
      <div className="vn-flex vn-flex-col vn-gap-5">
        <div className="vn-flex vn-mt-5 vn-gap-5">
          <img
            src={logo}
            alt="logo"
            className="vn-w-10 vn-h-10 vn-rounded-[50%]"
          />
          <h1>VIMIST</h1>
        </div>
        <p
          className={`${collapsed ? "vn-ml-5" : "vn-m-0"}`}
          onClick={toggleNavbar}
        >
          {collapsed ? "<<<<" : ">>"}
        </p>
        <ul className="vn-m-auto vn-flex vn-flex-col vn-justify-evenly vn-gap-3">
          <li>
            <Link className="vn-flex vn-gap-3" to="/">
              <MdDashboard /> Dashboard
            </Link>
          </li>
          <li>
            <Link className="vn-flex vn-gap-3" to="/inventory">
              <MdOutlineInventory /> Inventory
            </Link>
          </li>
          <li>
            <Link className="vn-flex vn-gap-3" to="/sales">
              <FcSalesPerformance /> Sales
            </Link>
          </li>
          <li>
            <Link className="vn-flex vn-gap-3" to="/purchases">
              <BiSolidPurchaseTag /> Purchases
            </Link>
          </li>
          <li>
            <Link className="vn-flex vn-gap-3" to="/payments">
              <MdPayments /> Payments
            </Link>
          </li>
          <li>
            <Link className="vn-flex vn-gap-3" to="/reports">
              <TbReportSearch /> Reports
            </Link>
          </li>
          <li>
            <Link className="vn-flex vn-gap-3" to="/settings">
              <MdSettings /> Settings
            </Link>
          </li>
        </ul>
      </div>
      <div className="vn-flex vn-flex-col vn-gap-5">
      <button
        className="vn-flex vn-gap-3 vn-mx-auto"
        onClick={() => {
          if (myToken) {
            logout();
          } else {
            navigate("/login");
          }
        }
        }
      >
        {myToken ?  <BiLogOut /> : <BiLogIn />}
        {myToken ? "Logout" : "Login"}

      </button>
      </div>
    </div>
  );
};

export default SideNavbar;
