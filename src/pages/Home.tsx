import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome to the Bug Tracker</h1>
        <p className="mt-4">You are logged in.</p>
      </div>
    </div>
  );
};

export default Home;
