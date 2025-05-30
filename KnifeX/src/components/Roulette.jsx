import React, { useState, useEffect, useRef } from 'react';

// Import all case images from src/assets/cases/
import chromaCase from '../assets/cases/chroma-case.png';
import chroma2Case from '../assets/cases/chroma2-case.png';
import chroma3Case from '../assets/cases/chroma3-case.png';
import clutchCase from '../assets/cases/clutch-case.png';
import cs20Case from '../assets/cases/cs20-case.png';
import dangerzoneCase from '../assets/cases/dangerzone-case.png';
import dreamsNightmaresCase from '../assets/cases/dreams&nightmares-case.png';
import falchionCase from '../assets/cases/falchion-case.png';
import feverCase from '../assets/cases/fever-case.png';
import fractureCase from '../assets/cases/fracture-case.png';
import galleryCase from '../assets/cases/gallery-case.png';
import gammaCase from '../assets/cases/gamma-case.png';
import gamma2Case from '../assets/cases/gamma2-case.png';
import gloveCase from '../assets/cases/glove-case.png';
import horizonCase from '../assets/cases/horizon-case.png';
import huntsmanweaponCase from '../assets/cases/huntsmanweapon-case.png';
import kilowattCase from '../assets/cases/kilowatt-case.png';
import operationBreakoutCase from '../assets/cases/operationbreakout-case.png';
import operationBrokenFangCase from '../assets/cases/operationbrokenfang-case.png';
import operationHydraCase from '../assets/cases/operationhydra-case.png';
import operationPhoenixCase from '../assets/cases/operationphoenix-case.png';
import operationRiptideCase from '../assets/cases/operationriptide-case.png';
import operationVanguardCase from '../assets/cases/operationvanguard-case.png';
import operationWildfireCase from '../assets/cases/operationwildfire-case.png';
import prismaCase from '../assets/cases/prisma-case.png';
import recoilCase from '../assets/cases/recoil-case.png'; 
import revolutionCase from '../assets/cases/revolution-case.png';
import revolverCase from '../assets/cases/revolver-case.png';
import shadowCase from '../assets/cases/shadow-case.png';
import shatteredWebCase from '../assets/cases/shatteredweb-case.png';
import snakebiteCase from '../assets/cases/snakebite-case.png';
import spectrumCase from '../assets/cases/spectrum-case.png';
import spectrum2Case from '../assets/cases/spectrum2-case.png';
import winterOffenseCase from '../assets/cases/winteroffense-case.png';

const cases = [
  { name: 'Chroma Case', image: chromaCase },
  { name: 'Chroma 2 Case', image: chroma2Case },
  { name: 'Chroma 3 Case', image: chroma3Case },
  { name: 'Clutch Case', image: clutchCase },
  { name: 'CS20 Case', image: cs20Case },
  { name: 'Danger Zone Case', image: dangerzoneCase },
  { name: 'Dreams & Nightmares Case', image: dreamsNightmaresCase },
  { name: 'Falchion Case', image: falchionCase },
  { name: 'Fever Case', image: feverCase },
  { name: 'Fracture Case', image: fractureCase },
  { name: 'Gallery Case', image: galleryCase },
  { name: 'Gamma Case', image: gammaCase },
  { name: 'Gamma 2 Case', image: gamma2Case },
  { name: 'Glove Case', image: gloveCase },
  { name: 'Horizon Case', image: horizonCase },
  { name: 'Huntsman Weapon Case', image: huntsmanweaponCase },
  { name: 'Kilowatt Case', image: kilowattCase },
  { name: 'Operation Breakout Case', image: operationBreakoutCase },
  { name: 'Operation Broken Fang Case', image: operationBrokenFangCase },
  { name: 'Operation Hydra Case', image: operationHydraCase },
  { name: 'Operation Phoenix Case', image: operationPhoenixCase },
  { name: 'Operation Riptide Case', image: operationRiptideCase },
  { name: 'Operation Vanguard Case', image: operationVanguardCase },
  { name: 'Operation Wildfire Case', image: operationWildfireCase },
  { name: 'Prisma Case', image: prismaCase },
  { name: 'Recoil Case', image: recoilCase },
  { name: 'Revolution Case', image: revolutionCase },
  { name: 'Revolver Case', image: revolverCase },
  { name: 'Shadow Case', image: shadowCase },
  { name: 'Shattered Web Case', image: shatteredWebCase },
  { name: 'Snakebite Case', image: snakebiteCase },
  { name: 'Spectrum Case', image: spectrumCase },
  { name: 'Spectrum 2 Case', image: spectrum2Case },
  { name: 'Winter Offense Case', image: winterOffenseCase },
];

const ROULETTE_ITEM_CONTENT_WIDTH = 96; 
const ROULETTE_ITEM_MARGIN_X = 4; 
const ROULETTE_ITEM_FULL_WIDTH = ROULETTE_ITEM_CONTENT_WIDTH + (ROULETTE_ITEM_MARGIN_X * 2); 

const Roulette = () => {
  const [spinning, setSpinning] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [rouletteItems, setRouletteItems] = useState([]);
  const rouletteStripRef = useRef(null); // Ref for the roulette strip

  useEffect(() => {
    // Create a shuffled list of unique cases
    const shuffledUniqueCases = [...cases].sort(() => Math.random() - 0.5);

    const items = [];
    // Repeat the shuffled unique sequence to make the roulette strip long enough
    // Ensure at least 5 full sets of unique items, or enough to make about 150-200 items total for smooth animation.
    const MIN_REPETITIONS = 5;
    const repetitions = Math.max(MIN_REPETITIONS, Math.ceil(150 / (cases.length || 1))); // Avoid division by zero if cases is empty

    for (let i = 0; i < repetitions; i++) {
      items.push(...shuffledUniqueCases);
    }
    setRouletteItems(items);
  }, []); // Re-run if cases array itself was a prop and changed. Here it's module-level.

  const startSpin = () => {
    if (spinning || !rouletteStripRef.current) return;
    setSpinning(true);
    setSelectedCase(null);

    const winnerIndexInCases = Math.floor(Math.random() * cases.length);
    const winner = cases[winnerIndexInCases];

    // Find a suitable target index in the long rouletteItems list
    // Aim for an item far enough to allow for a visual spin
    let targetStopIndex = -1;
    // Prefer an index towards the latter part of the strip for the "spin past" effect
    const preferredStartIndex = Math.floor(rouletteItems.length * 0.7); 
    for (let i = preferredStartIndex; i < rouletteItems.length; i++) {
      if (rouletteItems[i].name === winner.name) {
        targetStopIndex = i;
        break;
      }
    }
    // Fallback if not found in preferred range (should be rare with shuffled long list)
    if (targetStopIndex === -1) {
      targetStopIndex = rouletteItems.findIndex((item, index) => index > 30 && item.name === winner.name);
    }
    if (targetStopIndex === -1) { // Should ideally not happen
      targetStopIndex = Math.min(Math.floor(rouletteItems.length / 2), rouletteItems.length -1);
    }
    

    const rouletteStrip = rouletteStripRef.current;
    const containerWidth = rouletteStrip.parentElement.offsetWidth;
    
    // Calculate the final translateX to center the targetStopIndex item
    // finalTranslateX = (viewport_center) - (item_center_in_strip)
    // item_center_in_strip = (targetStopIndex * ROULETTE_ITEM_FULL_WIDTH) + (ROULETTE_ITEM_FULL_WIDTH / 2)
    // viewport_center = containerWidth / 2
    const finalTranslateX = (containerWidth / 2) - (targetStopIndex * ROULETTE_ITEM_FULL_WIDTH + ROULETTE_ITEM_FULL_WIDTH / 2);

    // For RTL item movement (visual items move from right to left), strip moves left.
    // So, initial X must be to the right of final X.
    const spinAnimationDistance = Math.max(3000, containerWidth * 3); // Spin at least 3000px or 3 container widths
    const initialAnimatedFromX = finalTranslateX + spinAnimationDistance; // Changed - to +

    // 1. Jump to initial position without transition
    rouletteStrip.style.transition = 'none';
    rouletteStrip.style.transform = `translateX(${initialAnimatedFromX}px)`;

    // 2. Force reflow/repaint to apply the transform before re-enabling transitions
    // One way to force reflow: access offsetWidth
    void rouletteStrip.offsetWidth;

    // 3. Set up the transition and animate to the final position
    rouletteStrip.style.transition = `transform 4000ms cubic-bezier(0.25, 0.1, 0.25, 1)`; // Using a common ease-out like curve
    rouletteStrip.style.transform = `translateX(${finalTranslateX}px)`;

    setTimeout(() => {
      setSpinning(false);
      setSelectedCase(winner);
    }, 4000); // Duration of the spin animation
  };

  const closeModal = () => {
    setSelectedCase(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-8 p-6 bg-slate-900 rounded-lg shadow-2xl">
      <div className="overflow-hidden relative h-60 border-2 border-emerald-500 rounded-md">
        {/* Pointer */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10 h-full w-1.5 bg-emerald-400"
          style={{ boxShadow: '0 0 8px #34D399, 0 0 16px #34D399' }} // emerald-400 glow
        ></div>

        <div
          ref={rouletteStripRef}
          id="roulette-strip"
          className="flex" // Transition properties will be set by JavaScript
          style={{ transform: 'translateX(0px)' }} // Initial position before any spin
        >
          {rouletteItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-56 flex flex-col items-center justify-center p-3 bg-slate-800 rounded-md" /* Increased height, new bg, padding */
              style={{ width: `${ROULETTE_ITEM_CONTENT_WIDTH}px`, margin: `0 ${ROULETTE_ITEM_MARGIN_X}px` }}
            >
              <img src={item.image} alt={item.name} className="h-36 object-contain" /> {/* Increased image height */}
              <p className="text-xs text-slate-300 text-center mt-2 font-medium w-full px-1 break-words">{item.name.replace(' Case', '').replace(' Weapon Case', '')}</p> {/* Adjusted text style */}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={startSpin}
        disabled={spinning}
        className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg text-lg disabled:bg-slate-600 disabled:text-slate-400 transition duration-150 ease-in-out"
      >
        {spinning ? 'Spinning...' : 'Spin to Win!'}
      </button>
      {selectedCase && !spinning && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
          <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl text-center max-w-md w-full transform transition-all duration-300 ease-in-out scale-100 opacity-100">
            <h3 className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-4">Congratulations!</h3>
            <p className="text-lg sm:text-xl text-slate-300 mb-2">You've unboxed:</p>
            <p className="text-xl sm:text-2xl font-semibold text-white mb-5">{selectedCase.name}</p>
            <img
              src={selectedCase.image}
              alt={selectedCase.name}
              className="h-36 sm:h-40 w-auto object-contain mx-auto my-4 rounded-md"
            />
            <button
              onClick={closeModal}
              className="mt-6 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roulette;
