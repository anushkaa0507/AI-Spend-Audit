import Navbar from "@/src/components/UI/Navbar";
import Hero from "@/src/components/UI/Hero";
import SpendForm from "@/src/components/UI/SpendForm";

export default function Home() {
  return (
    <main style={{ background: "#09090f", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <SpendForm />
    </main>
  );
}