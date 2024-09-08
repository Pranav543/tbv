// pages/api/storeTransaction.js
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    senderAddress,
    receiverAddress,
    amount,
    tokenAddress,
    senderSignature,
    receiverSignature,
    status,
    tokenName,
    initiateDate,
    approveDate,
    transectionDate,
    decimals,
    nonce,
  } = await req.json();

  // Connect to MongoDB

  const client = await MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URI);
  const db = client.db();
  const collection = db.collection("transactions");

  try {
    // Find the document with the highest TransactionId
    const lastTransaction = await collection.findOne(
      {},
      { sort: { TransactionId: -1 } }
    );

    // Generate a new TransactionId value by incrementing the last one
    const TransactionId = lastTransaction
      ? lastTransaction.TransactionId + 1
      : 1;

    // Insert the new document with the auto-incremented TransactionId
    await collection.insertOne({
      TransactionId,
      senderAddress,
      receiverAddress,
      amount,
      tokenAddress,
      senderSignature,
      receiverSignature,
      status,
      tokenName,
      initiateDate,
      approveDate,
      transectionDate,
      decimals,
      nonce,
    });

    return NextResponse.json(
      { message: "Transaction stored successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error storing transaction", error },
      { status: 500 }
    );
  } finally {
    // Close the MongoDB connection
    client.close();
  }
}

export async function PUT(req) {
  const {
    TransactionId, // This should be passed in the request to identify the transaction to update
    receiverSignature,
    status,
    approveDate,
  } = await req.json();

  // Connect to MongoDB
  const client = await MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URI);
  const db = client.db();
  const collection = db.collection("transactions");

  try {
    // Find the transaction by TransactionId and update it
    const updateResult = await collection.updateOne(
      { TransactionId }, // Filter by TransactionId
      {
        $set: {
          receiverSignature,
          status,
          approveDate,
        },
      }
    );

    // Check if the transaction was successfully updated
    if (updateResult.modifiedCount === 0) {
      return new NextResponse(
        JSON.stringify({
          message:
            "No transaction found with the given ID or no changes were made.",
        }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Transaction updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error updating transaction",
        error: error.message,
      }),
      { status: 500 }
    );
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}
