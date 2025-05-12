import React from "react";

const Channel_Page_Shimmer = () => {
  return (
    <div id="main" className="px-2">
      <div className="lg:px-20 sm:px-5 sm:py-3">
        <div className="shimmer bg-[#E3E3E3] dark:bg-dark_bg dark:bg-dark_bg rounded-md sm:h-40 h-20 w-full"></div>
        <div className="flex gap-x-5 mt-2">
          <div className="shimmer flex-shrink-0 bg-[#E3E3E3] dark:bg-dark_bg dark:bg-dark_bg rounded-full sm:h-24 sm:w-24 w-18 h-18"></div>
          <div className="w-full space-y-1">
              <div className="shimmer bg-[#E3E3E3] dark:bg-dark_bg dark:bg-dark_bg rounded-md sm:h-6 h-5 md:w-[30%] w-[50%] max-sm:w-[60%]"></div>
            <div className="shimmer bg-[#E3E3E3] dark:bg-dark_bg dark:bg-dark_bg rounded-md sm:h-6 h-5 md:w-[20%] w-[40%] max-sm:w-[50%]"></div>
            <div className="shimmer bg-[#E3E3E3] dark:bg-dark_bg dark:bg-dark_bg rounded-md sm:h-6 h-5 md:w-[15%] w-[30%] max-sm:w-[40%]"></div>
          </div>
        </div>
      </div>
      <div className="border-b-2 dark:border-dark_bg max-sm:pt-5"></div>
      <div className="lg:px-20 sm:px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {Array(20)
          .fill("")
          .map((index) => (
            <div key={index}>
              <div>
                {/* img */}
                <div className="shimmer sm:h-[9rem] rounded-md ms:h-[10rem] bg-Gray dark:bg-dark_bg"></div>

                <div className="flex p-2 gap-3">
                  {/* channdel */}
                  <div className="shimmer bg-[#E3E3E3] dark:bg-dark_bg rounded-full p-4 w-5 h-5"></div>
                  {/* title */}
                  <div className="space-y-1 w-full">
                    <div className="shimmer bg-[#E3E3E3] dark:bg-dark_bg rounded-sm h-5 w-[80%]"></div>
                    <div className="shimmer bg-[#E3E3E3] dark:bg-dark_bg rounded-sm h-5 w-[50%]"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Channel_Page_Shimmer;
