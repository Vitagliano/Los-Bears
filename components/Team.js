import React from "react";
import Link from "next/link";
function Team() {
  const teamList = [
    {
      name: "Biagio",
      image:
        "https://media.discordapp.net/attachments/948088404967579648/963514241858547712/58.png",
      role: "Developer and Advisor",
    },
    {
      name: "Nikolas",
      image:
        "https://media.discordapp.net/attachments/948088404967579648/963514316257116181/15.png",
      role: "Artist and Developer",
    },
    {
      name: "Kinash",
      image:
        "https://media.discordapp.net/attachments/948088404967579648/963544733685276773/unknown.png",
      role: "Developer",
    },
    {
      name: "Vitagliano",
      image:
        "https://media.discordapp.net/attachments/948088404967579648/963515653048901672/unknown.png",
      role: "Web Developer",
    },
  ];
  return (
    <div className="pt-16 px-8 sm:max-w-5xl mx-auto">
      <div className="">
        <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-black pb-8">
          Team
        </h1>
      </div>
      <div className="flex items-center justify-between mt-10 mx-auto sm:mb-10 mb-16">
        <div className="grid overflow-hidden lg:grid-cols-4 lg:grid-rows-2 gap-6 lg:grid-flow-row">
          {teamList.map((team, index) => (
            <div
              key={index}
              className="w-full flex items-center justify-center"
            >
              <div className="w-full ">
                <div className="w-full flex justify-center items-center flex-col rounded-md">
                  <div className="bg-grey-100 rounded-md">
                    <div
                      style={{
                        "background-image": `url('` + team.image + `');`,
                      }}
                      className="w-52 h-52 relative bg-cover flex justify-center flex-col rounded-md "
                    >
                      <h1 className="bg-white text-black font-semibold text-left absolute top-6 left-0 px-2 py-1 text-lg ml-7 rounded-md ">
                        {team.name}
                      </h1>
                      <div className="absolute ml-7 bottom-7 bg-white text-black font-semibold  p-1 text-sm rounded-md ">
                        <p>{team.role} </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Team;
