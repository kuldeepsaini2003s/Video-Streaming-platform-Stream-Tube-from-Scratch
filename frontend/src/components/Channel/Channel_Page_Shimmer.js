import React from "react";

const Channel_Page_Shimmer = () => {
  return (
    <div id="main" className="px-2">
      <div className="px-20 py-3">
        <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black dark:bg-icon_black rounded-md h-40 w-full"></div>
        <div className="flex gap-x-5 mt-2">
          <div className="shimmer flex-shrink-0 bg-[#E3E3E3] dark:bg-icon_black dark:bg-icon_black rounded-full h-24 w-24"></div>
          <div className="w-full space-y-1">
            <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black dark:bg-icon_black rounded-md h-6 w-[30%]"></div>
            <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black dark:bg-icon_black rounded-md h-6 w-[20%]"></div>
            <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black dark:bg-icon_black rounded-md h-6 w-[15%]"></div>
          </div>
        </div>
      </div>
      <div className="border-b-2 dark:border-icon_black"></div>
      <div className="px-20 grid gap-x-3 gap-y-4 grid-cols-4 p-5">
        {Array(20)
          .fill("")
          .map((index) => (
            <div key={index}>
              <div>
                {/* img */}
                <div className="shimmer sm:h-[9rem]  ms:h-[8rem]  sm:rounded-xl bg-Gray dark:bg-icon_black"></div>

                <div className="flex sm:p-2 sm:px-0 sm:py-2 ms:px-4 ms:py-4 gap-3">
                  {/* channdel */}
                  <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black rounded-full p-4 w-5 h-5"></div>
                  {/* title */}
                  <div className="space-y-1 w-full">
                    <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black rounded-sm h-5 w-[80%]"></div>
                    <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black rounded-sm h-5 w-[50%]"></div>
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
