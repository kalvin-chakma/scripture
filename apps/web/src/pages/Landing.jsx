import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { BsLightbulbOffFill, BsLightbulb } from "react-icons/bs";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import MockupWindow from "../components/landing-page/MockupWindow";
import DashboardMockup from "../components/landing-page/DashboardMockup";
import Eyebrow from "../components/landing-page/Eyebrow";
import { navLinks, strip, sections, principles, mockups } from "../components/landing-page/content";
import Button from "../components/ui/button";

export default function Landing() {
  document.title = "Scripture | Notes, your way";
  const { theme, setTheme } = useTheme();
  const [isLoggedIn] = useState(() => Boolean(localStorage.getItem("token")));

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    if (document.startViewTransition) {
      document.startViewTransition(() => setTheme(next));
    } else {
      setTheme(next);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-black dark:bg-[#1f1f1f] dark:text-white">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Scripture" className="w-7 h-7 rounded-lg" />
          <span className="font-semibold tracking-tight">SCRIPTURE</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-black dark:hover:text-white transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button
            variant="unstyled"
            onClick={toggleTheme}
            className="rounded-full p-2 text-lg text-black dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-150"
            title="Toggle theme"
          >
            {theme === "dark" ? <BsLightbulbOffFill /> : <BsLightbulb />}
          </Button>
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              title="Dashboard"
              className="flex items-center justify-center text-black hover:text-neutral-500 transition-colors duration-150"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/user/signin"
                className="text-xs font-mono uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-150"
              >
                Log in
              </Link>
              <Link
                to="/user/signup"
                className="text-xs font-mono uppercase tracking-wider bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-150"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-12 pb-16">
        <h1 className="font-serif text-4xl sm:text-6xl leading-tight mb-4">
          Every note, however
          <br />
          you like to <em className="italic">write</em>.
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Markdown docs, structured pages, and to-do lists — one fast,
          distraction-free workspace.
        </p>
      </section>

      {/* Hero preview */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <MockupWindow>
          <DashboardMockup className="p-8 min-h-[22rem]" />
        </MockupWindow>
      </section>

      {/* Hero visual */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          {strip.map((item, i) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                className={`p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150 ${
                  i > 0 ? "border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-neutral-800" : ""
                }`}
              >
                <Icon className="w-5 h-5 mb-3 text-gray-500 dark:text-gray-400" />
                <p className="font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {item.desc}
                </p>
                <span className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Explore <HiOutlineArrowUpRight className="w-3 h-3" />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* Numbered feature sections */}
      <div className="max-w-4xl mx-auto px-6 mt-20 space-y-16">
        {sections.map((section) => {
          const Mockup = mockups[section.mockup];
          return (
            <section
              key={section.id}
              id={section.id}
              className="grid md:grid-cols-2 gap-8 items-start border border-gray-200 dark:border-neutral-800 rounded-xl p-6"
            >
              <div>
                <Eyebrow className={section.eyebrowColor}>
                  {section.eyebrow}
                </Eyebrow>
                <h2 className="font-serif text-2xl sm:text-3xl mt-2 mb-6">
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className={`flex gap-3 pl-3 border-l-2 ${
                          item.active ? "border-blue-500" : "border-transparent"
                        }`}
                      >
                        <Icon className="w-4 h-4 mt-0.5 text-gray-500 dark:text-gray-400 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Mockup />
            </section>
          );
        })}
      </div>

      {/* One board section */}
      <section className="max-w-4xl mx-auto px-6 mt-16 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <Eyebrow className="text-pink-600 dark:text-pink-400 mb-2">
            ONE WORKSPACE
          </Eyebrow>
          <h2 className="font-serif text-2xl sm:text-3xl mb-3">
            Every note type,
            <br />
            one board.
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Markdown notes, structured docs, and to-do lists are grouped into
            columns automatically, so nothing gets lost between formats.
          </p>
        </div>
        <DashboardMockup />
      </section>

      {/* Principles */}
      <section className="max-w-4xl mx-auto px-6 mt-16 grid sm:grid-cols-3 gap-px bg-gray-200 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        {principles.map((text) => (
          <div key={text} className="bg-[#faf9f6] dark:bg-[#1f1f1f] p-5">
            <p className="font-serif italic text-sm text-gray-700 dark:text-gray-300">
              "{text}"
            </p>
          </div>
        ))}
      </section>

      {/* Closing CTA */}
      <section className="max-w-4xl mx-auto px-6 mt-16 mb-20 border border-gray-200 dark:border-neutral-800 rounded-xl p-8 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl mb-2">
          Ready to start writing?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Create an account and your first note is a few seconds away.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/user/signin"
            className="text-xs font-mono uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-150"
          >
            Log in
          </Link>
          <Link
            to="/user/signup"
            className="text-xs font-mono uppercase tracking-wider bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors duration-150"
          >
            Sign up
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          <div>
            <p className="font-mono uppercase tracking-wider text-gray-400 mb-3">
              Product
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li><a href="#markdown" className="hover:text-black dark:hover:text-white">Markdown Notes</a></li>
              <li><a href="#structured" className="hover:text-black dark:hover:text-white">Structured Notes</a></li>
              <li><a href="#todos" className="hover:text-black dark:hover:text-white">To-Do Lists</a></li>
            </ul>
          </div>
          <div>
            <p className="font-mono uppercase tracking-wider text-gray-400 mb-3">
              Account
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li><Link to="/user/signin" className="hover:text-black dark:hover:text-white">Log in</Link></li>
              <li><Link to="/user/signup" className="hover:text-black dark:hover:text-white">Sign up</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 pb-8 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Scripture" className="w-4 h-4 rounded" />
            <span>SCRIPTURE</span>
          </div>
          <span>&copy; {new Date().getFullYear()} Scripture</span>
        </div>
      </footer>
    </div>
  );
}
