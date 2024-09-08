import SectionOne from "./components/landingPage/SectionOne";
import "../app/components/landingPage/landingpage.css";
import SectionTwo from "./components/landingPage/SectionTwo";
import SectionThree from "./components/landingPage/SectionThree";

export default function Home() {
  return (
    <>
      <SectionOne />
      <SectionTwo />
      <SectionThree />
    </>
  );
}
