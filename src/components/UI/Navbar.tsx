export default function Navbar() {

  return (
    <nav className="w-full p-4 border-b">

      <div className="max-w-6xl mx-auto flex justify-between">

        <h1 className="text-2xl font-bold">
          AI Spend Audit
        </h1>

        <button className="bg-black text-white px-4 py-2 rounded-lg">
          Get Audit
        </button>

      </div>

    </nav>
  );
}