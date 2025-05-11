import React from "react";

const Shimmer = () => {
  return (
    <div id="main" className="px-24 py-5 flex gap-10">
      <div className="w-[62%]">
        <div className="shimmer h-[22rem] w-full bg-[#E3E3E3] dark:bg-dark_bg rounded-md mb-5"></div>
        <div className="shimmer h-6 w-[60%] bg-[#E3E3E3] dark:bg-dark_bg rounded-md"></div>
        <div className="flex items-center justify-between">
          <div className="shimmer h-6 w-[30%] bg-[#E3E3E3] dark:bg-dark_bg rounded-md"></div>
          <div className="flex gap-2 items-center flex-shrink-0 mt-3">
            <div className="shimmer flex-shrink-0 h-6 w-6 bg-[#E3E3E3] dark:bg-dark_bg rounded-full"></div>
            <div className="shimmer flex-shrink-0 h-6 w-6 bg-[#E3E3E3] dark:bg-dark_bg rounded-full"></div>
            <div className="shimmer flex-shrink-0 h-6 w-6 bg-[#E3E3E3] dark:bg-dark_bg rounded-full"></div>
            <div className="shimmer flex-shrink-0 h-6 w-6 bg-[#E3E3E3] dark:bg-dark_bg rounded-full"></div>
            <div className="shimmer flex-shrink-0 h-6 w-6 bg-[#E3E3E3] dark:bg-dark_bg rounded-full"></div>
            <div className="shimmer flex-shrink-0 h-6 w-6 bg-[#E3E3E3] dark:bg-dark_bg rounded-full"></div>
          </div>
        </div>
        <div className="shimmer border-t border-dark_bg w-full my-5 bg-[#E3E3E3] dark:bg-dark_bg rounded-md"></div>
        <div className="h-[20rem]">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="shimmer flex-shrink-0 h-12 w-12 bg-[#E3E3E3] dark:bg-dark_bg rounded-full"></div>
              <div className="space-y-1">
                <div className="shimmer h-6 w-40 bg-[#E3E3E3] dark:bg-dark_bg rounded-md"></div>
                <div className="shimmer h-6 w-40 bg-[#E3E3E3] dark:bg-dark_bg rounded-md"></div>
              </div>
            </div>
            <div className="shimmer h-8 w-40 bg-[#E3E3E3] dark:bg-dark_bg rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shimmer;
