import React from "react";

const Shimmer = () => {
  return (
    <div className="shimmer-bg flex flex-col sm:gap-20 ms:gap-12 sm:pl-20">
      {/* navbar container  */}
      <div className="shimmer-border flex sm:pl-60 p-5 sm:justify-between ms:justify-end border-b border-[#E3E3E3] dark:border-icon_black">
        <div className="flex items-center sm:block ms:hidden">
          <div className="flex">
            {/* input-btn */}
            <div className="relative">
              <input
                id="input"
                type=""
                className="w-[42vw] h-[2.5rem] border border-r-none border-[#E3E3E3] dark:bg-black dark:border-icon_black dark:border-icon_black rounded-r-none rounded-3xl p-1 pl-5 focus:outline-none"
              />
            </div>

            {/* Search-btn */}
            <button className="shimmer shimmer-input rounded-3xl rounded-l-none border bg-[#E3E3E3] dark:border-icon_black dark:bg-black border-Gray dark:border-icon_black h-[2.5rem] w-[5vw] flex justify-center items-center"></button>
          </div>
        </div>
        <div className="flex justify-end items-center gap-3">
          <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black rounded-full p-4 w-5 h-5"></div>
          <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black rounded-full p-4 w-5 h-5"></div>
          <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black rounded-full p-4 w-5 h-5"></div>
        </div>
      </div>

      {/* main container */}
      <div className="shimmer-border flex sm:flex-row ms:flex-col border-t sm:pl-6 flex-wrap sm:gap-x-4 sm:gap-y-8 ms:gap-y-4 border-[#E3E3E3] dark:border-icon_black sm:p-4  ms:py-4">
        {/* video-container */}

        {Array(30)
          .fill(" ")
          .map((e, index) => (
            <div key={index}>
              <div>
                {/* img */}
                <div className="shimmer sm:h-[35vh] sm:w-[28vw] ms:h-[11rem]  sm:rounded-xl bg-Gray dark:bg-icon_black"></div>

                <div className="flex sm:p-2 sm:px-0 sm:py-2 ms:px-4 ms:py-4 gap-3">
                  {/* channdel */}
                  <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black rounded-full p-4 w-5 h-5"></div>
                  {/* title */}
                  <div className="flex flex-col gap-2">
                    <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black rounded-sm h-5 w-[17rem]"></div>
                    <div className="shimmer bg-[#E3E3E3] dark:bg-icon_black rounded-sm h-5 w-[11rem]"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Shimmer;
