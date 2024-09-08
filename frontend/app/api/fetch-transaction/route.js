// pages/api/queryTransactions.js
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const type = searchParams.get("type");

  const client = await MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URI);
  const db = client.db();
  const collection = db.collection("transactions");

  try {
    const query = {};
    if (type === "queue") {
      // query.senderAddress = address;
      query.$and = [
        { $or: [{ senderAddress: address }, { receiverAddress: address }] },
        { $or: [{ status: "inititated" }, { status: "approved" }] },
      ];
      // query.$or = [{ status: "inititated" }, { status: "approved" }];
    } else if (type === "received") {
      query.receiverAddress = address;
      query.$or = [{ status: "inititated" }, { status: "approved" }];
    } else if (type === "history") {
      console.log("history");
      console.log(address);
      query.$and = [
        { $or: [{ senderAddress: address }, { receiverAddress: address }] },
        { $or: [{ status: "completed" }, { status: "rejected" }] },
      ];
    } else {
      return NextResponse.json(
        { message: "Invalid type. Must be 'sender', 'receiver', or 'all'" },
        { status: 400 }
      );
    }

    const transactions = await collection.find(query).toArray();

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching transactions", error },
      { status: 500 }
    );
  } finally {
    client.close();
  }
}
