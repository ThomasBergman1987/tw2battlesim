const round1 = require('./round1');
const round2 = require('./round2');
const round3 = require('./round3');
const preround = require('./preround');
const finalAssault = require('./finalassault');

const setStats = (provisions, attack, defense, cavalryDefense, archerDefense) => ({
  provisions,
  attack,
  defense,
  cavalryDefense,
  archerDefense,
});

const units = {
  spearmen: setStats(1, 10, 25, 45, 10),
  swordsmen: setStats(1, 25, 55, 5, 30),
  axemen: setStats(1, 45, 10, 5, 10),
  archers: setStats(1, 25, 10, 30, 60),
  lightCavalry: setStats(4, 130, 30, 40, 30),
  mountedArchers: setStats(5, 150, 40, 30, 50),
  heavyCavalry: setStats(6, 150, 200, 160, 180),
  rams: setStats(5, 2, 20, 50, 20),
  catapults: setStats(8, 100, 100, 50, 100),
  paladin: setStats(1, 150, 250, 400, 150),
  noblemen: setStats(100, 30, 100, 50, 100),
  berserkers: setStats(6, 300, 300, 100, 50),
  trebuchets: setStats(10, 30, 200, 250, 200),
};

const reset = () => ({
  spearmen: 0,
  swordsmen: 0,
  axemen: 0,
  archers: 0,
  lightCavalry: 0,
  mountedArchers: 0,
  heavyCavalry: 0,
  rams: 0,
  catapults: 0,
  berserkers: 0,
  trebuchets: 0,
  noblemen: 0,
  paladin: 0,
});

const simulate = ({ troops, mods }) => {
  const { attack, defense } = troops;

  const pr = preround(troops, mods);
  const r1 = round1(pr.troops, pr.mods);
  const r2 = round2(r1.attackerSurvivors, r1.defenderSurvivors, pr.mods);
  const r3 = round3(r2.attackerSurvivors, r2.defenderSurvivors, pr.mods);
  let finalWall;
  if (r3.attackerSurvivors.rams > 0) finalWall = finalAssault(r3.attackerSurvivors, r3.defenderSurvivors, pr.mods);
  else finalWall = mods.wallAfterPre;
  const deadAttackers = {};
  const deadDefenders = {};

  Object.keys(attack).forEach((unit) => {
    if (r3.attackerSurvivors[unit] > 0) deadAttackers[unit] = attack[unit] - r3.attackerSurvivors[unit];
    else deadAttackers[unit] = attack[unit];
    // if (unit === 'rams') deadAttackers.rams += parseInt(pr.destroyedRams, 10);
  });
  Object.keys(defense).forEach((unit) => {
    if (r3.defenderSurvivors[unit] > 0) deadDefenders[unit] = defense[unit] - r3.defenderSurvivors[unit];
    else deadDefenders[unit] = defense[unit];
  });

  return { deadAttackers, deadDefenders, mods: pr.mods, finalWall };
};

module.exports = simulate;
