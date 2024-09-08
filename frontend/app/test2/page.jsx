import Head from "next/head";
import React from "react";
import ExpandableList from "./ExpandableList";

function page() {
  return (
    <div>
      <Head>
        <title>Expandable List</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Expandable List</h1>
        <ExpandableList />
      </main>
    </div>
  );
}

export default page;
