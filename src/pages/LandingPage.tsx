import Footer from "../components/Footer";
import FeaturedProducts from "../components/LandingPage/FeaturedProducts";
import Header from "../components/LandingPage/Header";
import StopPayingHighPrices from "../components/LandingPage/StopPayingHighPrices";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return <>
    <Navbar />
    <Header />
    <FeaturedProducts />
    <StopPayingHighPrices />
    <Footer />
  </>
}