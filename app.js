const http = require('http');
const debug = require('debug')('tw2calc');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();
const server = http.createServer(app);
const simulate = require('./lib/simulate');

const port = 5000;

const faith = {
  0: 0.5,
  1: 1,
  2: 1.05,
  3: 1.1,
};

const mods = (value) => {
  let { attack, defense } = value;
  attack = {
    morale: attack.morale || 100,
    grandmaster: attack.grandmaster || false,
    medic: attack.medic || false,
    church: parseInt(attack.church, 10) || 0,
    luck: parseInt(attack.luck, 10) || 0,
    weaponLvl: attack.weaponLvl || null,
    weapon: attack.weapon || null,
    mastery: parseInt(attack.mastery, 10) || 0,
  };
  defense = {
    medicus: parseInt(defense.medicus, 10) || null,
    church: parseInt(defense.church, 10) || 0,
    wall: parseInt(defense.wall, 10) || 0,
    weaponLvl: defense.weaponLvl || null,
    weapon: defense.weapon || null,
    ironWall: parseInt(defense.ironWall, 10) || 0,
  };
  const attFaith = faith[attack.church];
  const defMod = faith[defense.church] * 100;

  const luck = parseFloat(attack.luck) / 100.0;
  const attMod = parseInt((attFaith * attack.morale * (1 + luck)) + (attack.mastery * 2) + (attack.grandmaster === true ? 10 : 0), 10);
  return { attMod, defMod };
};

const sim = (value) => {
  Object.assign(value.mods, mods(value.mods));
  return simulate(value);
};

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'default' }));
app.set('view engine', '.hbs');

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.render('home');
});

app.post('/send', (req, res) => {
  const i = req.body;
  let troops = {
    attack: {
      spearmen: i['attacker.spearmen'] || 0,
      swordsmen: i['attacker.swordsmen'] || 0,
      axemen: i['attacker.axemen'] || 0,
      archers: i['attacker.archers'] || 0,
      lightCavalry: i['attacker.lightCavalry'] || 0,
      mountedArchers: i['attacker.mountedArchers'] || 0,
      heavyCavalry: i['attacker.heavyCavalry'] || 0,
      rams: i['attacker.rams'] || 0,
      catapults: i['attacker.catapults'] || 0,
      berserkers: i['attacker.berserkers'] || 0,
      trebuchets: i['attacker.trebuchets' || 0],
      noblemen: i['attacker.noblemen' || 0],
      paladin: i['attacker.paladin' || 0],
    },
    defense: {
      spearmen: i['defender.spearmen'] || 0,
      swordsmen: i['defender.swordsmen'] || 0,
      axemen: i['defender.axemen'] || 0,
      archers: i['defender.archers'] || 0,
      lightCavalry: i['defender.lightCavalry'] || 0,
      mountedArchers: i['defender.mountedArchers'] || 0,
      heavyCavalry: i['defender.heavyCavalry'] || 0,
      rams: i['defender.rams'] || 0,
      catapults: i['defender.catapults'] || 0,
      berserkers: i['defender.berserkers'] || 0,
      trebuchets: i['defender.trebuchets' || 0],
      noblemen: i['defender.noblemen' || 0],
      paladin: i['defender.paladin' || 0],
    },
  };

  const attackingBerserkers = troops.defense.berserkers;

  /* if (troops.defense >= (attackingBerserkers / 2)) {
    attackingBerserkers.attack *= 2;
  } */

  Object.keys(troops.attack).forEach(key => troops.attack[key] = Number(troops.attack[key]));
  Object.keys(troops.attack).forEach(key => troops.defense[key] = Number(troops.defense[key]));
  const result = sim({
    troops,
    mods: {
      attack: {
        church: i['attack.church'] || 0,
        grandmaster: i['attack.grandmaster'] === 'on',
        medic: i['attack.medic'] === 'on',
        morale: i['attack.morale'] || 100,
        luck: i['attack.luck'] || 0,
        mastery: i['attack.mastery'] || 0,
        weapon: i['attack.weapon'] || null,
        weaponLvl: i['attack.weaponLvl'] || null,
      },
      defense: {
        church: i['defense.church'] || 0,
        medicus: i['defense.medicus'] || 0,
        hospital: i['defense.hospital'] || 100,
        wall: i['defense.wall'] || 0,
        ironWall: i['defense.ironWall'] || 0,
        weapon: i['defense.weapon'] || null,
        weaponLvl: i['defense.weaponLvl'] || null,
      },
    },
  });
  res.render('results', {
    attacker: troops.attack,
    defender: troops.defense,
    attackerDead: result.deadAttackers,
    defenderDead: result.deadDefenders,
    attmod: result.mods.attMod,
    attmodOk: result.mods.attMod >= 100,
    defmod: Math.round(result.mods.defMod),
    defmodOk: result.mods.defMod >= 100,
    finalwall: result.finalWall,
    walldmg: result.finalWall != result.mods.defense.wall,
  });
});

server.listen(port, () => {
  debug('listening on port ', port);
});
