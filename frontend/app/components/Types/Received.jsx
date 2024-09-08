import React from "react";
import Blockies from "react-blockies";
import AddressWithCopy from "../../quickaccess/AddressWithCopy";
import { useRouter } from "next/navigation";
import { formatUnits } from "viem";
import TransactionAccordion from "../test/TransactionAccordion";

function Received({ transactions, address, activeTab }) {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f4f4" }}>
      <main>
        <TransactionAccordion transactions={transactions} />
      </main>
    </div>
  );
}

export default Received;
