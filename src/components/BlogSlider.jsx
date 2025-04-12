import React from "react";
import Slider from "react-slick";
import { useAuth } from "../context/AuthContext";
import BlogCard from "./BlogCard";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BlogSlider = () => {
  const { allBlogs } = useAuth();
  const latestBlogs = [...allBlogs].reverse().slice(0, 6);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3, // Show 3 blog cards
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-6">Latest Blogs</h2>
      <Slider {...settings}>
        {latestBlogs.map((blog, index) => (
          <div key={index} className="px-2">
            <BlogCard blog={blog} />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default BlogSlider;
