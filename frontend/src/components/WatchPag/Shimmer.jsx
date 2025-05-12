import React from "react";

const Shimmer = () => {
  return (
    <div
      id="main"
      className="lg:px-14 max-lg:px-5 max-sm:px-2 sm:py-5 flex max-lg:flex-col"
    >
      <div className="w-[62%] max-lg:w-full">
        <div className="shimmer sm:h-[22rem] h-48 w-full bg-[#E3E3E3] dark:bg-dark_bg rounded-md mb-5"></div>
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
        <div className="shimmer border-t border-medium_gray dark:border-dark_bg w-full my-5 bg-[#E3E3E3] dark:bg-dark_bg rounded-md"></div>
        <div className="lg:h-[20rem] max-lg:mb-10">
          <div className="flex gap-2 justify-between items-center">
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
      <div className="h-fit w-[38%] max-lg:w-full">
        <div className="shimmer h-6 w-40 bg-[#E3E3E3] dark:bg-dark_bg rounded-md"></div>
        <div className="flex flex-col gap-2 mt-5">
          {[...Array(10)].map((_, index) => (
            <div className="flex gap-2 rounded-md " key={index}>
              <div className="relative min-w-40 h-24 rounded-md">
                <div className="w-full h-full bg-[#E3E3E3] dark:bg-dark_bg rounded-md"></div>
                <span className="absolute bottom-2 right-1 h-4 w-10 bg-[#E3E3E3] dark:bg-dark_bg rounded-md shimmer"></span>
              </div>
              <div className="flex gap-2 w-full justify-between">
                <div className="flex flex-col gap-2 w-full">
                  <div className="shimmer h-6 w-[90%] bg-[#E3E3E3] dark:bg-dark_bg rounded-md"></div>
                  <div className="shimmer h-4 w-[70%] bg-[#E3E3E3] dark:bg-dark_bg rounded-md"></div>
                  <div className="shimmer h-4 w-[60%] bg-[#E3E3E3] dark:bg-dark_bg rounded-md"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shimmer;
