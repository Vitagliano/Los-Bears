import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { Popover, Transition } from "@headlessui/react";

import { toast } from "react-toastify";

import LosBearsAbi from "../contract/abis/LosBears.json";

import useWeb3 from "../hooks/useWeb3";
import { ethers } from "ethers";

// import Slides from "../components/Slides";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const MINT_PRICE = Number(process.env.NEXT_PUBLIC_MINT_PRICE);
const WHITELIST_MINT_PRICE = Number(process.env.NEXT_WHITELIST_MINT_PRICE);

function Index() {
  const { active, activate, deactivate, account, web3 } = useWeb3();

  const [contract, setContract] = useState(null);
  const [maxMintable, setmaxMintable] = useState(0);
  const [supply, setSupply] = useState(0);
  const [mintPrice, setMintPrice] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);

  const [mintQuantity, setMintQuantity] = useState(0);

  const [isWhitelisted, setIsWhiteListed] = useState(false);

  useEffect(() => {
    activate();
  }, []);

  useEffect(() => {
    setMintPrice(MINT_PRICE);

    if (active && web3) {
      let c = new ethers.Contract(
        contractAddress,
        LosBearsAbi,
        web3.getSigner(account)
      );

      setMintPrice(MINT_PRICE);
      setContract(c);
      c.totalSupply()
        .then((supply) => {
          setSupply(supply);
        })
        .catch((err) => {
          setSupply(0);
          setmaxMintable(0);
          setContract(null);
          toast.error("Check if you are using Fantom Network", {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            theme: "colored",
          });
        });

      c.maxMintable()
        .then((maxMintable) => {
          setmaxMintable(maxMintable);
        })
        .catch((err) => console.log(err));

      c.isWhitelisted(account)
        .then((isWhitelisted) => {
          setIsWhiteListed(isWhitelisted);
          setMintPrice(getMintPrice(isWhitelisted));
        })
        .catch((err) => console.log(err));
    }
  }, [active, web3]);

  function getMintPrice(isWhitelisted) {
    return isWhitelisted ? 7 : 7;
  }

  async function loadData() {
    let totalSupply = await contract.totalSupply();

    setSupply(totalSupply);

    contract
      .maxMintable()
      .then((maxMintable) => {
        setmaxMintable(maxMintable);
      })
      .catch((err) => console.log(err));
    contract
      .isWhitelisted(account)
      .then((isWhitelisted) => {
        setIsWhiteListed(isWhitelisted);
        setMintPrice(getMintPrice(isWhitelisted));
      })
      .catch((err) => console.log(err));
  }

  async function claim() {
    if (account) {
      setIsClaiming(true);
      setMintPrice(getMintPrice(false));
      let _price = ethers.utils.parseUnits(
        String(mintPrice * mintQuantity),
        18
      );

      const claimPromise = new Promise((resolve, reject) => {
        contract
          .claim(mintQuantity, {
            value: _price,
          })
          .then((receipt) => {
            console.log(receipt);
            setIsClaiming(false);
            loadData();

            const link = `https://ftmscan.com/tx/${receipt.transactionHash}`;

            resolve(link);
          })
          .catch((err) => {
            console.log("error", err);
            toast.error(err.data.message, {
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              theme: "colored",
            });
          });
      });

      toast.promise(claimPromise, {
        pending: "Claiming...",
        success: {
          render: (link) => `Claimed!`,
        },
        error: "Something went wrong... Try again!",
      });
    }
  }

  const changeQuantity = (operation) => {
    if (operation === "add") {
      if (mintQuantity < maxMintable) {
        setMintQuantity(mintQuantity + 1);
      }
    } else {
      if (mintQuantity > 0) {
        setMintQuantity(mintQuantity - 1);
      }
    }
  };

  return (
    <>
      <div className="px-6 sm:max-w-5xl mx-auto sm:h-screen">
        <Popover>
          <nav>
            <div className="flex justify-between items-center py-6 md:justify-between md:space-x-10">
              <div className="flex justify-start lg:w-0 lg:flex-1 cursor-pointer">
                <Link href="/">
                  <img src="./assets/logo.png" className="w-72" />
                </Link>
              </div>
              <div className="-mr-2 -my-2 md:hidden">
                <Popover.Button className="rounded-md p-2 bg-blue-100 inline-flex items-center justify-center text-gray-100 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-100">
                  <span className="sr-only">Abrir menu</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.28307 19L20 19M19.9996 12L4 12M20 5L12.9719 5"
                      stroke="#1B1B1B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </Popover.Button>
              </div>
              <Popover.Group
                as="nav"
                className="hidden items-center md:flex space-x-10"
              >
                <div className="flex flex-row">
                  <Link href="/about">
                    <button className="group flex items-center mr-6 transition-all duration-500 ease-in-out hover:bg-blue-200 rounded-2xl text-black py-3 px-6 font-bold text-base border-2 border-black leading-6">
                      About Us
                    </button>
                  </Link>
                  <Link href="/bears">
                    <button className="group flex items-center transition-all duration-500 ease-in-out hover:bg-blue-200 rounded-2xl text-black py-3 px-6 font-bold text-base border-2 border-black leading-6">
                      My Bears
                    </button>
                  </Link>
                </div>
                <button
                  className="bg-blue-100 hover:bg-blue-200 flex items-center transition-all duration-500 ease-in-out rounded-2xl text-black py-3 px-6 font-bold text-base border-2 leading-6"
                  onClick={() => activate()}
                >
                  {active ? (
                    account.substring(0, 6) +
                    "..." +
                    account.substring(account.length - 4, account.length)
                  ) : (
                    <>
                      <svg
                        className="mr-2"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.6531 17.0263L3.95839 17.3089L3.95839 17.3089L4.6531 17.0263ZM4.30609 11.3971L5.03006 11.593L4.30609 11.3971ZM19.6939 11.3971L18.9699 11.593L19.6939 11.3971ZM19.3469 17.0263L20.0416 17.3089V17.3089L19.3469 17.0263ZM14.0365 20.8418L13.9206 20.1008L14.0365 20.8418ZM9.96352 20.8418L10.0794 20.1008L9.96352 20.8418ZM8.65619 7.60213L8.50672 6.86718L8.65619 7.60213ZM15.3438 7.60213L15.4933 6.86718L15.4933 6.86718L15.3438 7.60213ZM9.21479 20.7247L9.0989 21.4657L9.21479 20.7247ZM4.74598 17.2546L5.44069 16.972L5.44069 16.972L4.74598 17.2546ZM14.7852 20.7247L14.9011 21.4657L14.7852 20.7247ZM19.254 17.2546L18.5593 16.972V16.972L19.254 17.2546ZM15.6199 7.65829L15.4705 8.39324L15.4705 8.39324L15.6199 7.65829ZM8.38009 7.65829L8.52956 8.39324L8.38009 7.65829ZM6.89397 7.43059C6.89397 7.84481 7.22976 8.18059 7.64397 8.18059C8.05819 8.18059 8.39397 7.84481 8.39397 7.43059H6.89397ZM7.64397 7.12771H6.89397H7.64397ZM16.356 7.12772H15.606H16.356ZM15.606 7.4306C15.606 7.84481 15.9418 8.1806 16.356 8.1806C16.7702 8.1806 17.106 7.84481 17.106 7.4306H15.606ZM10.8517 3.14126L10.6697 2.41368L10.6697 2.41368L10.8517 3.14126ZM13.1482 3.14126L13.3302 2.41368V2.41368L13.1482 3.14126ZM8.52956 8.39324L8.80567 8.33709L8.50672 6.86718L8.23062 6.92333L8.52956 8.39324ZM15.1943 8.33709L15.4705 8.39324L15.7694 6.92333L15.4933 6.86718L15.1943 8.33709ZM14.6693 19.9837L13.9206 20.1008L14.1523 21.5828L14.9011 21.4657L14.6693 19.9837ZM10.0794 20.1008L9.33068 19.9837L9.0989 21.4657L9.84762 21.5828L10.0794 20.1008ZM18.6522 16.7437L18.5593 16.972L19.9487 17.5373L20.0416 17.3089L18.6522 16.7437ZM5.44069 16.972L5.3478 16.7437L3.95839 17.3089L4.05128 17.5373L5.44069 16.972ZM5.34781 16.7437C4.67941 15.1008 4.56858 13.2988 5.03006 11.593L3.58212 11.2013C3.03465 13.2248 3.1667 15.363 3.95839 17.3089L5.34781 16.7437ZM18.9699 11.593C19.4314 13.2987 19.3206 15.1008 18.6522 16.7437L20.0416 17.3089C20.8333 15.363 20.9654 13.2248 20.4179 11.2012L18.9699 11.593ZM13.9206 20.1008C12.6486 20.2997 11.3514 20.2997 10.0794 20.1008L9.84762 21.5828C11.2732 21.8057 12.7268 21.8057 14.1523 21.5828L13.9206 20.1008ZM8.80567 8.33709C10.9118 7.90875 13.0882 7.90875 15.1943 8.33709L15.4933 6.86718C13.1899 6.39872 10.8101 6.39872 8.50672 6.86718L8.80567 8.33709ZM9.33068 19.9837C7.55628 19.7062 6.08366 18.5524 5.44069 16.972L4.05128 17.5373C4.90076 19.6253 6.82633 21.1102 9.0989 21.4657L9.33068 19.9837ZM14.9011 21.4657C17.1736 21.1102 19.0992 19.6253 19.9487 17.5373L18.5593 16.972C17.9163 18.5524 16.4437 19.7062 14.6693 19.9837L14.9011 21.4657ZM15.4705 8.39324C17.1912 8.7432 18.5368 9.99212 18.9699 11.593L20.4179 11.2012C19.8298 9.02766 18.0205 7.38115 15.7694 6.92333L15.4705 8.39324ZM8.23062 6.92333C5.97952 7.38115 4.17018 9.02766 3.58212 11.2013L5.03006 11.593C5.46317 9.99212 6.80883 8.7432 8.52956 8.39324L8.23062 6.92333ZM8.39397 7.43059V7.12771H6.89397V7.43059H8.39397ZM15.606 7.12772V7.4306H17.106V7.12772H15.606ZM11.0337 3.86884C11.6672 3.71039 12.3328 3.71039 12.9662 3.86884L13.3302 2.41368C12.4578 2.19544 11.5422 2.19544 10.6697 2.41368L11.0337 3.86884ZM17.106 7.12772C17.106 4.88982 15.535 2.96519 13.3302 2.41368L12.9662 3.86884C14.5399 4.2625 15.606 5.61508 15.606 7.12772H17.106ZM8.39397 7.12771C8.39397 5.61508 9.46002 4.2625 11.0337 3.86884L10.6697 2.41368C8.46497 2.96519 6.89397 4.88982 6.89397 7.12771H8.39397Z"
                          fill="#1B1B1B"
                        />
                        <path
                          d="M12 13.5L12 15.5"
                          stroke="#1B1B1B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      Connect
                    </>
                  )}
                </button>
              </Popover.Group>
            </div>
          </nav>

          <Transition
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
            >
              <div className="rounded-lg shadow-lg ring-1 ring-green-100 ring-opacity-5 bg-blue-100 divide-y-2 divide-gray-50">
                <div className="pt-5 pb-6 px-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href="/">
                        <img src="./assets/logo.png" className="w-64" />
                      </Link>
                    </div>
                    <div className="-mr-2">
                      <Popover.Button className="rounded-md p-2 inline-flex items-center justify-center text-gray-100 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-100">
                        <span className="sr-only">Fechar menu</span>
                        <svg
                          className="h-6 w-6"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.35288 8.95043C4.00437 6.17301 6.17301 4.00437 8.95043 3.35288C10.9563 2.88237 13.0437 2.88237 15.0496 3.35288C17.827 4.00437 19.9956 6.17301 20.6471 8.95044C21.1176 10.9563 21.1176 13.0437 20.6471 15.0496C19.9956 17.827 17.827 19.9956 15.0496 20.6471C13.0437 21.1176 10.9563 21.1176 8.95044 20.6471C6.17301 19.9956 4.00437 17.827 3.35288 15.0496C2.88237 13.0437 2.88237 10.9563 3.35288 8.95043Z"
                            stroke="#1B1B1B"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M13.7677 10.2322L10.2322 13.7677M13.7677 13.7677L10.2322 10.2322"
                            stroke="#1B1B1B"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </Popover.Button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <nav className="grid gap-y-4">
                      <Link href="/about">
                        <button className="group flex items-center transition-all duration-500 ease-in-out text-black font-bold text-base ">
                          About Us
                        </button>
                      </Link>
                      <Link href="/bears">
                        <button className="group flex items-center transition-all duration-500 ease-in-out text-black font-bold text-base ">
                          My Bears
                        </button>
                      </Link>

                      <button
                        className="bg-white hover:bg-blue-200 flex items-center transition-all duration-500 ease-in-out rounded-2xl text-black py-3 px-6 font-bold text-base border-2 leading-6"
                        onClick={() => activate()}
                      >
                        {active ? (
                          account.substring(0, 6) +
                          "..." +
                          account.substring(account.length - 4, account.length)
                        ) : (
                          <>
                            <svg
                              className="mr-2"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.6531 17.0263L3.95839 17.3089L3.95839 17.3089L4.6531 17.0263ZM4.30609 11.3971L5.03006 11.593L4.30609 11.3971ZM19.6939 11.3971L18.9699 11.593L19.6939 11.3971ZM19.3469 17.0263L20.0416 17.3089V17.3089L19.3469 17.0263ZM14.0365 20.8418L13.9206 20.1008L14.0365 20.8418ZM9.96352 20.8418L10.0794 20.1008L9.96352 20.8418ZM8.65619 7.60213L8.50672 6.86718L8.65619 7.60213ZM15.3438 7.60213L15.4933 6.86718L15.4933 6.86718L15.3438 7.60213ZM9.21479 20.7247L9.0989 21.4657L9.21479 20.7247ZM4.74598 17.2546L5.44069 16.972L5.44069 16.972L4.74598 17.2546ZM14.7852 20.7247L14.9011 21.4657L14.7852 20.7247ZM19.254 17.2546L18.5593 16.972V16.972L19.254 17.2546ZM15.6199 7.65829L15.4705 8.39324L15.4705 8.39324L15.6199 7.65829ZM8.38009 7.65829L8.52956 8.39324L8.38009 7.65829ZM6.89397 7.43059C6.89397 7.84481 7.22976 8.18059 7.64397 8.18059C8.05819 8.18059 8.39397 7.84481 8.39397 7.43059H6.89397ZM7.64397 7.12771H6.89397H7.64397ZM16.356 7.12772H15.606H16.356ZM15.606 7.4306C15.606 7.84481 15.9418 8.1806 16.356 8.1806C16.7702 8.1806 17.106 7.84481 17.106 7.4306H15.606ZM10.8517 3.14126L10.6697 2.41368L10.6697 2.41368L10.8517 3.14126ZM13.1482 3.14126L13.3302 2.41368V2.41368L13.1482 3.14126ZM8.52956 8.39324L8.80567 8.33709L8.50672 6.86718L8.23062 6.92333L8.52956 8.39324ZM15.1943 8.33709L15.4705 8.39324L15.7694 6.92333L15.4933 6.86718L15.1943 8.33709ZM14.6693 19.9837L13.9206 20.1008L14.1523 21.5828L14.9011 21.4657L14.6693 19.9837ZM10.0794 20.1008L9.33068 19.9837L9.0989 21.4657L9.84762 21.5828L10.0794 20.1008ZM18.6522 16.7437L18.5593 16.972L19.9487 17.5373L20.0416 17.3089L18.6522 16.7437ZM5.44069 16.972L5.3478 16.7437L3.95839 17.3089L4.05128 17.5373L5.44069 16.972ZM5.34781 16.7437C4.67941 15.1008 4.56858 13.2988 5.03006 11.593L3.58212 11.2013C3.03465 13.2248 3.1667 15.363 3.95839 17.3089L5.34781 16.7437ZM18.9699 11.593C19.4314 13.2987 19.3206 15.1008 18.6522 16.7437L20.0416 17.3089C20.8333 15.363 20.9654 13.2248 20.4179 11.2012L18.9699 11.593ZM13.9206 20.1008C12.6486 20.2997 11.3514 20.2997 10.0794 20.1008L9.84762 21.5828C11.2732 21.8057 12.7268 21.8057 14.1523 21.5828L13.9206 20.1008ZM8.80567 8.33709C10.9118 7.90875 13.0882 7.90875 15.1943 8.33709L15.4933 6.86718C13.1899 6.39872 10.8101 6.39872 8.50672 6.86718L8.80567 8.33709ZM9.33068 19.9837C7.55628 19.7062 6.08366 18.5524 5.44069 16.972L4.05128 17.5373C4.90076 19.6253 6.82633 21.1102 9.0989 21.4657L9.33068 19.9837ZM14.9011 21.4657C17.1736 21.1102 19.0992 19.6253 19.9487 17.5373L18.5593 16.972C17.9163 18.5524 16.4437 19.7062 14.6693 19.9837L14.9011 21.4657ZM15.4705 8.39324C17.1912 8.7432 18.5368 9.99212 18.9699 11.593L20.4179 11.2012C19.8298 9.02766 18.0205 7.38115 15.7694 6.92333L15.4705 8.39324ZM8.23062 6.92333C5.97952 7.38115 4.17018 9.02766 3.58212 11.2013L5.03006 11.593C5.46317 9.99212 6.80883 8.7432 8.52956 8.39324L8.23062 6.92333ZM8.39397 7.43059V7.12771H6.89397V7.43059H8.39397ZM15.606 7.12772V7.4306H17.106V7.12772H15.606ZM11.0337 3.86884C11.6672 3.71039 12.3328 3.71039 12.9662 3.86884L13.3302 2.41368C12.4578 2.19544 11.5422 2.19544 10.6697 2.41368L11.0337 3.86884ZM17.106 7.12772C17.106 4.88982 15.535 2.96519 13.3302 2.41368L12.9662 3.86884C14.5399 4.2625 15.606 5.61508 15.606 7.12772H17.106ZM8.39397 7.12771C8.39397 5.61508 9.46002 4.2625 11.0337 3.86884L10.6697 2.41368C8.46497 2.96519 6.89397 4.88982 6.89397 7.12771H8.39397Z"
                                fill="#1B1B1B"
                              />
                              <path
                                d="M12 13.5L12 15.5"
                                stroke="#1B1B1B"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                            Connect
                          </>
                        )}
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>

        <section>
          {/* <div className="container mx-auto flex flex-row justify-between pt-8 gap-4"> */}
          {/* <div className="container mx-auto grid grid-flow-row-dense sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 pt-8 gap-4"> */}
          <div className="container mx-auto lg:grid grid-cols-3 grid-rows-1 sm:flex pt-8 gap-4 bg-lightblue shadow-lg p-8 rounded-xl">
            <div className="row-span-2 col-span-0">
              <h1 className="text-4xl font-black leading-[3rem]">
                Mint Los Bears now
              </h1>
              <p className="leading-6 text-base font-semibold my-6">
                The Bears are unique generated from over 90 possible traits,
                including expression, headwear, objects and more.
              </p>

              <div className="border border-gray-300 bg-black font-bold text-white h-6 w-24 mb-6 rounded-full flex items-center justify-center">
                <span className="text-xs">MINT NOW</span>
              </div>
              {active ? (
                <div className="">
                  <div className="flex flex-row items-center mb-6">
                    <button
                      className="text-black bg-blue-100 px-6 py-2 rounded-2xl border-2 border-black font-bold text-base leading-6"
                      onClick={() => changeQuantity("subtract")}
                    >
                      -
                    </button>
                    <input
                      className="rounded-2xl border-2 px-6 py-2 border-black mx-2 w-36"
                      type="number"
                      placeholder="Bears quantity"
                      min="0"
                      value={mintQuantity}
                      onChange={(e) => setMintQuantity(e.target.value)}
                    />
                    <button
                      className="text-black bg-blue-100 px-6 py-2 rounded-2xl border-2 border-black font-bold text-base leading-6"
                      onClick={() => changeQuantity("add")}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={
                      `${mintQuantity === 0 ? "bg-blue-200" : "bg-blue-100"}` +
                      " transition-all duration-500 ease-in-out rounded-2xl text-black py-2 font-bold text-base w-72 border-2 border-black leading-6 disabled:cursor-disabled"
                    }
                    disabled={mintQuantity === 0}
                    onClick={claim}
                  >
                    {isClaiming
                      ? "Claiming..."
                      : `Claim (${mintQuantity * mintPrice} FTM)`}
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute flex items-center content-cente bg-opacity-70 backdrop-blur-xl leading-6 text-base font-semibold w-72 h-full justify-center">
                    Connect your wallet to claim
                  </div>

                  <div className="flex flex-row items-center mb-6">
                    <button
                      className="text-black bg-blue-100 px-6 py-2 rounded-2xl border-2 border-black font-bold text-base leading-6"
                      onClick={() => changeQuantity("subtract")}
                    >
                      -
                    </button>
                    <input
                      className="rounded-2xl border-2 px-6 py-2 border-black mx-2 w-36"
                      type="number"
                      placeholder="Bears quantity"
                      min="0"
                      value={0}
                      onChange={(e) => setMintQuantity(e.target.value)}
                    />
                    <button
                      className="text-black bg-blue-100 px-6 py-2 rounded-2xl border-2 border-black font-bold text-base leading-6"
                      onClick={() => changeQuantity("add")}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={[
                      `${
                        mintQuantity === 0
                          ? "bg-blue-200 hover:bg-gray-600"
                          : "bg-blue-100 hover:bg-blue-100"
                      }`,
                      "transition-all duration-500 ease-in-out rounded-2xl text-black py-2 hover:shadow-xl font-bold text-base w-72 border-2 border-black leading-6",
                    ]}
                    disabled={mintQuantity === 0}
                    onClick={claim}
                  >
                    Claim ${mintQuantity * mintPrice} FTM
                  </button>
                </div>
              )}
            </div>

            <div className="col-start-2 col-span-2 mt-4 sm:mt-4 md:mt-4 lg:mt-0">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 mb-8">
                <img
                  src="https://cdn.discordapp.com/attachments/948088404967579648/960591098793836564/65my4dts.gif"
                  alt="bear"
                  className="w-full rounded-xl"
                />
                <img
                  src="https://media.discordapp.net/attachments/948088404967579648/963512786191777862/y2fjf6ja.gif"
                  alt="bear"
                  className="w-full rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-4 col-span-2 sm:flex-row order-2 sm:order-6 justify-between">
                <div className="flex flex-row items-center p-4 rounded-2xl border-2 border-black">
                  <div className="flex flex-col">
                    <span className="font-bold text-xl">1.111</span>
                    <span className="text-sm"> Bears to be claim</span>
                  </div>
                </div>

                <div className="flex flex-row items-center p-4 rounded-2xl border-2 border-black">
                  <div className="flex flex-col">
                    <span className="font-bold py-2 sm:py-0 text-xl">
                      {mintPrice} FTM
                    </span>
                    <span className="text-sm">Mint price</span>
                  </div>
                </div>

                {active ? (
                  <>
                    <div className="flex flex-row items-center p-4 rounded-2xl border-2 border-black">
                      <div className="flex flex-col">
                        <span className="font-bold text-xl">
                          {maxMintable - supply}
                        </span>
                        <span className="text-sm">Bears available</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-row items-center p-4 rounded-2xl border-2 border-black">
                      <div className="flex flex-col">
                        <span className="font-bold text-xl">0</span>
                        <span className="text-sm">Bears available</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-col w-full items-center justify-center my-8">
          <div className="flex flex-row justify-center items-center mb-4">
            <a href="https://nftkey.app/collections/losbears/">
              <button className="mr-2 text-black hover:text-blue-100 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 focus:outline-none bg-white rounded-2xl p-2">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse
                    cx="19.9999"
                    cy="15.8"
                    rx="8"
                    ry="8"
                    transform="rotate(-90 19.9999 15.8)"
                    fill="black"
                  />
                  <circle
                    cx="20.0499"
                    cy="15.75"
                    r="3.25"
                    transform="rotate(-90 20.0499 15.75)"
                    fill="white"
                  />
                  <rect
                    x="22.8999"
                    y="23.2"
                    width="9"
                    height="5.8"
                    transform="rotate(90 22.8999 23.2)"
                    fill="black"
                  />
                </svg>
              </button>
            </a>
            <a href="https://twitter.com/LosBearsNFT">
              <button className="mr-2 text-black hover:text-blue-100 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 focus:outline-none bg-white rounded-2xl p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 "
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
            </a>
            <a href="https://discord.com/invite/URXdWPQBRR">
              <button className="mr-2 text-black hover:text-blue-100 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 focus:outline-none bg-white rounded-2xl p-2">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 640 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                </svg>
              </button>
            </a>
          </div>
          <p className="text-xs text-center w-9/12">
            Please make sure you are connected to the right network (Fantom
            Opera Mainnet) and the correct address.
            <br />
            Please note: Once you make the purchase, you cannot undo this
            action.
          </p>
          <p className="text-xs text-center w-9/12 mb-8">
            {" "}
            We have set the gas limit to 285000 for the contract to successfully
            mint your NFT. We recommend that you don't lower the gas limit.
          </p>
        </footer>
      </div>
    </>
  );
}

export default Index;
