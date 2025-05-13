import React from "react";
import Select from "react-select";
import { toast } from "react-hot-toast";

// Define categories
const categories = [
 "Development", "Web Development", "Mobile Apps", "AI","Machine Learning", "Cybersecurity",
    "DevOps","Cloud Computing", "Programming","Coding", "Entrepreneurship","Startups", "Investing","Stock Market",
    "Personal Finance","Budgeting", "Marketing","SEO", "E-commerce","Dropshipping", "Freelancing","Remote Work",
    "Health","Fitness", "Mental Wellness","Self-Care","Adventure", "Food","Cooking", "Fashion","Beauty",
    "Home","Living", "Job Search","Career Growth", "Productivity","Time Management", "Study","Learning Hacks",
    "Leadership","Management", "Movies","TV Shows", "Music","Podcasts", "Gaming","Esports","Literature",
    "Pop Culture","Celebrities", "Space","Astronomy", "Environment","Sustainability", "Physics","Chemistry",
    "Biotechnology","Medicine", "Social Issues","Culture", "Psychology","Philosophy",
    "Inspirational Stories", "Technology", "Books", "Art", "Self-Improvement","Wellness",
    "Business",  "Travel", "Writing", "Photography", "Design","Education", "SaveThePlanet" ,
  "Innovation","NatureMeetsTechnology","EcoFriendly ",
  "EnvironmentalAwareness", "SuccessTips","Motivation", "DailyHabits","Discipline" ,"Other"
];

const CategorySelector = ({ selectedCategories, setSelectedCategories }) => {
  // Convert categories to react-select format
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }));

  // Handle category selection
  const handleCategoryChange = (selectedOptions) => {
    if (selectedOptions.length > 5) {
      toast.error("You can select up to 5 categories only!");
      return;
    }
    setSelectedCategories(selectedOptions.map((option) => option.value));
  };

  return (
    <div className="mb-4 ">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Categories (Max 5)
      </label>
      <Select
        options={categoryOptions}
        isMulti
        isSearchable
        value={categoryOptions.filter((option) => selectedCategories.includes(option.value))}
        onChange={handleCategoryChange}
        className="basic-multi-select z-10"
        classNamePrefix="select"
        placeholder="Choose categories..."
      />
    </div>
  );
};

export default CategorySelector;
