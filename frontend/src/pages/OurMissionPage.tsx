import React from "react";
import { Check, Instagram, Facebook, Twitter } from "lucide-react";

const OurMissionPage: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl font-display font-bold text-center mb-6 text-brand-700 dark:text-brand-400">
            Our Mission
          </h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12">
            Empowering Through Love & Connection
          </p>

          {/* Main Image */}
          <div className="mb-12 rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://via.placeholder.com/1200x450?text=Babes+Love+Community"
              alt="Babes Love Community and Impact"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Introduction Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">
              More Than Just Hats
            </h2>
            {/* Apply Tailwind Typography for better readability */}
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
              <p>
                At Babes Love, our mission transcends fashion—it's about
                creating a movement of love, compassion, and meaningful
                connection. We believe in the power of giving back to those who
                need it most: the children who have no one, the children who
                desperately need love, and the children who will one day change
                this world for the better.
              </p>
              <p>
                Every hat we create serves as a symbol of our commitment to
                these children. More than just a fashion statement, each Babes
                Love product represents a tangible contribution to creating safe
                spaces, nurturing environments, and opportunities for children
                who otherwise might be overlooked by society.
              </p>
              <p>
                Our journey began with a deeply personal commitment to transform
                the lives of vulnerable children through direct action and
                sustainable support. We recognized that by combining our passion
                for style with our dedication to social impact, we could build a
                community of like-minded individuals who share our vision for a
                world where no child feels unloved or forgotten.
              </p>
              <p>
                When you choose Babes Love, you're not just purchasing a
                hat—you're joining a movement that believes in the potential of
                every child and the power of love to transform lives. Together,
                we can create ripples of positive change that will extend far
                beyond what we might accomplish alone.
              </p>
            </div>
          </div>

          {/* Values & Commitment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {/* Our Values Card */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border-t-4 border-brand">
              <h3 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-white">
                Our Values
              </h3>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-brand dark:text-brand-400 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    <strong>Love & Compassion:</strong> Central to everything we
                    do, guiding our interactions and impact.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-brand dark:text-brand-400 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    <strong>Quality Craftsmanship:</strong> Every hat is crafted
                    with attention to detail and made to last.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-brand dark:text-brand-400 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    <strong>Community & Connection:</strong> Building a
                    supportive network that shares our passions.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-brand dark:text-brand-400 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    <strong>Responsibility:</strong> Committed to ethical
                    sourcing and sustainable practices.
                  </span>
                </li>
              </ul>
            </div>

            {/* Our Commitment Card */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border-t-4 border-brand">
              <h3 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-white">
                Our Commitment
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-5">
                We're dedicated to creating products that look good and do good.
                That's why we:
              </p>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-brand dark:text-brand-400 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    Use ethically sourced materials whenever possible.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-brand dark:text-brand-400 mr-3 flex-shrink-0 mt-1" />
                  <span>Partner with artisans and support fair labor.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-brand dark:text-brand-400 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    Strive to minimize waste in our production process.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-brand dark:text-brand-400 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    Donate a portion of our profits to effective children's
                    welfare organizations.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Impact Journey Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">
              Our Impact Journey
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
              <p>
                Babes Love was founded with a clear vision: to transform the
                lives of children who lack loving support systems. What started
                as a heartfelt mission to create positive change has evolved
                into a movement that combines fashion, community engagement, and
                direct action to support vulnerable children.
              </p>
              <p>
                Through strategic partnerships with children's welfare
                organizations, we're able to ensure that a significant portion
                of our proceeds directly benefits programs focused on foster
                care, adoption support, educational opportunities, and mental
                health services for children in need.
              </p>
              <p>
                We are proud to see the tangible impact of our work in the
                stories of children whose lives have been touched by our
                initiatives. Despite our growth, we remain deeply committed to
                our founding purpose: using our platform to give voice to the
                voiceless and love to those who need it most.
              </p>
            </div>
          </div>

          {/* Join Us Section */}
          <div className="text-center bg-white dark:bg-gray-800 p-10 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Join Our Movement
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
              Whether you're passionate about children's welfare, fashion with
              purpose, or simply want to be part of something meaningful, we
              invite you to join our growing community. Together, we can create
              a world where every child knows they are loved, valued, and
              capable of changing the world.
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="#" // Replace with actual Instagram link
                className="text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-8 w-8" />
              </a>
              <a
                href="#" // Replace with actual Facebook link
                className="text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-8 w-8" />
              </a>
              <a
                href="#" // Replace with actual Twitter link
                className="text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-8 w-8" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurMissionPage;
