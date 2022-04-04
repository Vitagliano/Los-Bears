import { ethers } from "ethers";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, Fragment } from "react";
import useBears from "../hooks/useBears";
import useWeb3 from "../hooks/useWeb3";
import { toast } from "react-toastify";
import Button from "../components/Button";
import { Popover, Transition } from "@headlessui/react"

export default function BearsPage() {
  const { active, activate, deactivate, account, web3 } = useWeb3();
  const { contract, getUserBears, getBearMetadata } = useBears(web3, account);

  const [userBears, setuserBears] = useState([]);
  const [bearSelected, setbearSelected] = useState(null);

  useEffect(() => {
    if (web3) {
      activate();
    }
  }, [web3]);

  useEffect(() => {
    if (contract && userBears.length === 0) {
      const getBearsPromise = new Promise((resolve, reject) => {
        getUserBears()
          .then((bears) => {
            if (bears) {
              Promise.all(
                bears.map((bear) =>
                  getBearMetadata(ethers.utils.formatUnits(bear, 0))
                )
              )
                .then((metadatas) => {
                  setuserBears(metadatas);
                  resolve();
                })
                .catch((error) => {
                  console.log(error);
                  reject();
                });
            } else {
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });

      toast.promise(getBearsPromise, {
        pending: "Loading Bears...",
        success: "Bears loaded",
        error: "Error loading Bears... Try again!",
      });
    }
  }, [contract]);

  const openBearDetails = (bear) => {
    setbearSelected(bear);
  };

  return (
    <div
      className={`pt-8 px-5 sm:max-w-5xl mx-auto sm:h-screen ${bearSelected != null ? "overflow-hidden" : ""
        }`}
    >
      <Popover>
        <nav>
          <div className="flex justify-between items-center py-6 md:justify-between md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/">
                <svg className="cursor-pointer" width="182" height="114" viewBox="0 0 562 304" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M33.12 135.84C33.696 135.84 54.432 135.552 54.72 135.264C55.008 134.976 55.296 85.152 55.296 81.696C75.744 29.568 86.112 2.78399 86.112 2.20798C86.112 1.34399 84.096 1.05597 75.168 1.05597C68.256 1.05597 65.952 1.05597 65.664 1.34399C65.088 1.91998 46.368 48.576 46.08 48.864C45.792 49.152 33.984 1.63198 33.12 0.767977C32.832 0.47998 31.68 0.47998 29.664 0.47998C26.496 0.47998 0.575974 0.767977 0.287974 1.05597C-2.61962e-05 1.91998 1.43997 4.79997 32.544 81.984C32.544 115.968 32.544 135.552 33.12 135.84Z" fill="#FFC800" />
                  <path d="M131.587 95.232C132.163 94.944 131.587 85.728 131.299 75.072C128.995 74.496 129.859 74.496 113.155 74.496C113.155 41.376 113.443 36.192 113.443 36.192C114.019 35.616 144.259 36.192 144.547 34.752C144.547 33.888 143.683 5.66398 143.683 2.49597C143.683 1.05597 143.395 0.47998 142.819 0.47998C137.635 0.47998 92.7067 1.05597 91.8427 1.63198C91.5547 1.91998 89.2507 140.16 89.2507 139.872H90.9787C100.483 139.872 141.379 138.144 141.379 138.144C141.955 137.856 141.667 120.864 141.667 119.136C124.387 119.136 131.011 119.136 113.155 118.848V98.112C113.731 98.112 131.011 95.808 131.587 95.232Z" fill="#FFC800" />
                  <path d="M154.253 135.552C154.253 135.552 187.661 136.128 215.885 136.128C215.885 115.392 215.597 115.104 214.733 114.816C213.581 114.24 179.885 113.664 179.597 113.664C179.597 113.376 181.325 20.64 181.613 0.47998C169.805 0.47998 153.389 0.767977 153.389 0.767977C153.101 1.05597 153.965 135.264 154.253 135.552Z" fill="#FFC800" />
                  <path d="M270.043 88.032C274.363 101.568 288.187 104.16 302.299 104.16C313.243 104.16 330.811 100.416 330.811 86.592C330.811 25.824 331.099 26.4 330.235 23.808C326.779 13.152 312.955 6.52797 299.131 6.52797C285.883 6.52797 272.635 12.864 269.755 27.84C268.315 33.6 269.179 84.864 270.043 88.032ZM231.739 4.79998C230.875 5.66398 229.723 136.992 230.011 137.568C230.011 137.568 231.451 137.856 234.043 137.856C253.051 137.856 331.387 135.264 331.387 135.264C331.963 134.688 332.827 108.48 332.251 107.904H330.523C319.867 107.904 263.995 111.36 258.523 111.36C258.235 93.792 257.659 7.39198 257.083 6.81598C256.507 6.23997 234.331 4.79998 231.739 4.79998ZM295.099 55.488C295.099 31.584 295.099 30.432 295.675 28.704C297.115 24.672 300.859 23.232 304.603 23.232C309.211 23.232 313.819 25.536 314.683 28.704C314.971 29.568 315.547 79.104 314.395 81.984C313.243 85.728 309.787 87.456 306.043 87.456C302.011 87.456 297.979 85.44 295.963 82.272C294.523 79.968 295.099 84.288 295.099 55.488Z" fill="#FFC800" />
                  <path d="M351.598 4.51198H337.774C337.486 4.79998 358.51 132.096 358.798 132.96C359.374 133.824 358.51 133.824 362.542 133.824H384.718C387.598 120.864 399.982 66.72 400.27 66.72C400.558 66.72 409.774 132.672 410.062 133.824C410.35 134.4 410.35 134.4 417.838 134.4C423.598 134.4 425.614 134.4 425.902 134.112C426.19 133.824 457.006 1.91998 456.142 1.05597C455.566 0.767977 453.55 0.47998 445.486 0.47998H436.558C434.83 0.47998 435.406 0.47998 435.118 1.34399C434.83 2.78399 421.87 74.208 421.582 74.496C421.582 74.496 410.638 15.456 410.35 15.168C408.334 15.168 394.51 15.168 393.646 16.032C393.358 16.608 376.942 74.784 376.942 74.784C376.654 74.784 366.286 5.37599 365.71 4.79998C365.422 4.51198 358.51 4.51198 351.598 4.51198Z" fill="#FFC800" />
                  <path d="M124.152 160.768C123.864 160.48 94.776 160.48 92.184 160.48C91.608 208.576 91.896 294.112 91.896 294.4C92.184 294.688 123.576 294.688 124.152 294.688C124.44 274.24 124.44 282.016 124.44 260.704C138.264 260.128 143.448 260.128 143.736 260.128C143.736 260.416 143.16 301.024 143.448 301.024C143.736 301.6 144.6 301.6 145.176 301.312C145.464 300.736 165.336 299.008 165.912 298.72C166.2 298.432 168.216 167.104 167.928 165.664C167.928 165.376 167.352 165.088 166.2 165.088C163.32 165.088 144.888 166.24 144.6 166.528C144.024 166.816 144.024 208 143.736 241.12H124.44C124.44 219.52 124.152 161.056 124.152 160.768Z" fill="#FFC800" />
                  <path d="M218.305 255.232C218.881 254.944 218.305 245.728 218.017 235.072C215.713 234.496 216.577 234.496 199.873 234.496C199.873 201.376 200.161 196.192 200.161 196.192C200.737 195.616 230.977 196.192 231.265 194.752C231.265 193.888 230.401 165.664 230.401 162.496C230.401 161.056 230.113 160.48 229.537 160.48C224.353 160.48 179.425 161.056 178.561 161.632C178.273 161.92 175.969 300.16 175.969 299.872H177.697C187.201 299.872 228.097 298.144 228.097 298.144C228.673 297.856 228.385 280.864 228.385 279.136C211.105 279.136 217.729 279.136 199.873 278.848V258.112C200.449 258.112 217.729 255.808 218.305 255.232Z" fill="#FFC800" />
                  <path d="M288.204 265.312C288.492 265.6 294.828 302.464 294.828 303.04C294.828 303.328 301.452 303.616 308.94 303.616C318.444 303.616 329.1 303.328 329.1 302.464C329.1 301.6 299.724 160.768 299.436 160.48C298.86 160.192 265.452 163.072 265.164 163.648C264.876 163.936 235.212 298.432 235.212 299.872C235.212 300.448 235.5 300.736 235.788 300.736C236.364 300.736 258.54 300.448 258.828 299.872C259.116 299.008 264.3 267.328 264.588 267.04C264.876 266.752 287.916 265.312 288.204 265.312ZM285.036 248.032C284.748 248.032 268.332 246.304 268.332 246.304C268.332 246.016 276.396 199.36 276.396 199.36C276.396 199.36 285.612 248.032 285.036 248.032Z" fill="#FFC800" />
                  <path d="M360.267 294.688C360.843 294.112 359.979 265.312 360.843 266.176C361.707 267.04 383.595 296.416 384.459 297.568C384.747 298.144 384.747 298.144 385.899 298.144C387.051 298.144 390.507 297.856 398.859 297.568C414.987 296.704 414.699 297.856 410.091 292.384L379.563 256.096C388.491 248.32 393.963 239.104 395.979 231.328C402.027 208.288 397.707 169.12 370.347 162.208C364.875 160.768 357.099 160.192 350.475 160.192C342.699 160.192 336.075 160.768 335.787 161.056C334.059 161.344 334.347 159.616 334.347 172.288C333.771 201.088 332.619 296.704 332.907 296.992H333.771C338.379 296.992 360.267 294.976 360.267 294.688ZM360.555 178.048C361.131 178.048 364.875 179.488 366.891 180.352C381.291 187.264 380.427 212.608 377.259 228.16C375.243 238.528 370.059 246.304 363.723 249.472C362.283 250.336 361.131 250.624 360.843 250.624C360.267 250.624 360.555 178.048 360.555 178.048Z" fill="#FFC800" />
                  <path d="M458.943 194.752C459.519 194.752 489.183 192.16 489.759 191.584C490.335 191.008 490.623 186.688 490.623 174.016C490.623 159.616 490.911 161.344 489.759 160.768C489.183 160.48 459.519 160.192 436.191 160.192C421.215 160.192 408.831 160.48 408.831 160.768C408.831 161.056 407.967 198.496 408.831 198.784C409.407 199.072 433.311 196.768 433.887 196.768C434.175 196.768 433.887 295.84 434.463 296.992C434.751 297.28 434.751 297.568 435.615 297.568C437.055 297.568 440.223 297.28 448.287 296.704C453.759 296.416 458.367 296.128 458.655 296.128C459.231 295.84 458.655 194.752 458.943 194.752Z" fill="#FFC800" />
                  <path d="M500.037 273.088C502.917 292.96 514.149 298.72 532.581 298.72C548.997 298.72 556.485 291.808 559.365 269.344C559.941 265.024 559.941 255.232 559.365 252.064C557.061 237.088 537.189 232.48 527.397 226.432C520.197 221.824 519.333 219.52 519.333 207.424C519.621 202.528 520.197 193.312 527.109 193.312C528.837 193.312 530.565 194.176 531.429 195.904C534.885 202.528 532.581 220.096 534.309 221.536C534.885 222.112 538.629 222.112 543.525 222.112C551.301 222.112 561.381 221.824 561.381 221.536C561.669 221.248 561.669 185.248 560.517 180.64C556.485 165.664 546.117 160.48 530.853 160.48C504.069 160.48 496.581 177.184 496.293 201.088C496.293 218.08 496.005 226.72 504.933 235.936C517.029 249.184 535.173 247.744 536.901 261.28C538.053 270.496 533.157 274.528 528.837 274.528C525.669 274.528 522.501 272.512 521.637 269.056C520.773 265.312 521.349 260.128 519.909 259.84C518.757 259.552 509.253 259.552 503.781 259.552H499.749C499.461 260.128 499.461 270.208 500.037 273.088Z" fill="#FFC800" />
                </svg>
              </Link>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <Popover.Button className="rounded-md p-2 bg-blue-100 inline-flex items-center justify-center text-gray-100 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-100">
                <span className="sr-only">Abrir menu</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.28307 19L20 19M19.9996 12L4 12M20 5L12.9719 5" stroke="#1B1B1B" strokeWidth="1.5" strokeLinecap="round" />
                </svg>

              </Popover.Button>
            </div>
            <Popover.Group as="nav" className="hidden items-center md:flex space-x-10">

              <div className="flex flex-row">
                <Link href="/about">
                  <button className="mr-6 hover:bg-blue-200 flex items-center transition-all duration-500 ease-in-out rounded-2xl text-black py-3 px-6 font-bold text-base border-2 leading-6">About Us</button>
                </Link>
                <Link href="/bears">
                  <button className="group flex items-center transition-all duration-500 ease-in-out hover:bg-blue-200 rounded-2xl text-black py-3 px-6 font-bold text-base border-2 border-black leading-6">
                    <svg className="stroke-transparent group-hover:stroke-blue-100" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.98389 11.6106L9.11798 18.5107C10.5955 20.4964 13.4045 20.4964 14.882 18.5107L20.0161 11.6106C21.328 9.84746 21.328 7.34218 20.0161 5.57906C18.0957 2.9981 13.6571 3.76465 12 6.54855C10.3429 3.76465 5.90428 2.9981 3.9839 5.57906C2.67204 7.34218 2.67203 9.84746 3.98389 11.6106Z" stroke="#1B1B1B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    My Bears
                  </button>
                </Link>
              </div>
              <button className="bg-blue-100 hover:bg-blue-200 flex items-center transition-all duration-500 ease-in-out rounded-2xl text-black py-3 px-6 font-bold text-base border-2 leading-6" onClick={() => activate()}>
                {active
                  ? account.substring(0, 6) +
                  "..." +
                  account.substring(account.length - 4, account.length)
                  : <>
                    <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.6531 17.0263L3.95839 17.3089L3.95839 17.3089L4.6531 17.0263ZM4.30609 11.3971L5.03006 11.593L4.30609 11.3971ZM19.6939 11.3971L18.9699 11.593L19.6939 11.3971ZM19.3469 17.0263L20.0416 17.3089V17.3089L19.3469 17.0263ZM14.0365 20.8418L13.9206 20.1008L14.0365 20.8418ZM9.96352 20.8418L10.0794 20.1008L9.96352 20.8418ZM8.65619 7.60213L8.50672 6.86718L8.65619 7.60213ZM15.3438 7.60213L15.4933 6.86718L15.4933 6.86718L15.3438 7.60213ZM9.21479 20.7247L9.0989 21.4657L9.21479 20.7247ZM4.74598 17.2546L5.44069 16.972L5.44069 16.972L4.74598 17.2546ZM14.7852 20.7247L14.9011 21.4657L14.7852 20.7247ZM19.254 17.2546L18.5593 16.972V16.972L19.254 17.2546ZM15.6199 7.65829L15.4705 8.39324L15.4705 8.39324L15.6199 7.65829ZM8.38009 7.65829L8.52956 8.39324L8.38009 7.65829ZM6.89397 7.43059C6.89397 7.84481 7.22976 8.18059 7.64397 8.18059C8.05819 8.18059 8.39397 7.84481 8.39397 7.43059H6.89397ZM7.64397 7.12771H6.89397H7.64397ZM16.356 7.12772H15.606H16.356ZM15.606 7.4306C15.606 7.84481 15.9418 8.1806 16.356 8.1806C16.7702 8.1806 17.106 7.84481 17.106 7.4306H15.606ZM10.8517 3.14126L10.6697 2.41368L10.6697 2.41368L10.8517 3.14126ZM13.1482 3.14126L13.3302 2.41368V2.41368L13.1482 3.14126ZM8.52956 8.39324L8.80567 8.33709L8.50672 6.86718L8.23062 6.92333L8.52956 8.39324ZM15.1943 8.33709L15.4705 8.39324L15.7694 6.92333L15.4933 6.86718L15.1943 8.33709ZM14.6693 19.9837L13.9206 20.1008L14.1523 21.5828L14.9011 21.4657L14.6693 19.9837ZM10.0794 20.1008L9.33068 19.9837L9.0989 21.4657L9.84762 21.5828L10.0794 20.1008ZM18.6522 16.7437L18.5593 16.972L19.9487 17.5373L20.0416 17.3089L18.6522 16.7437ZM5.44069 16.972L5.3478 16.7437L3.95839 17.3089L4.05128 17.5373L5.44069 16.972ZM5.34781 16.7437C4.67941 15.1008 4.56858 13.2988 5.03006 11.593L3.58212 11.2013C3.03465 13.2248 3.1667 15.363 3.95839 17.3089L5.34781 16.7437ZM18.9699 11.593C19.4314 13.2987 19.3206 15.1008 18.6522 16.7437L20.0416 17.3089C20.8333 15.363 20.9654 13.2248 20.4179 11.2012L18.9699 11.593ZM13.9206 20.1008C12.6486 20.2997 11.3514 20.2997 10.0794 20.1008L9.84762 21.5828C11.2732 21.8057 12.7268 21.8057 14.1523 21.5828L13.9206 20.1008ZM8.80567 8.33709C10.9118 7.90875 13.0882 7.90875 15.1943 8.33709L15.4933 6.86718C13.1899 6.39872 10.8101 6.39872 8.50672 6.86718L8.80567 8.33709ZM9.33068 19.9837C7.55628 19.7062 6.08366 18.5524 5.44069 16.972L4.05128 17.5373C4.90076 19.6253 6.82633 21.1102 9.0989 21.4657L9.33068 19.9837ZM14.9011 21.4657C17.1736 21.1102 19.0992 19.6253 19.9487 17.5373L18.5593 16.972C17.9163 18.5524 16.4437 19.7062 14.6693 19.9837L14.9011 21.4657ZM15.4705 8.39324C17.1912 8.7432 18.5368 9.99212 18.9699 11.593L20.4179 11.2012C19.8298 9.02766 18.0205 7.38115 15.7694 6.92333L15.4705 8.39324ZM8.23062 6.92333C5.97952 7.38115 4.17018 9.02766 3.58212 11.2013L5.03006 11.593C5.46317 9.99212 6.80883 8.7432 8.52956 8.39324L8.23062 6.92333ZM8.39397 7.43059V7.12771H6.89397V7.43059H8.39397ZM15.606 7.12772V7.4306H17.106V7.12772H15.606ZM11.0337 3.86884C11.6672 3.71039 12.3328 3.71039 12.9662 3.86884L13.3302 2.41368C12.4578 2.19544 11.5422 2.19544 10.6697 2.41368L11.0337 3.86884ZM17.106 7.12772C17.106 4.88982 15.535 2.96519 13.3302 2.41368L12.9662 3.86884C14.5399 4.2625 15.606 5.61508 15.606 7.12772H17.106ZM8.39397 7.12771C8.39397 5.61508 9.46002 4.2625 11.0337 3.86884L10.6697 2.41368C8.46497 2.96519 6.89397 4.88982 6.89397 7.12771H8.39397Z" fill="#1B1B1B" />
                      <path d="M12 13.5L12 15.5" stroke="#1B1B1B" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Connect
                  </>
                }
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
          <Popover.Panel focus className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
            <div className="rounded-lg shadow-lg ring-1 ring-green-100 ring-opacity-5 bg-blue-100 divide-y-2 divide-gray-50">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Link href="/">

                      <svg width="182" height="114" viewBox="0 0 562 304" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M33.12 135.84C33.696 135.84 54.432 135.552 54.72 135.264C55.008 134.976 55.296 85.152 55.296 81.696C75.744 29.568 86.112 2.78399 86.112 2.20798C86.112 1.34399 84.096 1.05597 75.168 1.05597C68.256 1.05597 65.952 1.05597 65.664 1.34399C65.088 1.91998 46.368 48.576 46.08 48.864C45.792 49.152 33.984 1.63198 33.12 0.767977C32.832 0.47998 31.68 0.47998 29.664 0.47998C26.496 0.47998 0.575974 0.767977 0.287974 1.05597C-2.62838e-05 1.91998 1.43997 4.79997 32.544 81.984C32.544 115.968 32.544 135.552 33.12 135.84Z" fill="#1B1B1B" />
                        <path d="M131.587 95.232C132.163 94.944 131.587 85.728 131.299 75.072C128.995 74.496 129.859 74.496 113.155 74.496C113.155 41.376 113.443 36.192 113.443 36.192C114.019 35.616 144.259 36.192 144.547 34.752C144.547 33.888 143.683 5.66398 143.683 2.49597C143.683 1.05597 143.395 0.47998 142.819 0.47998C137.635 0.47998 92.7067 1.05597 91.8427 1.63198C91.5547 1.91998 89.2507 140.16 89.2507 139.872H90.9787C100.483 139.872 141.379 138.144 141.379 138.144C141.955 137.856 141.667 120.864 141.667 119.136C124.387 119.136 131.011 119.136 113.155 118.848V98.112C113.731 98.112 131.011 95.808 131.587 95.232Z" fill="#1B1B1B" />
                        <path d="M154.253 135.552C154.253 135.552 187.661 136.128 215.885 136.128C215.885 115.392 215.597 115.104 214.733 114.816C213.581 114.24 179.885 113.664 179.597 113.664C179.597 113.376 181.325 20.64 181.613 0.47998C169.805 0.47998 153.389 0.767977 153.389 0.767977C153.101 1.05597 153.965 135.264 154.253 135.552Z" fill="#1B1B1B" />
                        <path d="M270.043 88.032C274.363 101.568 288.187 104.16 302.299 104.16C313.243 104.16 330.811 100.416 330.811 86.592C330.811 25.824 331.099 26.4 330.235 23.808C326.779 13.152 312.955 6.52798 299.131 6.52798C285.883 6.52798 272.635 12.864 269.755 27.84C268.315 33.6 269.179 84.864 270.043 88.032ZM231.739 4.79999C230.875 5.66399 229.723 136.992 230.011 137.568C230.011 137.568 231.451 137.856 234.043 137.856C253.051 137.856 331.387 135.264 331.387 135.264C331.963 134.688 332.827 108.48 332.251 107.904H330.523C319.867 107.904 263.995 111.36 258.523 111.36C258.235 93.792 257.659 7.39199 257.083 6.81599C256.507 6.23998 234.331 4.79999 231.739 4.79999ZM295.099 55.488C295.099 31.584 295.099 30.432 295.675 28.704C297.115 24.672 300.859 23.232 304.603 23.232C309.211 23.232 313.819 25.536 314.683 28.704C314.971 29.568 315.547 79.104 314.395 81.984C313.243 85.728 309.787 87.456 306.043 87.456C302.011 87.456 297.979 85.44 295.963 82.272C294.523 79.968 295.099 84.288 295.099 55.488Z" fill="#1B1B1B" />
                        <path d="M351.598 4.51198H337.774C337.486 4.79998 358.51 132.096 358.798 132.96C359.374 133.824 358.51 133.824 362.542 133.824H384.718C387.598 120.864 399.982 66.72 400.27 66.72C400.558 66.72 409.774 132.672 410.062 133.824C410.35 134.4 410.35 134.4 417.838 134.4C423.598 134.4 425.614 134.4 425.902 134.112C426.19 133.824 457.006 1.91998 456.142 1.05597C455.566 0.767977 453.55 0.47998 445.486 0.47998H436.558C434.83 0.47998 435.406 0.47998 435.118 1.34399C434.83 2.78399 421.87 74.208 421.582 74.496C421.582 74.496 410.638 15.456 410.35 15.168C408.334 15.168 394.51 15.168 393.646 16.032C393.358 16.608 376.942 74.784 376.942 74.784C376.654 74.784 366.286 5.37599 365.71 4.79998C365.422 4.51198 358.51 4.51198 351.598 4.51198Z" fill="#1B1B1B" />
                        <path d="M124.152 160.768C123.864 160.48 94.776 160.48 92.184 160.48C91.608 208.576 91.896 294.112 91.896 294.4C92.184 294.688 123.576 294.688 124.152 294.688C124.44 274.24 124.44 282.016 124.44 260.704C138.264 260.128 143.448 260.128 143.736 260.128C143.736 260.416 143.16 301.024 143.448 301.024C143.736 301.6 144.6 301.6 145.176 301.312C145.464 300.736 165.336 299.008 165.912 298.72C166.2 298.432 168.216 167.104 167.928 165.664C167.928 165.376 167.352 165.088 166.2 165.088C163.32 165.088 144.888 166.24 144.6 166.528C144.024 166.816 144.024 208 143.736 241.12H124.44C124.44 219.52 124.152 161.056 124.152 160.768Z" fill="#1B1B1B" />
                        <path d="M218.305 255.232C218.881 254.944 218.305 245.728 218.017 235.072C215.713 234.496 216.577 234.496 199.873 234.496C199.873 201.376 200.161 196.192 200.161 196.192C200.737 195.616 230.977 196.192 231.265 194.752C231.265 193.888 230.401 165.664 230.401 162.496C230.401 161.056 230.113 160.48 229.537 160.48C224.353 160.48 179.425 161.056 178.561 161.632C178.273 161.92 175.969 300.16 175.969 299.872H177.697C187.201 299.872 228.097 298.144 228.097 298.144C228.673 297.856 228.385 280.864 228.385 279.136C211.105 279.136 217.729 279.136 199.873 278.848V258.112C200.449 258.112 217.729 255.808 218.305 255.232Z" fill="#1B1B1B" />
                        <path d="M288.204 265.312C288.492 265.6 294.828 302.464 294.828 303.04C294.828 303.328 301.452 303.616 308.94 303.616C318.444 303.616 329.1 303.328 329.1 302.464C329.1 301.6 299.724 160.768 299.436 160.48C298.86 160.192 265.452 163.072 265.164 163.648C264.876 163.936 235.212 298.432 235.212 299.872C235.212 300.448 235.5 300.736 235.788 300.736C236.364 300.736 258.54 300.448 258.828 299.872C259.116 299.008 264.3 267.328 264.588 267.04C264.876 266.752 287.916 265.312 288.204 265.312ZM285.036 248.032C284.748 248.032 268.332 246.304 268.332 246.304C268.332 246.016 276.396 199.36 276.396 199.36C276.396 199.36 285.612 248.032 285.036 248.032Z" fill="#1B1B1B" />
                        <path d="M360.267 294.688C360.843 294.112 359.979 265.312 360.843 266.176C361.707 267.04 383.595 296.416 384.459 297.568C384.747 298.144 384.747 298.144 385.899 298.144C387.051 298.144 390.507 297.856 398.859 297.568C414.987 296.704 414.699 297.856 410.091 292.384L379.563 256.096C388.491 248.32 393.963 239.104 395.979 231.328C402.027 208.288 397.707 169.12 370.347 162.208C364.875 160.768 357.099 160.192 350.475 160.192C342.699 160.192 336.075 160.768 335.787 161.056C334.059 161.344 334.347 159.616 334.347 172.288C333.771 201.088 332.619 296.704 332.907 296.992H333.771C338.379 296.992 360.267 294.976 360.267 294.688ZM360.555 178.048C361.131 178.048 364.875 179.488 366.891 180.352C381.291 187.264 380.427 212.608 377.259 228.16C375.243 238.528 370.059 246.304 363.723 249.472C362.283 250.336 361.131 250.624 360.843 250.624C360.267 250.624 360.555 178.048 360.555 178.048Z" fill="#1B1B1B" />
                        <path d="M458.943 194.752C459.519 194.752 489.183 192.16 489.759 191.584C490.335 191.008 490.623 186.688 490.623 174.016C490.623 159.616 490.911 161.344 489.759 160.768C489.183 160.48 459.519 160.192 436.191 160.192C421.215 160.192 408.831 160.48 408.831 160.768C408.831 161.056 407.967 198.496 408.831 198.784C409.407 199.072 433.311 196.768 433.887 196.768C434.175 196.768 433.887 295.84 434.463 296.992C434.751 297.28 434.751 297.568 435.615 297.568C437.055 297.568 440.223 297.28 448.287 296.704C453.759 296.416 458.367 296.128 458.655 296.128C459.231 295.84 458.655 194.752 458.943 194.752Z" fill="#1B1B1B" />
                        <path d="M500.037 273.088C502.917 292.96 514.149 298.72 532.581 298.72C548.997 298.72 556.485 291.808 559.365 269.344C559.941 265.024 559.941 255.232 559.365 252.064C557.061 237.088 537.189 232.48 527.397 226.432C520.197 221.824 519.333 219.52 519.333 207.424C519.621 202.528 520.197 193.312 527.109 193.312C528.837 193.312 530.565 194.176 531.429 195.904C534.885 202.528 532.581 220.096 534.309 221.536C534.885 222.112 538.629 222.112 543.525 222.112C551.301 222.112 561.381 221.824 561.381 221.536C561.669 221.248 561.669 185.248 560.517 180.64C556.485 165.664 546.117 160.48 530.853 160.48C504.069 160.48 496.581 177.184 496.293 201.088C496.293 218.08 496.005 226.72 504.933 235.936C517.029 249.184 535.173 247.744 536.901 261.28C538.053 270.496 533.157 274.528 528.837 274.528C525.669 274.528 522.501 272.512 521.637 269.056C520.773 265.312 521.349 260.128 519.909 259.84C518.757 259.552 509.253 259.552 503.781 259.552H499.749C499.461 260.128 499.461 270.208 500.037 273.088Z" fill="#1B1B1B" />
                      </svg>

                    </Link>
                  </div>
                  <div className="-mr-2">
                    <Popover.Button className="rounded-md p-2 inline-flex items-center justify-center text-gray-100 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-100">
                      <span className="sr-only">Fechar menu</span>
                      <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.35288 8.95043C4.00437 6.17301 6.17301 4.00437 8.95043 3.35288C10.9563 2.88237 13.0437 2.88237 15.0496 3.35288C17.827 4.00437 19.9956 6.17301 20.6471 8.95044C21.1176 10.9563 21.1176 13.0437 20.6471 15.0496C19.9956 17.827 17.827 19.9956 15.0496 20.6471C13.0437 21.1176 10.9563 21.1176 8.95044 20.6471C6.17301 19.9956 4.00437 17.827 3.35288 15.0496C2.88237 13.0437 2.88237 10.9563 3.35288 8.95043Z" stroke="#1B1B1B" strokeWidth="1.5" />
                        <path d="M13.7677 10.2322L10.2322 13.7677M13.7677 13.7677L10.2322 10.2322" stroke="#1B1B1B" strokeWidth="1.5" strokeLinecap="round" />
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

                    <button className="bg-white hover:bg-blue-200 flex items-center transition-all duration-500 ease-in-out rounded-2xl text-black py-3 px-6 font-bold text-base border-2 leading-6" onClick={() => activate()}>
                      {active
                        ? account.substring(0, 6) +
                        "..." +
                        account.substring(account.length - 4, account.length)
                        : <>
                          <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.6531 17.0263L3.95839 17.3089L3.95839 17.3089L4.6531 17.0263ZM4.30609 11.3971L5.03006 11.593L4.30609 11.3971ZM19.6939 11.3971L18.9699 11.593L19.6939 11.3971ZM19.3469 17.0263L20.0416 17.3089V17.3089L19.3469 17.0263ZM14.0365 20.8418L13.9206 20.1008L14.0365 20.8418ZM9.96352 20.8418L10.0794 20.1008L9.96352 20.8418ZM8.65619 7.60213L8.50672 6.86718L8.65619 7.60213ZM15.3438 7.60213L15.4933 6.86718L15.4933 6.86718L15.3438 7.60213ZM9.21479 20.7247L9.0989 21.4657L9.21479 20.7247ZM4.74598 17.2546L5.44069 16.972L5.44069 16.972L4.74598 17.2546ZM14.7852 20.7247L14.9011 21.4657L14.7852 20.7247ZM19.254 17.2546L18.5593 16.972V16.972L19.254 17.2546ZM15.6199 7.65829L15.4705 8.39324L15.4705 8.39324L15.6199 7.65829ZM8.38009 7.65829L8.52956 8.39324L8.38009 7.65829ZM6.89397 7.43059C6.89397 7.84481 7.22976 8.18059 7.64397 8.18059C8.05819 8.18059 8.39397 7.84481 8.39397 7.43059H6.89397ZM7.64397 7.12771H6.89397H7.64397ZM16.356 7.12772H15.606H16.356ZM15.606 7.4306C15.606 7.84481 15.9418 8.1806 16.356 8.1806C16.7702 8.1806 17.106 7.84481 17.106 7.4306H15.606ZM10.8517 3.14126L10.6697 2.41368L10.6697 2.41368L10.8517 3.14126ZM13.1482 3.14126L13.3302 2.41368V2.41368L13.1482 3.14126ZM8.52956 8.39324L8.80567 8.33709L8.50672 6.86718L8.23062 6.92333L8.52956 8.39324ZM15.1943 8.33709L15.4705 8.39324L15.7694 6.92333L15.4933 6.86718L15.1943 8.33709ZM14.6693 19.9837L13.9206 20.1008L14.1523 21.5828L14.9011 21.4657L14.6693 19.9837ZM10.0794 20.1008L9.33068 19.9837L9.0989 21.4657L9.84762 21.5828L10.0794 20.1008ZM18.6522 16.7437L18.5593 16.972L19.9487 17.5373L20.0416 17.3089L18.6522 16.7437ZM5.44069 16.972L5.3478 16.7437L3.95839 17.3089L4.05128 17.5373L5.44069 16.972ZM5.34781 16.7437C4.67941 15.1008 4.56858 13.2988 5.03006 11.593L3.58212 11.2013C3.03465 13.2248 3.1667 15.363 3.95839 17.3089L5.34781 16.7437ZM18.9699 11.593C19.4314 13.2987 19.3206 15.1008 18.6522 16.7437L20.0416 17.3089C20.8333 15.363 20.9654 13.2248 20.4179 11.2012L18.9699 11.593ZM13.9206 20.1008C12.6486 20.2997 11.3514 20.2997 10.0794 20.1008L9.84762 21.5828C11.2732 21.8057 12.7268 21.8057 14.1523 21.5828L13.9206 20.1008ZM8.80567 8.33709C10.9118 7.90875 13.0882 7.90875 15.1943 8.33709L15.4933 6.86718C13.1899 6.39872 10.8101 6.39872 8.50672 6.86718L8.80567 8.33709ZM9.33068 19.9837C7.55628 19.7062 6.08366 18.5524 5.44069 16.972L4.05128 17.5373C4.90076 19.6253 6.82633 21.1102 9.0989 21.4657L9.33068 19.9837ZM14.9011 21.4657C17.1736 21.1102 19.0992 19.6253 19.9487 17.5373L18.5593 16.972C17.9163 18.5524 16.4437 19.7062 14.6693 19.9837L14.9011 21.4657ZM15.4705 8.39324C17.1912 8.7432 18.5368 9.99212 18.9699 11.593L20.4179 11.2012C19.8298 9.02766 18.0205 7.38115 15.7694 6.92333L15.4705 8.39324ZM8.23062 6.92333C5.97952 7.38115 4.17018 9.02766 3.58212 11.2013L5.03006 11.593C5.46317 9.99212 6.80883 8.7432 8.52956 8.39324L8.23062 6.92333ZM8.39397 7.43059V7.12771H6.89397V7.43059H8.39397ZM15.606 7.12772V7.4306H17.106V7.12772H15.606ZM11.0337 3.86884C11.6672 3.71039 12.3328 3.71039 12.9662 3.86884L13.3302 2.41368C12.4578 2.19544 11.5422 2.19544 10.6697 2.41368L11.0337 3.86884ZM17.106 7.12772C17.106 4.88982 15.535 2.96519 13.3302 2.41368L12.9662 3.86884C14.5399 4.2625 15.606 5.61508 15.606 7.12772H17.106ZM8.39397 7.12771C8.39397 5.61508 9.46002 4.2625 11.0337 3.86884L10.6697 2.41368C8.46497 2.96519 6.89397 4.88982 6.89397 7.12771H8.39397Z" fill="#1B1B1B" />
                            <path d="M12 13.5L12 15.5" stroke="#1B1B1B" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          Connect
                        </>
                      }
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>

      {active
        ?
        <>
          <div className="py-5">
            <h1 className="text-xl sm:text-3xl mt-8 font-extrabold text-blue-200 mb-6">
              My Bears
            </h1>
            <ul className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {userBears.map((bear) => {
                if (!bear) return null;
                console.log('coração', bear)
                return (
                  <li key={bear.name} className="flex flex-col items-center justify-center">
                    <button type="button" onClick={() => openBearDetails(bear)}>
                      <img
                        src={bear.image.replace(
                          "ipfs://",
                          "https://cloudflare-ipfs.com/ipfs/"
                        )}
                        alt={bear.name}
                        className="w-60 h-60 rounded-xl mb-6"
                      />
                      <span className="font-bold py-2">{bear.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          {bearSelected != null && (
            <div
              className="bg-semitransparent backdrop-blur-xl w-full h-screen absolute top-0 left-0 right-0 flex items-center justify-center"
              onClick={() => setbearSelected(null)}
            >
              <div
                className="w-3/4 h-3/4 rounded-xl bg-white shadow-2xl p-5 flex flex-row "
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={bearSelected.image.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  )}
                  alt={bearSelected.name}
                  className="w-96 h-96 mx-auto rounded-xl"
                />
                <div className="w-2/4 p-5">
                  <h2 className="font-extrabold text-xl pb-5">
                    {bearSelected.name}
                  </h2>
                  <table className="w-full">
                    <tr>
                      <th className="text-left">Attribute</th>
                      <th className="text-left">Value</th>
                      <th className="text-left">Rarity</th>
                    </tr>
                    {bearSelected.attributes.map((attr) => {
                      return (
                        <tr>
                          <td>{attr.trait_type}</td>
                          <td>{attr.value}</td>
                          <td>Soon!</td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
              </div>
            </div>

          )}
        </>
        : <>
          <h1 className="text-xl sm:text-3xl mt-8 text-center font-extrabold text-black mb-4">
            Connect your wallet to see your bears
          </h1>
        </>
      }
    </div>
  );
}