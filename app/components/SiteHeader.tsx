import React from "react";
import SoundToggle from "@/app/components/SoundToggle";
import ThemeToggle from "@/app/components/ThemeToggle";
import "./SiteHeader.scss";

/**
 * The site's two settings, in the top-right corner of every page: sound and
 * color theme.
 */
function SiteHeader() {
  return (
    <header className="site-header">
      <SoundToggle />
      <ThemeToggle />
    </header>
  );
}

export default SiteHeader;
