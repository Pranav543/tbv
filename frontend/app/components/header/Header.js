/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { Concert_One } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const concert_One = Concert_One({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});
export default function Header() {
  const { address, isConnected } = useAccount();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`js-page-header fixed top-0 z-20 w-full bg-white transition-colors ${
          scrolled ? "js-page-header--is-sticky" : ""
        }`}
      >
        <div className="flex items-center px-1 py-2 xl:px-4 border-b border-[#dcdee0] shadow-lg">
          <Link href="/" className="shrink-0">
            <div className="flex items-center">
              <Image
                width={35}
                height={35}
                src="/handshake.png"
                className="logoImage "
                alt=""
              />{" "}
              <span className="logoText md:text-1rem ld:text-[1.2rem]">
                Handshake
              </span>
            </div>
          </Link>

          {/* Menu / Actions */}
          <div className="inset-0 z-10 ml-auto rtl:mr-auto rtl:ml-0 items-center bg-white opacity-0 dark:bg-jacarta-800 relative inset-auto flex bg-transparent opacity-100 dark:lg:bg-transparent ">
            <nav className="navbar w-full">
              <ul className="flex  flex-row">
                <Nav />
              </ul>
            </nav>

            <div className=" flex xl:ml-7">
              <div className="w-max">
                <ConnectButton
                  showBalance={{
                    smallScreen: false,
                    largeScreen: true,
                  }}
                  accountStatus={{
                    smallScreen: "avatar",
                    largeScreen: "full",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
