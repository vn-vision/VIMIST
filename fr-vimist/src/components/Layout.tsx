import { ReactNode, useState } from "react";
import SideNavbar from "./SideNavbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="vn-flex vn-h-screen">
      {/* Sidebar */}
      <SideNavbar collapsed={collapsed} toggleNavbar={toggleNavbar} />

      {/* Main Content */}
      <div
        className={`vn-flex vn-flex-col vn-w-full vn-min-h-screen vn-my-[20%] md:vn-my-[0%] vn-transition-all vn-duration-300 ${
          collapsed ? "md:vn-ml-[60px] " : "md:vn-ml-[200px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
