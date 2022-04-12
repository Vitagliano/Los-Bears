import React from "react";
import Link from "next/link";

const AboutUs = () => {
  return (
    <div className="px-8 sm:max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-col justify-between xmt-8">
        <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-black pb-8">
          Roadmap
        </h1>

        <img
          src="https://cdn.discordapp.com/attachments/948088404967579648/963512291813371954/roadmap.png"
          className="rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default AboutUs;
