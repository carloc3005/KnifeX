import React, { useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';
import StickerRoulette from '../components/StickerRoulette'; // Import the StickerRoulette component

/* ------------------------------------------------------------------
   1.  CASE‑LIST CONSTANTS  (arrays make reuse inside the map easy)
------------------------------------------------------------------------*/
const ARMS_DEAL_CASES = [
  'CS:GO Weapon Case', 'CS:GO Weapon Case 2', 'CS:GO Weapon Case 3',
  'eSports 2013 Case', 'eSports 2013 Winter Case', 'eSports 2014 Summer Case',
  'Operation Bravo Case', 'Operation Phoenix Case', 'Winter Offensive Case',
  'Operation Vanguard Case', 'Revolver Case',
  'Chroma Case', 'Chroma 2 Case', 'Chroma 3 Case',
  'Gamma Case',  'Gamma 2 Case',
  'Spectrum Case', 'Spectrum 2 Case'
];

const HUNTSMAN_EXTRA = [
  'Prisma Case', 'Prisma 2 Case',
  'Fracture Case', 'Operation Riptide Case',
  'Dreams & Nightmares Case', 'Kilowatt Case'
];

const HORIZON_FAMILY = ['Horizon Case', 'Danger Zone Case', 'Prisma Case', 'Prisma 2 Case'];

// New constants based on the provided table
const BAYONET_CASES_FROM_TABLE = ['CS:GO Weapon Case', 'CS:GO Weapon Case 2', 'CS:GO Weapon Case 3', 'Operation Bravo Case', 'Winter Offensive Case', 'eSports 2013 Case', 'eSports 2013 Winter Case', 'eSports 2014 Summer Case', 'Operation Phoenix Case', 'Operation Vanguard Case', 'Revolver Case'];
const M9_BAYONET_CASES_FROM_TABLE = ['Chroma Case', 'Chroma 2 Case', 'Chroma 3 Case', 'Gamma Case', 'Gamma 2 Case'];
const KARAMBIT_CASES_FROM_TABLE = ['CS:GO Weapon Case', 'CS:GO Weapon Case 2', 'CS:GO Weapon Case 3', 'Operation Bravo Case', 'Winter Offensive Case', 'Chroma Case', 'Chroma 2 Case', 'Chroma 3 Case', 'Gamma Case', 'Gamma 2 Case', 'Revolver Case'];
const FLIP_KNIFE_CASES_FROM_TABLE = ['CS:GO Weapon Case', 'Operation Bravo Case', 'Winter Offensive Case', 'Chroma Case', 'Chroma 2 Case', 'Chroma 3 Case', 'Gamma Case', 'Gamma 2 Case', 'Revolver Case'];
const GUT_KNIFE_CASES_FROM_TABLE = ['CS:GO Weapon Case', 'Operation Bravo Case', 'Winter Offensive Case', 'Chroma Case', 'Chroma 2 Case', 'Chroma 3 Case', 'Gamma Case', 'Gamma 2 Case', 'Revolver Case'];
const HUNTSMAN_CASES_FROM_TABLE = ['Huntsman Weapon Case', 'Spectrum Case', 'Spectrum 2 Case', 'Operation Riptide Case'];

/* ------------------------------------------------------------------
   NEW: DESCRIPTIVE CASE SOURCES FROM THE USER'S TABLE
------------------------------------------------------------------------*/
const KNIFE_CASE_DESCRIPTIONS_FROM_TABLE = {
  'Bayonet': "CS:GO Weapon Case #1, Weapon Case #2 & #3, Operation Bravo, Winter Offensive, eSports 2013 Case, Operation Phoenix, Operation Vanguard, Revolver",
  'M9 Bayonet': "CS:GO Weapon Case #1 plus all Chroma & Gamma family cases",
  'Karambit': "CS:GO Weapon Case #1, Weapon Case #2 & #3, Operation Bravo, Winter Offensive, Chroma 1‑3, Gamma 1‑2, Revolver",
  'Flip Knife': "CS:GO Weapon Case #1, Operation Bravo, Winter Offensive, Chroma 1‑3, Gamma 1‑2, Revolver",
  'Gut Knife': "CS:GO Weapon Case #1, Operation Bravo, Winter Offensive, Chroma 1‑3, Gamma 1‑2, Revolver",
  'Butterfly Knife': "Operation Breakout Weapon Case, Spectrum 1 & 2, Operation Riptide",
  'Huntsman Knife': "Huntsman Weapon Case, Spectrum 1 & 2, Operation Riptide",
  'Falchion Knife': "Falchion Case, Spectrum 1 & 2, Operation Riptide",
  'Shadow Daggers': "Shadow Case, Spectrum 1 & 2, Operation Riptide",
  'Bowie Knife': "Operation Wildfire Case, Spectrum 1 & 2, Operation Riptide",
  'Navaja Knife': "Horizon Case, Danger Zone, Prisma 1 & 2",
  'Stiletto Knife': "Horizon Case, Danger Zone, Prisma 1 & 2",
  'Talon Knife': "Horizon Case, Danger Zone, Prisma 1 & 2",
  'Ursus Knife': "Horizon Case, Danger Zone, Prisma 1 & 2",
  'Classic Knife': "CS20 Case 20-year anniversary case",
};

/* ------------------------------------------------------------------
   2.  MODEL → CASE MAP  (authoritative for the classic 15 knives + Kukri)
------------------------------------------------------------------------*/
const GENERAL_ITEM_TYPE_CASE_SOURCES = {
  /* Arms‑Deal classics, updated per table */
  'Bayonet'    : BAYONET_CASES_FROM_TABLE,
  'Flip Knife' : FLIP_KNIFE_CASES_FROM_TABLE, // Updated to table
  'Gut Knife'  : GUT_KNIFE_CASES_FROM_TABLE,
  'Karambit'   : KARAMBIT_CASES_FROM_TABLE,
  'M9 Bayonet' : M9_BAYONET_CASES_FROM_TABLE,

  /* Huntsman, updated per table */
  'Huntsman Knife' : HUNTSMAN_CASES_FROM_TABLE,

  /* Butterfly (matches table) */
  'Butterfly Knife' : ['Operation Breakout Weapon Case', 'Spectrum Case', 'Spectrum 2 Case', 'Operation Riptide Case'],

  /* Falchion (matches table) */
  'Falchion Knife'  : ['Falchion Case', 'Spectrum Case', 'Spectrum 2 Case', 'Operation Riptide Case'],

  /* Shadow Daggers (matches table) */
  'Shadow Daggers'  : ['Shadow Case', 'Spectrum Case', 'Spectrum 2 Case', 'Operation Riptide Case'],

  /* Bowie (matches table) */
  'Bowie Knife'     : ['Operation Wildfire Case', 'Spectrum Case', 'Spectrum 2 Case', 'Operation Riptide Case'],

  /* Horizon family (matches table) */
  'Ursus Knife'     : HORIZON_FAMILY,
  'Navaja Knife'    : HORIZON_FAMILY,
  'Stiletto Knife'  : HORIZON_FAMILY,
  'Talon Knife'     : HORIZON_FAMILY,

  /* Classic (matches table) */
  'Classic Knife'   : ['CS20 Case'],

  /* CS2 era (not in table, keeping as is) */
  'Kukri Knife'     : ['Kilowatt Case']
};

/* ------------------------------------------------------------------
   3.  DATA HOOK – scans /assets/knives/**//*.png once and builds cards
------------------------------------------------------------------------*/
const useKnivesData = () => {
  const raw = useMemo(
    () => import.meta.glob('../assets/knives/**/*.png', { eager: true }),
    []
  );

  return useMemo(() => {
    let nextId = 1;

    return Object.entries(raw).flatMap(([path, mod]) => {
      /* grab folder and file */
      const m = path.match(/knives\/([^/]+)\/([^/]+)\.png$/i);
      if (!m) return [];

      let [, folder, file] = m;

      /* title‑case helpers */
      const toTitle = s => s.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      /* normalise itemType from folder name */
      let itemType = toTitle(folder);
      if (itemType === 'M9 Knife') itemType = 'M9 Bayonet';
      if (itemType === 'Sd Knife') itemType = 'Shadow Daggers';

      /* finish name from file name - handle lowercase with dashes */
      const fileNameWithoutExt = file.replace(/\.(png|jpg|jpeg)$/i, '');
      const prefix = folder.toLowerCase().replace(/\s+/g, '');
      const finishName = fileNameWithoutExt
        .replace(new RegExp(`^${prefix}-`, 'i'), '') // Remove prefix (e.g., "gut-")
        .replace(/-/g, ' ') // Replace dashes with spaces
        .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word

      /* valid case list lookup */
      let source;
      const descriptiveSource = KNIFE_CASE_DESCRIPTIONS_FROM_TABLE[itemType];

      if (descriptiveSource) {
        source = descriptiveSource;
      } else {
        // Fallback to existing logic for items not in the descriptive table (e.g., Kukri Knife)
        const cases = GENERAL_ITEM_TYPE_CASE_SOURCES[itemType] || [];
        if (cases.length === 0) {
          source = 'Unknown Case';
        } else if (cases.length === 1) {
          source = cases[0];
        } else if (cases.length === 2) {
          source = `${cases[0]} and ${cases[1]}`;
        } else { // cases.length > 2
          // For items not in the descriptive table but with multiple cases,
          // retain previous random selection behavior.
          source = cases[Math.floor(Math.random() * cases.length)];
        }
      }

      /* vite gives either { default } or string */
      const img = typeof mod === 'string' ? mod : mod.default;

      /* misc randoms for demo */
      const priceHigh = +(Math.random()*3900 + 100).toFixed(2);
      const priceLow  = +(priceHigh * (Math.random()*0.6 + 0.4)).toFixed(2);

      return [{
        id: nextId++,
        itemType,
        finishName,
        imageUrl: img,
        quality: ['Covert Knife','Classified Knife','Restricted Knife','Mil‑Spec Grade Knife'][Math.floor(Math.random()*4)],
        statTrak: Math.random() > 0.6 ? 'StatTrak Available' : null,
        priceHigh,
        priceLow,
        source,
        marketOffers: `${Math.floor(Math.random()*1800)+50} offers on ${Math.floor(Math.random()*20)+5} markets`
      }];
    });
  }, [raw]);
};

/* ------------------------------------------------------------------
   4.  MAIN COMPONENT
------------------------------------------------------------------------*/
const ITEMS_PER_PAGE = 12;

const Knives = () => {
  const knives = useKnivesData();

  /* UI state */
  const [currentPage, setCurrentPage] = useState(0); // react-paginate uses 0-indexed pages
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');

  const knifeTypes = useMemo(
    () => ['All', ...new Set(knives.map(k => k.itemType))],
    [knives]
  );

  /* filter + paginate */
  const filtered = useMemo(() => knives
      .filter(k => type === 'All' || k.itemType === type)
      .filter(k => (k.itemType + ' ' + k.finishName).toLowerCase().includes(search.toLowerCase()))
  , [knives, type, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const offset = currentPage * ITEMS_PER_PAGE;
  const visible = filtered.slice(offset, offset + ITEMS_PER_PAGE);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  /* ----------------------------------------------------------------*/
  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
      <div className="container mx-auto">

        {/* ---- Sticker Roulette ---- */}
        <StickerRoulette />

        {/* ---- header ---- */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Knives</h1>
        </header>

        {/* ---- search + filter ---- */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-gray-800 rounded-lg shadow-xl">
          <input
            className="flex-grow p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-sky-500 shadow-md"
            placeholder="Search knives…"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(0); }}
          />

          <select
            className="p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-sky-500 shadow-md w-full md:w-auto md:min-w-[200px]"
            value={type}
            onChange={e => { setType(e.target.value); setCurrentPage(0); }}
          >
            {knifeTypes.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* ---- grid ---- */}
        {visible.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {visible.map(k => (
              <div key={k.id} className="bg-gray-800 rounded-lg shadow-xl flex flex-col">
                <div className="p-4 text-center">
                  <h3 className="text-sm text-gray-400">{k.itemType}</h3>
                  <h2 className="text-lg font-bold">{k.finishName}</h2>
                  <div className="mt-2 inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                    {k.quality}
                  </div>
                  {k.statTrak && (
                    <div className="mt-1 inline-block bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                      {k.statTrak}
                    </div>
                  )}
                </div>

                <img src={k.imageUrl} alt={`${k.itemType} ${k.finishName}`} className="w-full h-56 object-contain" />

                <div className="p-4 mt-auto text-center">
                  <p className="font-bold">${k.priceLow} – ${k.priceHigh}</p>
                  <p className="text-xs text-gray-500 truncate">{k.source}</p>
                </div>

                <div className="bg-gray-700 p-2 text-center text-xs text-sky-400 font-semibold">
                  {k.marketOffers}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-xl mt-12">
            {knives.length ? 'No knives match your criteria.' : 'Loading knives…'}
          </p>
        )}

        {/* ---- pagination ---- */}
        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={'‹'}
            nextLabel={'›'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'mt-12 flex justify-center items-center gap-4 list-none'}
            pageClassName={'px-3 py-2 bg-gray-700 rounded-lg'}
            pageLinkClassName={'text-white'}
            previousClassName={'px-3 py-2 bg-gray-700 rounded-lg'}
            previousLinkClassName={'text-white'}
            nextClassName={'px-3 py-2 bg-gray-700 rounded-lg'}
            nextLinkClassName={'text-white'}
            breakClassName={'px-3 py-2 text-gray-400'}
            breakLinkClassName={'text-gray-400'}
            activeClassName={'ring-2 ring-sky-500 bg-sky-600'}
            disabledClassName={'opacity-40 cursor-not-allowed'}
            forcePage={currentPage}
          />
        )}
      </div>
    </div>
  );
};

export default Knives;
