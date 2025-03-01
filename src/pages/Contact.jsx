import { useState } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const offices = [
    {
      city: "Bangalore",
      address: "100 Market Street, Suite 300",
      phone: "+919999222211",
      email: "bangalore.blogspace@gmail.com",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=800",
    },
    {
      city: "London",
      address: "10 Liverpool Street, Floor 5",
      phone: "+44 20 7123 4567",
      email: "london.blogspace@gmail.com",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about BlogSpace? We're here to help. Send us a message and we'll
            respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Message Sent Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Office Locations */}
          <div className="space-y-8">
            {offices.map((office) => (
              <div key={office.city} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={office.image} alt={`${office.city} office`} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{office.city} Office</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <span className="text-gray-600">{office.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">{office.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">{office.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Connect With Us</h3>
          <div className="flex justify-center space-x-6">
            <a href="https://github.com/atish0117" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <Github className="w-6 h-6" />
            </a>
            <a href="www.linkedin.com/in/atish-kumar-6856a42ba" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
