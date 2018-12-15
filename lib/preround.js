const tools = require('./tools');

const ramObj = {
  0: 1,
  1: 1.25,
  2: 1.50,
  3: 2,
};

const wallHitpoints = {
  0: 0,
  1: 3,
  2: 3,
  3: 4,
  4: 4,
  5: 4,
  6: 5,
  7: 5,
  8: 6,
  9: 6,
  10: 7,
  11: 8,
  12: 9,
  13: 9,
  14: 10,
  15: 11,
  16: 13,
  17: 14,
  18: 15,
  19: 17,
  20: 18,
};

const preround = (troops, mods) => {
  const attTroops = troops.attack;
  const defTroops = troops.defense;
  let { wall, ironWall } = mods.defense;
  wall = Number(wall);
  ironWall = Number(ironWall);
  const ramsProvisions = attTroops.rams * 5;
  const attProvisions = tools.calcProvisions(attTroops);
  const defProvisions = tools.calcProvisions(defTroops);
  const modAttProvisions = attProvisions - ramsProvisions;
  const wallDefense = Math.round((1.2515 ** (wall - 1)) * 20);
  const modDefProvisions = defProvisions + (wallDefense + (defTroops.noblemen * 100));

  const rams = attTroops.rams;

  // =IF(J21=0,0,IF(J21<ROUND(M24*(J21/(J21+K21))),-J21,-ROUND(M24*(J21/(J21+K21)))))

  const destroyedRams = rams === 0 ? 0 : (rams < Math.round(defTroops.trebuchets*(rams/(rams+attTroops.catapults))) ? rams : 
  Math.round(defTroops.trebuchets*(rams/(rams+attTroops.catapults))));

  const remainingRams = rams - destroyedRams;

  const s21 = modAttProvisions === 0 || modDefProvisions === 0 ? 0 : (modAttProvisions / modDefProvisions > 1 ? 1 : modAttProvisions / modDefProvisions);

  const s23 = remainingRams * s21 * (mods.attMod / 100) * (mods.attack.weapon === 'rams' ? ramObj[mods.attack.weaponLvl] : 1);
  const s24 = wall === 0 ? 0 : wallHitpoints[wall] * 2;
  const s25 = wall === 0 ? 0 : -(s23 / s24);

  const destroyedLevels = (wall <= ironWall ? wall : (wall - ironWall < (-s25) ? (wall < ironWall ? wall : ironWall) : wall + s25));
  const baseDefense = Math.round((1.2515 ** (destroyedLevels - 1)) * 20);

  const attackerSurvivors = Object.assign({}, attTroops);

  if (destroyedRams > 0) attackerSurvivors.rams -= destroyedRams;

  const wallAfterPre = Math.round(destroyedLevels);
  Object.assign(mods, { defMod: mods.defMod * (1 + (wallAfterPre * 0.05)), baseDefense, wallAfterPre });
  return {
    destroyedRams,
    troops: {
      attack: attackerSurvivors,
      defense: defTroops,
    },
    mods,
  };
};

module.exports = preround;
