"use client";
import Calendar from "./Calendar";
import Card from "./Card";
import DailyTasks from "./DailyTasks";
import OverallProgress from "./OverallProgress";

export default function Main() {
  return (
    <main className="">
      <div className="mx-auto max-w-2xl px-6 lg:py-8 lg:max-w-7xl lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <Calendar />
          </Card>
          <Card>
            <DailyTasks />
          </Card>
          <Card>
            <OverallProgress />
          </Card>
        </div>
      </div>
    </main>
  );
}
