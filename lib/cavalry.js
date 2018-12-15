const tools = require('./tools');

const cavalry = (totalAttack, totalDefense, { attackerSurvivors, defenderSurvivors, mods }) => {
  const attacker = {
    lightCavalry: attackerSurvivors.lightCavalry,
    heavyCavalry: attackerSurvivors.heavyCavalry,
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
  const defenderStrength = (tools.calcStrength(defender, 'cavalryDefense', mods) * (defMod / 100)) + baseDefense;

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

  const cavalryAttackerSurvivors = Object.assign({}, attackerSurvivors);
  const cavalryDefenderSurvivors = Object.assign({}, defenderSurvivors);

  Object.keys(attackerSurvivors).forEach((unit) => {
    if (attackerDead[unit]) cavalryAttackerSurvivors[unit] -= attackerDead[unit];
  });
  Object.keys(defenderSurvivors).forEach((unit) => {
    if (defenderDead[unit]) cavalryDefenderSurvivors[unit] -= defenderDead[unit];
  });
  return {
    cavalryAttackerSurvivors,
    cavalryDefenderSurvivors,
    mods,
  };
};

module.exports = cavalry;
