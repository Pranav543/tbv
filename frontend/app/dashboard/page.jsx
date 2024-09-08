"use client";

// import Header from "../components/header/Header";
// import TransactionTypes from "../components/TransactionTypes";
import dynamic from "next/dynamic";
import Marquee from "../components/Marquee";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
});
const TransactionTypes = dynamic(
  () => import("../components/TransactionTypes"),
  {
    ssr: false,
  }
);

export default function Dashboard() {
  return (
    <div className="main-dashboard">
      <Header />
      <Marquee />
      <TransactionTypes />
    </div>
  );
}
