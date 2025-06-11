// src/pages/Home.tsx
import Navbar from "../components/Navbar";
import ProjectList from "./ProjectList";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-6">
        <ProjectList />
      </div>
    </div>
  );
};

export default Home;
