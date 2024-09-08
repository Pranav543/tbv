// components/ExpandableList.js
"use client";
import { useState } from "react";
// Adjust the import path as necessary

const ExpandableList = () => {
  const [expandedRow, setExpandedRow] = useState(null);

  const rows = [
    {
      number: 1,
      sender: "John Doe",
      amount: "$100",
      timeAgo: "2 hours ago",
      status: "Pending",
    },
    {
      number: 2,
      sender: "Jane Smith",
      amount: "$200",
      timeAgo: "1 day ago",
      status: "Completed",
    },
    {
      number: 3,
      sender: "Bob Johnson",
      amount: "$300",
      timeAgo: "3 days ago",
      status: "Failed",
    },
    // Add more rows as needed
  ];

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="container">
      {rows.map((row, index) => (
        <div key={index}>
          <div
            className={`row ${expandedRow === index ? "expanded" : ""}`}
            onClick={() => toggleRow(index)}
          >
            <div className="grid-container">
              <div className="grid-item">{row.number}</div>
              <div className="grid-item">{row.sender}</div>
              <div className="grid-item">{row.amount}</div>
              <div className="grid-item">{row.timeAgo}</div>
              <div className="grid-item">{row.status}</div>
              <div className="grid-item">
                <button>Action</button>
              </div>
            </div>

            {expandedRow === index && (
              <div className="detail">
                <strong>Details:</strong>
                <p>More information about {row.sender}'s transaction...</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpandableList;
