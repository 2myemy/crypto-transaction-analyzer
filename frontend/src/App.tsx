import Hero from "./components/Hero";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0F14]">
      <Hero
        onAnalyze={(addr) => {
          console.log("Analyze:", addr);
        }}
      />
    </div>
  );
}