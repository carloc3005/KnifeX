import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center">About KnifeX</h1>
        <p className="text-lg mb-6">
          Welcome to KnifeX, your premier destination for trading Counter-Strike 2 (CS2) knives. Our platform is built by enthusiasts, for enthusiasts, with the goal of providing a safe, secure, and user-friendly environment for trading virtual blades.
        </p>
        <p className="text-lg mb-6">
          At KnifeX, we understand the passion and dedication that goes into curating a collection of CS2 knives. Whether you're looking to trade up for that dream knife, find a specific pattern, or simply explore the market, our platform is designed to make the process as seamless as possible.
        </p>
        <p className="text-lg mb-6">
          Our mission is to connect CS2 players from all over the world, fostering a vibrant community built on trust and fair trading. We leverage robust technology to ensure the security of your trades and provide a transparent marketplace.
        </p>
        <p className="text-lg mb-6">
          We are constantly working to improve KnifeX, adding new features and listening to community feedback to make this the best possible platform for CS2 knife trading.
        </p>
        <p className="text-lg">
          Thank you for choosing KnifeX. Happy trading!
        </p>
      </div>
    </div>
  );
};

export default About;