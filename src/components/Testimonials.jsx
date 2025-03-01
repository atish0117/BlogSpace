import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Johnson",
    review: "This blog has been a game-changer for me! The insights and writing style keep me engaged every time.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    name: "Sophia Williams",
    review: "I love how informative and well-structured the content is. A must-read for anyone who loves learning!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
  },
  {
    name: "Michael Brown",
    review: "The topics covered here are so diverse and insightful. I always find something new and exciting to read.",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">What Our Readers Say</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
            <p className="text-gray-600 mt-2 text-sm">{testimonial.review}</p>
            <div className="flex justify-center mt-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} size={20} className="text-yellow-500" fill="currentColor" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
