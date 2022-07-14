import { Switch } from "@headlessui/react";
import { useTheme } from "next-themes";
import React, { useState } from "react";

export const ThemeToggler: React.FC = () => {
  const [toggle, setToggle] = useState(true);
  const { theme, setTheme } = useTheme();

  console.log(theme);

  return (
    <Switch.Group
      as={"div"}
      className="flex items-center justify-between rounded-md  hover:bg-foreground text-sm dark:hover:bg-darkTwo"
    >
      <Switch.Label className="cursor-pointer flex-grow p-2">
        Theme
      </Switch.Label>
      <Switch
        checked={toggle}
        onChange={setToggle}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className={`${
          theme === "dark" ? "bg-neutral-800" : "bg-neutral-300"
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span className="sr-only">Toggle Theme</span>
        <span
          className={`${
            theme === "dark"
              ? "translate-x-6 bg-background"
              : "translate-x-1 bg-foreground"
          } inline-block h-4 w-4 transform rounded-full`}
        />
      </Switch>
    </Switch.Group>
  );
};
