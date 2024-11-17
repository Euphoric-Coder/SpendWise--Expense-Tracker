import React from 'react'
import { ContainerScroll } from './ui/container-scroll-animation'
import Image from 'next/image';

const AnimatedScrollDashboardImg = () => {
  return (
    <div className="">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-yellow-500 to-red-500">
              Empower Your Financial Journey with AI-Driven <br />
              <span className="text-4xl sm:text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 font-bold mt-2 leading-none">
                Personal Finance Advisor
              </span>
            </h1>
            <p className="text-md mb-6 sm:text-xl md:text-2xl mt-4 text-gray-700 dark:text-gray-300 font-mono font-semibold text-center">
              Leverage Finora, our advanced AI, to transform the way you manage
              your money. From real-time expense tracking and automated
              budgeting to personalized financial insights, Finora adapts to
              your spending patterns and goals. It identifies trends, predicts
              future expenses, and provides actionable recommendations to
              optimize your finances. Make smarter, faster decisions with the
              power of Finora&apos;s intelligent algorithms designed to simplify your
              financial journey.
            </p>
          </>
        }
      >
        <Image
          src={`/dashboard.png`}
          alt="hero"
          height={820}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

export default AnimatedScrollDashboardImg