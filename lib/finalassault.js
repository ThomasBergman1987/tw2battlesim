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

const ramObj = {
  0: 1,
  1: 1.25,
  2: 1.50,
  3: 2,
};

const finalAssault = (attack, defense, mods) => {
  const r102 = (attack.rams * mods.attMod * (mods.attack.weapon === 'rams' ? ramObj[mods.attack.weaponLvl] : 1)) / 100;
  const r103 = mods.wallAfterPre > 0 ? wallHitpoints[mods.wallAfterPre] * 2 : 0;
  const r104 = r102 === 0 || r103 === 0 ? 0 : -r102 / r103;
  const r105 = mods.wallAfterPre <= mods.defense.ironWall ? mods.wallAfterPre : (mods.wallAfterPre - mods.defense.ironWall < -r104 ? (mods.wallAfterPre < mods.defense.ironWall ? mods.wallAfterPre : mods.defense.ironWall) : mods.wallAfterPre + r104);
  const finalWall = Math.round(r105);

  return finalWall;
};

module.exports = finalAssault;
