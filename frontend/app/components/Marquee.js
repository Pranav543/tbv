import React from "react";
import { styled } from "@mui/material/styles";
import infoImg from "../../public/info.png";
import Image from "next/image";
const MarqueeContainer = styled("div")({
  width: "100%",
  overflow: "hidden",
  backgroundColor: "black",
  color: "white",
  whiteSpace: "nowrap",
  marginTop: "80px",
});

const MarqueeText = styled("div")({
  display: "inline-block",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: "10px 20px",
  //   paddingLeft: "100%",

  margin: "0 auto",
});

const Marquee = ({ message }) => (
  <MarqueeContainer>
    <MarqueeText>
      <Image
        src="/image.png"
        width={24}
        height={24}
        alt="Picture of the author"
        style={{ marginRight: "10px" }}
      />
      This is a testnet site and if you want to initiate a tx on mainnet then go
      to
      <a
        href="https://handshake-mainnet.vercel.app/dashboard"
        style={{ textDecoration: "underline", marginLeft: "10px" }}
      >
        Handshake Mainnet Site
      </a>
    </MarqueeText>
  </MarqueeContainer>
);

export default Marquee;
