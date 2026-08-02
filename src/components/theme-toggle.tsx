import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem("launchloop-theme");
    const next = stored ? stored === "dark" : true;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("launchloop-theme", next ? "dark" : "light");
  };

  return (
    <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggle}>
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}