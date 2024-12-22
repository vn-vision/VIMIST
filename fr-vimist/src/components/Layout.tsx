import { ReactNode, useState } from "react";
import SideNavbar from "./SideNavbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="vn-flex vn-h-screen">
      {/* Sidebar */}
      <SideNavbar collapsed={collapsed} toggleNavbar={toggleNavbar} />

      {/* Main Content */}
      <div
        className={`vn-flex vn-flex-col vn-w-full vn-h-screen vn-pl-[${collapsed ? "10%" : "2%"}] vn-mt-0`}
        style={{ marginLeft: collapsed ? "10%" : "2%" }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
