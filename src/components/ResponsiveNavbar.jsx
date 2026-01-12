import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";

export default function ResponsiveNavbar(props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ MOBILE → ONLY MobileNavbar
  if (isMobile) {
    return <MobileNavbar />;
  }

  // ✅ DESKTOP → ONLY Navbar (unchanged)
  return <Navbar {...props} />;
}
