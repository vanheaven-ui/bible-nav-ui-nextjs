// This is the main homepage of your Bible Nav application using the App Router.

// Note: In App Router, `Head` is replaced by `metadata` in layout.tsx or page.tsx
// For dynamic metadata, you can export a `generateMetadata` function.

const HomePage: React.FC = () => {
  return (
    // Main container: Removed redundant nested div.
    // Adjusted padding (px-4 sm:px-6 lg:px-8) for responsiveness.
    // Added flex-col to stack content vertically.
    // min-h-screen ensures it takes full viewport height.
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-50 text-gray-900">
      {/* Header/Navigation Placeholder */}
      <header className="w-full bg-white shadow-sm py-4 px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-blue-700">Bible Nav</div>
          <div className="space-x-4">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-700 transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-700 transition-colors"
            >
              Books
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-700 transition-colors"
            >
              Favorites
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-700 transition-colors"
            >
              Login
            </a>
          </div>
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-800 leading-tight animate-fade-in-down">
          Welcome to <span className="text-yellow-600">Bible Nav</span>!
        </h1>

        <p className="mt-4 text-xl sm:text-2xl text-gray-700 animate-fade-in-up">
          Your journey through the scriptures begins here.
        </p>

        {/* Verse of the Day Section */}
        <section className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl max-w-xl w-full text-center border border-blue-200 animate-fade-in">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2500/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 text-yellow-600"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 .054.24l2.25 2.815a.75.75 0 1 0 1.196-.952L13.5 11.25V6Z"
                clipRule="evenodd"
              />
            </svg>
            Verse of the Day
          </h2>
          <p className="text-lg italic text-gray-800 leading-relaxed">
            "For God so loved the world, that he gave his only begotten Son,
            that whosoever believeth in him should not perish, but have
            everlasting life."
          </p>
          <p className="text-sm text-gray-600 mt-3">- John 3:16 (KJV)</p>
        </section>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <a
            href="#" // Placeholder link
            className="group p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <h3 className="text-2xl font-bold text-blue-700 group-hover:text-blue-800 transition-colors">
              Explore Books{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                &rarr;
              </span>
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Find any book, chapter, or verse in the Bible with ease.
            </p>
          </a>

          <a
            href="#" // Placeholder link
            className="group p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-yellow-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <h3 className="text-2xl font-bold text-yellow-600 group-hover:text-yellow-700 transition-colors">
              Manage Favorites{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                &rarr;
              </span>
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Keep track of your most cherished verses and revisit them anytime.
            </p>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center w-full h-16 border-t mt-12 bg-white text-gray-600">
        <a
          className="flex items-center justify-center gap-2 text-sm"
          href="https://github.com/your-github-profile" // Replace with your GitHub
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Bible Nav API & Next.js
        </a>
      </footer>
    </div>
  );
};

export default HomePage;
