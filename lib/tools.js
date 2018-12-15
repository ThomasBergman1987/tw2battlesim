const setStats = (provisions, attack, defense, cavalryDefense, archerDefense) => ({
  provisions,
  attack,
  defense,
  cavalryDefense,
  archerDefense,
});

const setBonus = (def1, def2, def3, att1, att2, att3) => ({
  defense: {
    1: (def1 / 100) + 1,
    2: (def2 / 100) + 1,
    3: (def3 / 100) + 1,
  },
  attack: {
    1: (att1 / 100) + 1,
    2: (att2 / 100) + 1,
    3: (att3 / 100) + 1,
  },
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
  berserkers: setStats(6, 300, 100, 100, 50),
  trebuchets: setStats(10, 30, 200, 250, 200),
};

const bonus = {
  spearmen: setBonus(10, 20, 30, 5, 10, 20),
  swordsmen: setBonus(10, 20, 30, 5, 10, 20),
  axemen: setBonus(5, 10, 20, 10, 20, 30),
  archers: setBonus(10, 20, 30, 5, 10, 20),
  lightCavalry: setBonus(5, 10, 20, 10, 20, 30),
  mountedArchers: setBonus(5, 10, 20, 10, 20, 30),
  heavyCavalry: setBonus(10, 20, 30, 10, 20, 30),
  rams: setBonus(5, 10, 20, 25, 50, 100),
  catapults: setBonus(5, 10, 20, 25, 50, 100),
};

const Tools = {
  calcProvisions(obj) {
    let count = 0;
    Object.keys(obj).forEach((unit) => {
      count += (obj[unit] * units[unit].provisions);
    });
    return count;
  },
  calcKillRate(home, away) {
    const a = ((home / away) ** (1 / 2)) / (away / home);
    if (home === 0 || away === 0) return 0;
    if (away <= home) return 1;
    else if (home < away) return a;
  },
  calcStrength(obj, type, mods) {
    let count = 0;
    Object.keys(obj).forEach((unit) => {
      if (type === 'attack') count += (unit === mods.attack.weapon ? (obj[unit] * units[unit][type]) * bonus[unit].attack[mods.attack.weaponLvl] : (obj[unit] * units[unit][type]));
      else count += (unit === mods.defense.weapon ? (obj[unit] * units[unit][type]) * bonus[unit].defense[mods.defense.weaponLvl] : (obj[unit] * units[unit][type]));
    });
    return count;
  },
};

module.exports = Tools;
