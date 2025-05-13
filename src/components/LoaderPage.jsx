import React from 'react';
import { ClipLoader, RiseLoader } from 'react-spinners';

// Loader with RiseLoader
export const LoaderPage = () => {
  return (
    <div className=" flex flex-col justify-center items-center">
      <div className="bottom-0 left-0 right-0  py-2">
        <div className="flex justify-center">
          <RiseLoader color="#000" size={30} />
        </div>
      </div>
    </div>
  );
};

// Loader with ClipLoader
export const LoaderPage2 = () => {
  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center">
      <div className="bottom-0 left-0 right-0 bg-gray-100 py-2">
        <div className="flex justify-center">
          <ClipLoader color="#000" size={20} />
        </div>
      </div>
    </div>
  );
};
