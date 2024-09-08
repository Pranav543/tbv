"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const isActiveParentMenu = (menus) => {
    return menus.some(
      (elm) => elm.href.split("/")[1] == pathname.split("/")[1]
    );
  };
  return (
    <>
      <li className="group  relative hidden md:block ">
        <Link
          href="/"
          className={`flex items-center justify-between py-3.5 font-display text-base  ${
            "/".split("/")[1] == pathname.split("/")[1]
              ? "text-accent "
              : "text-jacarta-700 "
          }  hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent lg:px-5 text-black`}
        >
          Home
        </Link>
      </li>
      <li className="group hidden md:block">
        <Link
          href="/dashboard"
          className={`flex items-center justify-between py-3.5 font-display text-base  ${
            "/create".split("/")[1] == pathname.split("/")[1]
              ? "text-accent "
              : "text-jacarta-700 "
          }  hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent lg:px-5 text-black`}
        >
          Dashboard
        </Link>
      </li>
    </>
  );
}
