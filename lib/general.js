const tools = require('./tools');

const general = ({ attack, defense, mods }) => {
  const attacker = Object.assign({}, attack);
  const defender = {};
  const attackerDead = {};
  const defenderDead = {};
  const { attMod, defMod, baseDefense } = mods;

  delete attacker.archers;
  delete attacker.lightCavalry;
  delete attacker.mountedArchers;
  delete attacker.heavyCavalry;
  const defenderPresence = tools.calcProvisions(attacker) / tools.calcProvisions(attack);

  Object.keys(defense)
    .forEach((unit) => {
      defender[unit] = Math.round(defense[unit] * defenderPresence);
    });

  const attackerStrength = tools.calcStrength(attacker, 'attack', mods) * (attMod / 100);
  const defenderStrength = (tools.calcStrength(defender, 'defense', mods) * (defMod / 100)) + baseDefense;

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

  const attackerSurvivors = Object.assign({}, attack);
  const defenderSurvivors = Object.assign({}, defense);

  Object.keys(attack).forEach((unit) => {
    if (attackerDead[unit]) attackerSurvivors[unit] -= attackerDead[unit];
  });
  Object.keys(defense).forEach((unit) => {
    if (defenderDead[unit]) defenderSurvivors[unit] -= defenderDead[unit];
  });
  return {
    attackerSurvivors,
    defenderSurvivors,
    mods,
  };
};

module.exports = general;
