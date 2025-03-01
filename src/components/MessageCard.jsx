import React from "react";
import { Link } from "react-router-dom";

const MessageCard = ({ title, message, linkText, linkTo }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">
            {message}{" "}
            <Link to={linkTo} className="text-blue-600 hover:text-blue-700">
              {linkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;




// how to use

// import React from "react";
// import MessageCard from "./MessageCard";

// const NoBlogsFound = () => {
//   return (
//     <MessageCard
//       title="No Blogs Found"
//       message="You don't have any blogs yet. Create one"
//       linkText="Create Blog"
//       linkTo="/createblog"
//     />
//   );
// };

// export default NoBlogsFound;