import  { useState } from "react";
import { MdDashboard, MdOutlineInventory, MdPayments, MdSettings  } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { BiSolidPurchaseTag,  BiLogOut } from "react-icons/bi";
import { TbReportSearch } from "react-icons/tb";
import logo from "../assets/images/logo.jpg"

function SideNavbar() {
    const [collapsed, setCollapsed] = useState(false);
    const toggleNavbar = () => setCollapsed(!collapsed);
    
  return (
    <div className={`vn-flex vn-flex-col vn-max-w-[10%] vn-min-h-screen vn-justify-between vn-border-2 vn-border-indigo-600 vn-overflow-hidden ${collapsed ? "vn-w-[10%]" : "vn-w-[2%]"}`}>
      <div className="vn-flex vn-flex-col vn-gap-5">
        <div className="vn-flex vn-mt-5 vn-gap-5">
          <img src={logo} alt="logo" className="vn-w-10 vn-h-10 vn-rounded-[50%]" />
          <h1>VIMIST</h1>
        </div>
        <p className={`${collapsed ? "vn-ml-5" : "vn-m-0" }`} onClick={toggleNavbar}>{collapsed ? "<<<<" :">>"}</p>
        <ul className=" vn-m-auto vn-flex vn-flex-col vn-justify-evenly vn-gap-3">
          <li className=" vn-flex vn-gap-3 "> <MdDashboard /> Dashboard</li>
          <li className=" vn-flex vn-gap-3 "> <MdOutlineInventory /> Inventory</li>
          <li className=" vn-flex vn-gap-3 "> <FcSalesPerformance /> Sales</li>
          <li className=" vn-flex vn-gap-3 "> <BiSolidPurchaseTag /> Purchases</li>
          <li className=" vn-flex vn-gap-3 "> <MdPayments /> Payments</li>
          <li className=" vn-flex vn-gap-3 "> <TbReportSearch /> Reports</li>
          <li className=" vn-flex vn-gap-3 "> <MdSettings /> Settings</li>
        </ul>
      </div>
      <button className="vn-flex vn-gap-3 vn-mx-auto"><BiLogOut /> Logout</button>
    </div>
  );
}

export default SideNavbar;
