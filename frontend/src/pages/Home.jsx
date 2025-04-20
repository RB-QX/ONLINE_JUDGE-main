// export default Home;
import React from "react";
import { Link } from "react-router-dom";
import TopicCard from "../components/TopicCard";
import FeatureCard from "../components/FeatureCard";
import WhyChooseUsCard from "../components/WhyChooseUsCard";
import Footer from "../components/Footer";
import data from "../assets/data.json";
import CursorFollowDiv from "../components/CursorFollowDiv";

const Home = () => {
  const { topics, features, whyChooseUs, footerLinks } = data;

  return (
    <div className="bg-richblack-800">
      <CursorFollowDiv />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Explore Topics */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-yellow-400">
            Explore Topics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topics.map((topic, index) => (
              <TopicCard
                key={index}
                title={topic.title}
                description={topic.description}
              />
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section className="mb-12">
          <h2 className="text-3xl text-yellow-400 font-semibold mb-6">
            How it Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>

        {/* Why Choose Us? */}
        <section className="mb-12">
          <h2 className="text-3xl text-yellow-400 font-semibold mb-6">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyChooseUs.map((point, index) => (
              <WhyChooseUsCard
                key={index}
                title={point.title}
                description={point.description}
              />
            ))}
          </div>
        </section>

        {/* Get Started */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6 text-yellow-300">
            Get Started Today
          </h2>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md transition duration-300">
                Sign Up / Log In
              </button>
            </Link>
            <Link to="/allproblems">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg shadow-md transition duration-300">
                Explore Problems
              </button>
            </Link>
            <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 py-3 px-6 rounded-lg shadow-md transition duration-300">
              Learn More
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}

      <Footer footerLinks={footerLinks} />
    </div>
  );
};

export default Home;
