import React from "react";
import Link from "next/link";

const AboutUs = () => {
  return (
    <>
      <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-black pb-8">
        Roadmap
      </h1>

      <div className="container mx-auto w-full h-full">
        <div className="relative wrap overflow-hidden p-10 h-full">
          <div
            className="border-2-2 absolute border-opacity-20 border-black h-full border"
            style={{ left: 50 + "%" }}
          ></div>
          <div className="mb-12 flex justify-between items-center w-full right-timeline">
            <div className="order-1 w-5/12"></div>
            <div className="z-20 flex items-center order-1 bg-white shadow-xl w-12 h-12 rounded-full">
              <h1 className="mx-auto font-semibold text-lg text-black ">50%</h1>
            </div>
            <div className="order-1 bg-white rounded-lg shadow-xl w-5/12 px-6 py-4">
              <h3 className="mb-3 font-bold text-black text-xl">
                50% Minted: FTM Raffle to Holders
              </h3>
              <p className="text-sm leading-snug tracking-wide text-gray-900 text-opacity-100">
                As soon as the mint sale is greater than 50%, we will do a FTM
                raffle with all our holders
              </p>
            </div>
          </div>

          <div className="mb-12 flex justify-between flex-row-reverse items-center w-full left-timeline">
            <div className="order-1 w-5/12"></div>
            <div className="z-20 flex items-center order-1 bg-white shadow-xl w-12 h-12 rounded-full">
              <h1 className="mx-auto font-semibold text-lg text-black">75%</h1>
            </div>
            <div className="order-1 bg-white rounded-lg shadow-xl w-5/12 px-6 py-4">
              <h3 className="mb-3 font-bold text-black text-xl">
                75% Minted: Bears Raffle
              </h3>
              <p className="text-sm leading-snug tracking-wide text-gray-900 text-opacity-100">
                We will do a raffle of 5 Los Bears to all our holders
                <br />
                Drops range from common to legendary
              </p>
            </div>
          </div>

          <div className="mb-12 flex justify-between items-center w-full right-timeline">
            <div className="order-1 w-5/12"></div>
            <div className="z-20 flex items-center order-1 bg-white shadow-xl w-12 h-12 rounded-full">
              <h1 className="mx-auto font-semibold text-lg text-black">100%</h1>
            </div>
            <div className="order-1 bg-white rounded-lg shadow-xl w-5/12 px-6 py-4">
              <h3 className="mb-3 font-bold text-black text-xl">
                100% Minted: Donations for a good cause
              </h3>
              <p className="text-sm leading-snug tracking-wide text-gray-900 text-opacity-100">
                We will donate $1111 to build 5 water pumps.
                <br />
                Each of these can supply 5-7 people with water for over 7 years
              </p>
            </div>
          </div>

          <div className="flex justify-between flex-row-reverse items-center w-full left-timeline">
            <div className="order-1 w-5/12"></div>
            <div className="z-20 flex items-center order-1 bg-white shadow-xl w-12 h-12 rounded-full">
              <h1 className="mx-auto font-semibold text-lg text-black">+</h1>
            </div>
            <div className="order-1 bg-white rounded-lg shadow-xl w-5/12 px-6 py-4">
              <h3 className="mb-3 font-bold text-black text-xl">
                For the future
              </h3>
              <p className="text-sm leading-snug tracking-wide text-gray-900 text-opacity-100">
                We will have a second collection and all holders with 2 or more
                Los Bears will receive a free airdrop and whitelist
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
