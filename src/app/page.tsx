import MainSection from "./components/MainSection";
import Header from "./components/Header";
import { CalendarProvider } from "./components/contexts/CalendarContext";

export default function Home() {
  return (
    <CalendarProvider>
      <div className="h-dvh">
        <Header />
        <MainSection />
      </div>
    </CalendarProvider>
  );
}
