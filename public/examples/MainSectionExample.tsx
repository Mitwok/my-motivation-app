import Card from "../Card";

export default function MainSection() {
  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-6 lg:py-8 lg:max-w-7xl lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <Card rounded="left" />
          <Card rounded="" />
          <Card rounded="right" />
        </div>
      </div>
    </main>
  );
}
