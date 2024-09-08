// components/TimeAgoComponent.js
import React from "react";
import { timeAgo } from "../utils/formateDate";

const TimeAgoComponent = ({ timestamp }) => {
  return <div>{timeAgo(timestamp)}</div>;
};

export default TimeAgoComponent;
