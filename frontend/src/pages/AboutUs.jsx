import About from "../components/LandingPage/About";
import Navbar from "../components/Navbar";
import TopSection from "../components/LandingPage/TopSection";
import WhyDifferent from "../components/LandingPage/WhyDifferent";
import Pricing from "../components/LandingPage/Pricing";
import Newsletter from "../components/LandingPage/NewsLetter";
import Stats from "../components/LandingPage/Stats";
import Testimonials from "../components/LandingPage/Testimonials";
import ContactUs from "../components/LandingPage/ContactUs";
import Faq from "../components/LandingPage/Faq";
import Footer from "../components/LandingPage/Footer";
export default function AboutUs() {
  return (
    <>
      <Navbar />
       <TopSection/>      
       <WhyDifferent/>
       <About />  
       <Stats/>
       <Pricing/>
       <Testimonials/>
       <Faq/>
       <ContactUs/>
       <Footer/>
       

      
    </>
  );
}
