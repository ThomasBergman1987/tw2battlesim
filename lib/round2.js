const general = require('./general');
const cavalry = require('./cavalry');
const archers = require('./archers');

const round2 = (attack, defense, mods) =>
  archers(attack, defense, cavalry(attack, defense, general({ attack, defense, mods })));

module.exports = round2;
