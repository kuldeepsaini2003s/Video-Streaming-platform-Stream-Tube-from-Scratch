import React from "react";

const ShimmerCard = () => {
  return (
    <div id="main" className="p-4">
      <div className="flex items-center gap-4 justify-start mb-5">
        {Array(10)
          .fill(" ")
          .map((index) => (
            <div
              key={index}
              className="shimmer bg-[#E3E3E3] dark:bg-icon_black rounded-md h-8 w-24"
            ></div>
          ))}
      </div>
      <div className="grid max-md:grid-cols-1 ml:grid-cols-2 gap-3 sm:grid-cols-3 max-md:p-0 lg:grid-cols-3">
        {Array(30)
          .fill(" ")
          .map((index) => (
            <div key={index}>
              <div>
                <div className="shimmer w-full sm:h-[12rem] ms:h-[11rem] sm:rounded-xl bg-Gray dark:bg-icon_black"></div>
                <div className="flex sm:p-2 sm:px-0 sm:py-2 ms:px-4 ms:py-4 gap-3">
                  <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black rounded-full p-4 w-10 h-10"></div>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black rounded-sm h-5 w-[80%]"></div>
                    <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black rounded-sm h-5 w-[60%]"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShimmerCard;
