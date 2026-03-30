import LandingComponent from "./components/landing";
import FooterComponent from "./components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <LandingComponent />
      </main>
    </div>
  );
}
