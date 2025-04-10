import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Send,
  AlertCircle,
} from "lucide-react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real application, you would send this data to your backend
    console.log("Form data submitted:", formData);

    // Simulate a successful submission
    setFormStatus({
      submitted: true,
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
    });

    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white font-display">
        Contact Us
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-12 font-body">
        We'd love to hear from you. Please fill out this form or use our contact
        information.
      </p>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white font-display">
              Get In Touch
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8 font-body">
              Have questions, feedback, or just want to say hello? We'd love to
              hear from you. Fill out the form, and we'll get back to you as
              soon as possible.
            </p>

            <div className="space-y-6 text-left">
              <div className="flex items-center">
                <div className="flex-shrink-0 mt-1">
                  <Mail className="h-6 w-6 text-brand" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Email
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    info@babeslove.com
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 mt-1">
                  <Phone className="h-6 w-6 text-brand" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Phone
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    (123) 456-7890
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 mt-1">
                  <MapPin className="h-6 w-6 text-brand" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Address
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    123 Main Street
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Anytown, USA 12345
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand" />
                Business Hours
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Follow Us
              </h3>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-gray-500 hover:text-brand dark:text-gray-400 dark:hover:text-brand-400 transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-brand dark:text-gray-400 dark:hover:text-brand-400 transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-brand dark:text-gray-400 dark:hover:text-brand-400 transition-colors"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white font-display">
              Send Us a Message
            </h2>

            {formStatus && formStatus.submitted && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                  formStatus.success
                    ? "bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                    : "bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                }`}
              >
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <p>{formStatus.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500"
                  required
                >
                  <option value="" className="dark:bg-gray-700">
                    Select a subject
                  </option>
                  <option value="Product Inquiry" className="dark:bg-gray-700">
                    Product Inquiry
                  </option>
                  <option value="Order Status" className="dark:bg-gray-700">
                    Order Status
                  </option>
                  <option
                    value="Returns & Exchanges"
                    className="dark:bg-gray-700"
                  >
                    Returns & Exchanges
                  </option>
                  <option value="Custom Order" className="dark:bg-gray-700">
                    Custom Order
                  </option>
                  <option value="Feedback" className="dark:bg-gray-700">
                    Feedback
                  </option>
                  <option value="Other" className="dark:bg-gray-700">
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Your message here..."
                  required
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-600 
                           transition-colors flex items-center gap-2 font-medium"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white font-display flex items-center gap-2">
            <MapPin className="h-6 w-6 text-brand" />
            Our Location
          </h2>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            {/* Placeholder for a map - in a real application, you would use Google Maps or another map provider */}
            <div className="bg-gray-100 dark:bg-gray-700 h-96 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Map Placeholder
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
