import { CheckCircleIcon, DevicePhoneMobileIcon, Squares2X2Icon, UserGroupIcon, ClipboardDocumentCheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const features = [
  {
    title: "Create & Manage Projects",
    description:
      "Start new projects with ease and organize all your work in dedicated spaces. Each project can have its own team, tickets, and management tools for seamless collaboration.",
    icon: Squares2X2Icon,
  },
  {
    title: "Report Bugs & Issues as Tickets",
    description:
      "Effortlessly report software bugs, feature requests, or improvements as detailed tickets. Enhance communication with rich ticket descriptions, attachments, and activity logs.",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    title: "Assign & Track Tickets",
    description:
      "Easily assign tickets to team members, track status, priorities, and progress. Stay up to date on what's happening and who owns what at all times.",
    icon: UserGroupIcon,
  },
  {
    title: "Kanban Workflow (To Do, In Progress, Done)",
    description:
      "Manage tickets visually by dragging and dropping across Kanban boards—move issues through custom statuses and resolve them efficiently.",
    icon: CheckCircleIcon,
  },
  {
    title: "Filter, Search & Sort",
    description:
      "Quickly find tickets or projects with advanced search and filtering. Sort by status, priority, assignee, or custom labels for full control.",
    icon: MagnifyingGlassIcon,
  },
  {
    title: "Scalable & Responsive",
    description:
      "From solo developers to enterprise teams, Bug Tracker grows with you. Fully responsive design ensures you can track work from any device: desktop, tablet, or mobile.",
    icon: DevicePhoneMobileIcon,
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 px-2 py-8 md:px-0 flex flex-col items-center font-sans">
      {/* HERO SECTION */}
      <section className="max-w-3xl w-full text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-200 drop-shadow mb-3">
          Welcome to <span className="text-blue-400">Bug Tracker</span>
        </h1>
        <p className="text-xl text-indigo-200/80 font-medium mb-6">
          Your all-in-one platform to create, organize, and conquer software projects and bugs—anywhere, anytime.
        </p>
      </section>

      {/* FEATURE CARDS */}
      <section className="w-full max-w-5xl grid gap-6 md:grid-cols-2 xl:grid-cols-3 justify-items-center">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-slate-950/80 border border-blue-900 rounded-2xl shadow-xl flex flex-col items-center p-6 text-center backdrop-blur-lg hover:scale-105 transition-transform group min-h-[250px]"
          >
            <feature.icon className="h-12 w-12 mb-3 text-blue-400 group-hover:text-cyan-300 transition-colors" />
            <h3 className="text-lg font-bold text-blue-200 mb-2">{feature.title}</h3>
            <p className="text-indigo-100 opacity-90 leading-relaxed font-normal text-base">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* DEVICE RESPONSIVENESS FOOTNOTE */}
      <div className="mt-12 text-sm text-blue-200/60 text-center max-w-xl">
        Bug Tracker is fully optimized for all platforms. Build and manage your workflow effortlessly&mdash;from your desk or on the go.
      </div>
    </div>
    
  );
};

export default Home;
