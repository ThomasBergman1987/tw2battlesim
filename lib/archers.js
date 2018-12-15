const tools = require('./tools');

const archers = (totalAttack, totalDefense, { cavalryAttackerSurvivors, cavalryDefenderSurvivors, mods }) => {
  const attacker = {
    archers: cavalryAttackerSurvivors.archers,
    mountedArchers: cavalryAttackerSurvivors.mountedArchers,
  };
  const defender = {};
  const attackerDead = {};
  const defenderDead = {};

  const { attMod, defMod, baseDefense } = mods;

  const defenderPresence = tools.calcProvisions(attacker) / tools.calcProvisions(totalAttack);

  Object.keys(totalDefense)
    .forEach((unit) => {
      defender[unit] = Math.round(totalDefense[unit] * defenderPresence);
    });

  const attackerStrength = tools.calcStrength(attacker, 'attack', mods) * (attMod / 100);
  const defenderStrength = (tools.calcStrength(defender, 'archerDefense', mods) * (defMod / 100)) + baseDefense;

  const attackerKillRate = tools.calcKillRate(attackerStrength, defenderStrength);
  const defenderKillRate = tools.calcKillRate(defenderStrength, attackerStrength);

  Object.keys(attacker)
    .forEach((unit) => {
      attackerDead[unit] = Math.round((attacker[unit] * defenderKillRate) + 0.000001);
    });

  Object.keys(defender)
    .forEach((unit) => {
      defenderDead[unit] = Math.round((defender[unit] * attackerKillRate) + 0.000001);
    });

  const attackerSurvivors = Object.assign({}, cavalryAttackerSurvivors);
  const defenderSurvivors = Object.assign({}, cavalryDefenderSurvivors);

  Object.keys(cavalryAttackerSurvivors).forEach((unit) => {
    if (attackerDead[unit]) attackerSurvivors[unit] -= attackerDead[unit];
  });
  Object.keys(cavalryDefenderSurvivors).forEach((unit) => {
    if (defenderDead[unit]) defenderSurvivors[unit] -= defenderDead[unit];
  });
  return {
    attackerSurvivors,
    defenderSurvivors,
  };
};

module.exports = archers;
