import React, { useState, useEffect } from 'react';

// Import all sticker images (same as StickerRoulette)
import sticker10YearBirthday from '../assets/stickers/10yearbirthday-sticker-capsule.png';
import sticker2021Community from '../assets/stickers/2021-community-capsule.png';
import stickerAmbush from '../assets/stickers/ambush-capsule.png';
import stickerAntwerpChallengers2022 from '../assets/stickers/antwerp-challengers-2022-capsule.png';
import stickerAntwerpContenders2022 from '../assets/stickers/antwerp-contenders-2022-capsule.png';
import stickerAntwerpLegends2024 from '../assets/stickers/antwerp-legends-2024-capsule.png';
import stickerAustinChallengers2025 from '../assets/stickers/austin-challengers-2025-capsule.png';
import stickerAustinContenders2025 from '../assets/stickers/austin-contenders-2025-capsule.png';
import stickerAustinLegends2025 from '../assets/stickers/austin-legends-2025-capsule.png';
import stickerBattlefield2042 from '../assets/stickers/battlefield2042-capsule.png';
import stickerBerlinLegends2019 from '../assets/stickers/berlin-legends-2019-capsule.png';
import stickerBerlinMinorChallengers2019 from '../assets/stickers/berlin-minor-challengers-2019-capsule.png';
import stickerBerlinReturnChallengersHoloFoil2019 from '../assets/stickers/berlin-returnchallengers(holo-foil)-2019-capsule.png?url';
import stickerBestiary from '../assets/stickers/bestiary-capsule.png';
import stickerBrokenFang from '../assets/stickers/brokenfang-capsule.png';
import stickerChicken from '../assets/stickers/chicken-capsule.png';
import stickerCologneChallengers2016 from '../assets/stickers/cologne-challengers-2016-capsule.png';
import stickerCommunity2018 from '../assets/stickers/community-2018-capsule.png';
import stickerCommunity1 from '../assets/stickers/community1-capsule.png';
import stickerCopenhagenChallengers2024 from '../assets/stickers/copenhagen-challengers-2024-capsule.png';
import stickerCopenhagenLegends2024 from '../assets/stickers/copenhagen-legends-2024-capsule.png';
import stickerCoppenhagenContenders2024 from '../assets/stickers/coppenhagen-contenders-2024-capsule.png';
import stickerCs20 from '../assets/stickers/cs20-capsule.png';
import stickerDreamhackLegendsFoil2015 from '../assets/stickers/dreamhack-legends(foil)-2015-capsule.png?url';
import stickerDreamhackLegends2015 from '../assets/stickers/dreamhack-legends-2015-capsule.png';
import stickerEnfu from '../assets/stickers/enfu-capsule.png';
import stickerEslLegends2014 from '../assets/stickers/esl-legends-2014-capsule.png';
import stickerEslOneCologneLegendsFoil2015 from '../assets/stickers/esl-onecolgne-legends(foil)-2015-capsule.png?url';
import stickerEslOneCologne2014 from '../assets/stickers/esl-onecologne-2014-capsule.png';
import stickerEslOneKatowice2015 from '../assets/stickers/esl-onekatowice-2015-capsule.png';
import stickerEspionage from '../assets/stickers/espionage-sticker-capsule.png';
import stickerFeralPredators from '../assets/stickers/feralpredators-capsule.png';
import stickerHalfLifeAlyx from '../assets/stickers/halflifealyx-capsule.png';
import stickerHalo from '../assets/stickers/halo-capsule.png';
import stickerKatowice2019 from '../assets/stickers/katowice-2019-capsule.png';
import stickerKatowice2019ChallengersHoloFoil2019 from '../assets/stickers/katowice-2019-challengers(holo-foil)-2019-capsule.png?url';
import stickerKatowiceReturningChallengersHoloFoil2019 from '../assets/stickers/katowice-returningchallengers(holo-foil)-2019-capsule.png?url';
import stickerKrakowChallengers2017 from '../assets/stickers/krakow-challengers-2017-capsule.png';
import stickerKrakowLegendsHoloFoil2017 from '../assets/stickers/krakow-legends(holo-foil)-2017-capsule.png?url';
import stickerLondonLegends2018 from '../assets/stickers/london-legends-2018-capsule.png';
import stickerLondonMinorChallengersHoloFoil2018 from '../assets/stickers/london-minorchallengers(holo-foil)-2018-capsule.png?url';
import stickerLondonReturningChallengersHoloFoil2018 from '../assets/stickers/london-returningchallengers(holo-foil)-2018-capsule.png?url';
import stickerMlgColumbusChallengers2016 from '../assets/stickers/mlg-columbus-challengers-2016-capsule.png';
import stickerOperationRiptide from '../assets/stickers/operationriptide-capsule.png';
import stickerParisChallenger2023 from '../assets/stickers/paris-challenger-2023-capsule.png';
import stickerParisContendersParis2023 from '../assets/stickers/paris-contenders-paris-2023-capsule.png';
import stickerParisLegends2023 from '../assets/stickers/paris-legends-2023-capsule.png';
import stickerPerfectWorld1 from '../assets/stickers/perfectworld1-capsule.png';
import stickerPerfectWorld2Base from '../assets/stickers/perfectworld2-base-capsule.png';
import stickerPerfectWorld2 from '../assets/stickers/perfectworld2-capsule.png';
import stickerPinups from '../assets/stickers/pinups-capsule.png';
import stickerPoorlyDrawn from '../assets/stickers/poorlydrawn-capsule.png';
import stickerRecoil from '../assets/stickers/recoil-capsule.png';
import stickerRioChallengers2022 from '../assets/stickers/rio-challengers-2022-capsule.png';
import stickerRioContenders2022 from '../assets/stickers/rio-contenders-2022-capsule.png';
import stickerRioLegends2022 from '../assets/stickers/rio-legends-2022-capsule.png';
import stickerRmrChallengers2020 from '../assets/stickers/rmr-challengers-2020-capsule.png';
import stickerRmrContenders2020 from '../assets/stickers/rmr-contenders-2020-capsule.png';
import stickerRmrLegends2020 from '../assets/stickers/rmr-legends-2020-capsule.png';
import stickerShanghai2024Legends from '../assets/stickers/shanghai-2024-legends-capsule.png';
import stickerShanghaiChallengers2024 from '../assets/stickers/shanghai-challengers-2024-capsule.png';
import stickerShanghaiContenders2024 from '../assets/stickers/shanghai-contenders-2024-capsule.png';
import stickerShatteredWeb from '../assets/stickers/shatteredweb-capsule.png';
import stickerSkillGroups from '../assets/stickers/skillgroups-capsule.png';
import stickerSlid3 from '../assets/stickers/slid3-capsule.png';
import stickerStickerCapsule2 from '../assets/stickers/sticker-capsule-2.png';
import stickerStickerCapsule from '../assets/stickers/sticker-capsule.png';
import stickerStockholmChallengers2021 from '../assets/stickers/stockholm-challengers-2021-capsule.png';
import stickerStockholmContenders2021 from '../assets/stickers/stockholm-contenders-2021-capsule.png';
import stickerStockholmLegends2021 from '../assets/stickers/stockholm-legends-2021-capsule.png';
import stickerSugarface from '../assets/stickers/sugarface-capsule.png';
import stickerTeamRoles from '../assets/stickers/teamroles-capsule.png';
import stickerTheBoardroom from '../assets/stickers/theboardroom-capsule.png';
import stickerWarhammer40000 from '../assets/stickers/warhammer40000-capsule.png';
import stickerWarhammer40000AdeptusAstartes from '../assets/stickers/warhammer40000adeptusastartes-capsule.png';
import stickerWarhammer40000Imperium from '../assets/stickers/warhammer40000imperium-capsule.png';
import stickerWarhammer40000TraitorAstartes from '../assets/stickers/warhammer40000traitorastartes-capsule.png';
import stickerWarhammer40000Xenos from '../assets/stickers/warhammer40000xenos-capsule.png';

const stickersArr = [
  { name: '10 Year Birthday Sticker Capsule', image: sticker10YearBirthday },
  { name: '2021 Community Sticker Capsule', image: sticker2021Community },
  { name: 'Ambush Sticker Capsule', image: stickerAmbush },
  { name: 'Antwerp Challengers 2022 Sticker Capsule', image: stickerAntwerpChallengers2022 },
  { name: 'Antwerp Contenders 2022 Sticker Capsule', image: stickerAntwerpContenders2022 },
  { name: 'Antwerp Legends 2024 Sticker Capsule', image: stickerAntwerpLegends2024 },
  { name: 'Austin Challengers 2025 Sticker Capsule', image: stickerAustinChallengers2025 },
  { name: 'Austin Contenders 2025 Sticker Capsule', image: stickerAustinContenders2025 },
  { name: 'Austin Legends 2025 Sticker Capsule', image: stickerAustinLegends2025 },
  { name: 'Battlefield 2042 Sticker Capsule', image: stickerBattlefield2042 },
  { name: 'Berlin Legends 2019 Sticker Capsule', image: stickerBerlinLegends2019 },
  { name: 'Berlin Minor Challengers 2019 Sticker Capsule', image: stickerBerlinMinorChallengers2019 },
  { name: 'Berlin Return Challengers (Holo-Foil) 2019 Sticker Capsule', image: stickerBerlinReturnChallengersHoloFoil2019 },
  { name: 'Bestiary Sticker Capsule', image: stickerBestiary },
  { name: 'Broken Fang Sticker Capsule', image: stickerBrokenFang },
  { name: 'Chicken Sticker Capsule', image: stickerChicken },
  { name: 'Cologne Challengers 2016 Sticker Capsule', image: stickerCologneChallengers2016 },
  { name: 'Community 2018 Sticker Capsule', image: stickerCommunity2018 },
  { name: 'Community Sticker Capsule 1', image: stickerCommunity1 },
  { name: 'Copenhagen Challengers 2024 Sticker Capsule', image: stickerCopenhagenChallengers2024 },
  { name: 'Copenhagen Legends 2024 Sticker Capsule', image: stickerCopenhagenLegends2024 },
  { name: 'Coppenhagen Contenders 2024 Sticker Capsule', image: stickerCoppenhagenContenders2024 },
  { name: 'CS20 Sticker Capsule', image: stickerCs20 },
  { name: 'Dreamhack Legends (Foil) 2015 Sticker Capsule', image: stickerDreamhackLegendsFoil2015 },
  { name: 'Dreamhack Legends 2015 Sticker Capsule', image: stickerDreamhackLegends2015 },
  { name: 'Enfu Sticker Capsule', image: stickerEnfu },
  { name: 'ESL Legends 2014 Sticker Capsule', image: stickerEslLegends2014 },
  { name: 'ESL One Cologne Legends (Foil) 2015 Sticker Capsule', image: stickerEslOneCologneLegendsFoil2015 },
  { name: 'ESL One Cologne 2014 Sticker Capsule', image: stickerEslOneCologne2014 },
  { name: 'ESL One Katowice 2015 Sticker Capsule', image: stickerEslOneKatowice2015 },
  { name: 'Espionage Sticker Capsule', image: stickerEspionage },
  { name: 'Feral Predators Sticker Capsule', image: stickerFeralPredators },
  { name: 'Half-Life Alyx Sticker Capsule', image: stickerHalfLifeAlyx },
  { name: 'Halo Sticker Capsule', image: stickerHalo },
  { name: 'Katowice 2019 Sticker Capsule', image: stickerKatowice2019 },
  { name: 'Katowice 2019 Challengers (Holo-Foil) 2019 Sticker Capsule', image: stickerKatowice2019ChallengersHoloFoil2019 },
  { name: 'Katowice Returning Challengers (Holo-Foil) 2019 Sticker Capsule', image: stickerKatowiceReturningChallengersHoloFoil2019 },
  { name: 'Krakow Challengers 2017 Sticker Capsule', image: stickerKrakowChallengers2017 },
  { name: 'Krakow Legends (Holo-Foil) 2017 Sticker Capsule', image: stickerKrakowLegendsHoloFoil2017 },
  { name: 'London Legends 2018 Sticker Capsule', image: stickerLondonLegends2018 },
  { name: 'London Minor Challengers (Holo-Foil) 2018 Sticker Capsule', image: stickerLondonMinorChallengersHoloFoil2018 },
  { name: 'London Returning Challengers (Holo-Foil) 2018 Sticker Capsule', image: stickerLondonReturningChallengersHoloFoil2018 },
  { name: 'MLG Columbus Challengers 2016 Sticker Capsule', image: stickerMlgColumbusChallengers2016 },
  { name: 'Operation Riptide Sticker Capsule', image: stickerOperationRiptide },
  { name: 'Paris Challenger 2023 Sticker Capsule', image: stickerParisChallenger2023 },
  { name: 'Paris Contenders Paris 2023 Sticker Capsule', image: stickerParisContendersParis2023 },
  { name: 'Paris Legends 2023 Sticker Capsule', image: stickerParisLegends2023 },
  { name: 'Perfect World Sticker Capsule 1', image: stickerPerfectWorld1 },
  { name: 'Perfect World Sticker Capsule 2 Base', image: stickerPerfectWorld2Base },
  { name: 'Perfect World Sticker Capsule 2', image: stickerPerfectWorld2 },
  { name: 'Pinups Sticker Capsule', image: stickerPinups },
  { name: 'Poorly Drawn Sticker Capsule', image: stickerPoorlyDrawn },
  { name: 'Recoil Sticker Capsule', image: stickerRecoil },
  { name: 'Rio Challengers 2022 Sticker Capsule', image: stickerRioChallengers2022 },
  { name: 'Rio Contenders 2022 Sticker Capsule', image: stickerRioContenders2022 },
  { name: 'Rio Legends 2022 Sticker Capsule', image: stickerRioLegends2022 },
  { name: 'RMR Challengers 2020 Sticker Capsule', image: stickerRmrChallengers2020 },
  { name: 'RMR Contenders 2020 Sticker Capsule', image: stickerRmrContenders2020 },
  { name: 'RMR Legends 2020 Sticker Capsule', image: stickerRmrLegends2020 },
  { name: 'Shanghai 2024 Legends Sticker Capsule', image: stickerShanghai2024Legends },
  { name: 'Shanghai Challengers 2024 Sticker Capsule', image: stickerShanghaiChallengers2024 },
  { name: 'Shanghai Contenders 2024 Sticker Capsule', image: stickerShanghaiContenders2024 },
  { name: 'Shattered Web Sticker Capsule', image: stickerShatteredWeb },
  { name: 'Skill Groups Sticker Capsule', image: stickerSkillGroups },
  { name: 'Slid3 Sticker Capsule', image: stickerSlid3 },
  { name: 'Sticker Capsule 2', image: stickerStickerCapsule2 },
  { name: 'Sticker Capsule', image: stickerStickerCapsule },
  { name: 'Stockholm Challengers 2021 Sticker Capsule', image: stickerStockholmChallengers2021 },
  { name: 'Stockholm Contenders 2021 Sticker Capsule', image: stickerStockholmContenders2021 },
  { name: 'Stockholm Legends 2021 Sticker Capsule', image: stickerStockholmLegends2021 },
  { name: 'Sugarface Sticker Capsule', image: stickerSugarface },
  { name: 'Team Roles Sticker Capsule', image: stickerTeamRoles },
  { name: 'The Boardroom Sticker Capsule', image: stickerTheBoardroom },
  { name: 'Warhammer 40,000 Sticker Capsule', image: stickerWarhammer40000 },
  { name: 'Warhammer 40,000 Adeptus Astartes Sticker Capsule', image: stickerWarhammer40000AdeptusAstartes },
  { name: 'Warhammer 40,000 Imperium Sticker Capsule', image: stickerWarhammer40000Imperium },
  { name: 'Warhammer 40,000 Traitor Astartes Sticker Capsule', image: stickerWarhammer40000TraitorAstartes },
  { name: 'Warhammer 40,000 Xenos Sticker Capsule', image: stickerWarhammer40000Xenos },
];

const StickerImageTester = () => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [failedImages, setFailedImages] = useState(new Set());

  const handleImageLoad = (name) => {
    setLoadedImages(prev => new Set([...prev, name]));
  };

  const handleImageError = (name) => {
    setFailedImages(prev => new Set([...prev, name]));
  };

  useEffect(() => {
    console.log(`Total stickers to test: ${stickersArr.length}`);
    console.log('Invalid image values:', stickersArr.filter(item => !item.image || item.image === '').map(item => item.name));
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">Sticker Image Loading Test</h2>
      <div className="mb-4">
        <p className="text-green-400">Loaded: {loadedImages.size} / {stickersArr.length}</p>
        <p className="text-red-400">Failed: {failedImages.size} / {stickersArr.length}</p>
      </div>
      
      {failedImages.size > 0 && (
        <div className="mb-6 p-4 bg-red-900 rounded">
          <h3 className="text-red-200 font-bold mb-2">Failed to Load:</h3>
          <ul className="text-red-100 text-sm">
            {Array.from(failedImages).map(name => (
              <li key={name}>• {name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {stickersArr.map((sticker, index) => (
          <div key={index} className="bg-gray-800 p-2 rounded text-center">
            <img
              src={sticker.image}
              alt={sticker.name}
              className="w-20 h-20 object-contain mx-auto mb-2"
              onLoad={() => handleImageLoad(sticker.name)}
              onError={() => handleImageError(sticker.name)}
            />
            <p className="text-xs text-gray-300 truncate" title={sticker.name}>
              {sticker.name}
            </p>
            <p className="text-xs text-blue-300 mt-1">
              {loadedImages.has(sticker.name) ? '✓' : failedImages.has(sticker.name) ? '✗' : '⏳'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickerImageTester;
