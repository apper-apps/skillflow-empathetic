import { motion } from "framer-motion";
import HeroSection from "@/components/organisms/HeroSection";
import ProcessOverview from "@/components/organisms/ProcessOverview";
import PricingSection from "@/components/organisms/PricingSection";

const LandingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen"
    >
      <HeroSection />
      <ProcessOverview />
      <PricingSection />
    </motion.div>
  );
};

export default LandingPage;