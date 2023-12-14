import { createSlice } from '@reduxjs/toolkit';
import { current } from '@reduxjs/toolkit';
import ichigo from '../../assets/sprite/stance/ichigo.gif';
import rukia from '../../assets/sprite/stance/rukia.gif';
import byakuya from '../../assets/sprite/stance/byakuya.gif';
import kenpachi from '../../assets/sprite/stance/kenpachi.gif';

const initialState = {
  players: [
    {
      name: 'Kurosaki Ichigo',
      sprite : ichigo,
      pv: 450,
      pvMax: 450,
      status: 'alive',
      mana: 300,
      manaMax: 300,
      id: 1,
      abilities: [
        { name: 'Getsuga Tensho', type: 'damage', damage: 50, manaCost: 0 },
        { name: 'Soin', type: 'heal', healAmount: 30, manaCost: 20 },
        { name: 'Mana Drain', type: 'manaDrain', damage: 10, manaGain: 30, manaCost: 0 },
        { name: 'BANKAI TENSA ZANGETSU', type: 'ultimate', damage: 450, manaCost: 30 },
      ],
    },
    
    {
      name: "Rukia Kuchiki",
      sprite : rukia,
      pv: 350,
      pvMax: 350,
      status: 'alive',
      mana: 400,
      manaMax: 400,
      id: 2,
      abilities: [
        { name: 'Byakurai', type: 'damage', damage: 50, manaCost: 0 },
        { name: 'Soin', type: 'heal', healAmount: 20, manaCost: 20 },
        { name: 'Mana Drain', type: 'manaDrain', damage: 10, manaGain: 10, manaCost: 0 },
        { name: 'Bankai Hakka no Togame', type: 'ultimate', damage: 20, manaCost: 30 },
      ],
    },
    {
      name: "Byakuya Kuchiki",
      sprite : byakuya,
      pv: 750,
      pvMax: 750,
      status: 'alive',
      mana: 800,
      manaMax: 800,
      id: 3,
      abilities: [
        { name: 'Senka ', type: 'damage', damage: 100, manaCost: 0 },
        { name: 'Soin', type: 'heal', healAmount: 20, manaCost: 20 },
        { name: 'Mana Drain', type: 'manaDrain', damage: 10, manaGain: 10, manaCost: 0 },
        { name: 'Bankai Senbonzakura Kageyoshi ', type: 'ultimate', damage: 20, manaCost: 30 },
      ],
    },
    {
      name: "Zaraki Kenpachi",
      sprite : kenpachi,
      pv: 99999999,
      pvMax: 9999999,
      status: 'alive',
      mana: 9999999999,
      manaMax: 99999999,
      id: 4,
      abilities: [
        { name: 'Petit coup avec le dos de la lame', type: 'damage', damage: 99999999, manaCost: 0 },
        { name: 'Taunt', type: 'heal', healAmount: 0, manaCost: 0 },
      ],
    }
  ],
  monster: {
    name: 'monster',
    pv: '9000',
    pvMax: '9000',
    status: 'alive',
    specialAttack: [{name: 'Special Attack', type: 'damage', damage: 200}],
  },
  playersWhoPlayed: [],
  DeadPlayers: [],
  lastAttackingPlayer: null,
  currentTurnPlayerId: 1,
};

export const fightSlice = createSlice({
  name: 'fight',
  initialState,
  reducers: {

    hitMonster: (state, action) => {
      const attackingPlayerId = action.payload.attackingPlayerId;
      const attackingPlayer = state.players.find((player) => player.id === attackingPlayerId);

      if (attackingPlayer && attackingPlayer.mana >= attackingPlayer.abilities[0].manaCost) {
        const hit = attackingPlayer.abilities[0].damage;
        state.monster.pv -= hit;
        attackingPlayer.mana -= attackingPlayer.abilities[0].manaCost;

        if (state.monster.pv < 0) {
          state.monster.pv = 0;
        }

        state.lastAttackingPlayer = attackingPlayer;
      } else {
        console.log("Pas assez de mana pour attaquer ou joueur non trouvé.");
      }
    },
    HealAbility: (state, action) => {
      const { playerId } = action.payload;
      const player = state.players.find((p) => p.id === playerId);

      if (player && player.mana >= player.abilities[1].manaCost) {
        player.pv += player.abilities[1].healAmount;
        player.mana -= player.abilities[1].manaCost;
        player.pv = Math.min(player.pv, player.pvMax);
      } else {
        console.log("Pas assez de mana pour utiliser la capacité de soin ou joueur non trouvé.");
      }
    },

    ManaDrainAbility: (state, action) => {
      const { playerId } = action.payload;
      const player = state.players.find((p) => p.id === playerId);
    
      if (player && player.mana >= player.abilities[2].manaCost) {
        player.mana += 20;
    
        player.pv -= 20;
    
        player.mana -= player.abilities[2].manaCost;
    
        player.pv = Math.max(player.pv, 0);
      } else {
        console.log("Pas assez de mana pour utiliser la capacité de drain de mana ou joueur non trouvé.");
      }
    },
    

    UltimateAbility: (state, action) => {
      const { playerId } = action.payload;
      const player = state.players.find((p) => p.id === playerId);
    
      if (player && player.mana >= player.abilities[3].manaCost) {
        console.log(`Avant - Mana du joueur (${player.name}): ${player.mana}`);
        
        state.monster.pv -= player.abilities[3].damage;
        player.mana -= player.abilities[3].manaCost;
        
        console.log(`Après - Mana du joueur (${player.name}): ${player.mana}`);
        
        state.monster.pv = Math.max(state.monster.pv, 0);
      } else {
        console.log("Pas assez de mana pour utiliser la capacité ultime ou joueur non trouvé.");
      }
    },
    

    hitBack: (state, action) => {
      const hitBackPlayerId = action.payload.id;
      const hitBackPlayer = state.players.find(player => player.id === hitBackPlayerId);
    
      if (hitBackPlayer && hitBackPlayer.status === 'alive') {
        const alivePlayers = state.players.filter(player => player.status === 'alive' && player.id !== hitBackPlayerId);
    
        if (alivePlayers.length > 0) {
          const randomIndex = Math.floor(Math.random() * alivePlayers.length);
          const targetPlayer = alivePlayers[randomIndex];
    
          targetPlayer.pv -= 5;
    
          if (targetPlayer.pv < 0) {
            targetPlayer.pv = 0;
          }
        }
      }
    },

    MonsterSpecials: (state) => {
      const monster = state.monster;

      if (monster.status === 'alive' && monster.specialAttack) {
        const randomPlayerIndex = Math.floor(Math.random() * state.players.length);
        const targetPlayer = state.players[randomPlayerIndex];

        const specialAttackDamage = monster.specialAttack[0].damage;
        targetPlayer.pv -= specialAttackDamage;

        if (targetPlayer.pv < 0) {
          targetPlayer.pv = 0;
        }

        console.log(`Monster used special attack on ${targetPlayer.name}! Damage: ${specialAttackDamage}`);
      }
    },
    
    updatePlayerStatus: (state, action) => {
      const player = action.payload.player;
      const status = action.payload.status;

      const updatedPlayers = state.players.map((p) =>
        p.id === player.id ? { ...p, status: status } : p
      );

      state.players = updatedPlayers;
    },

    updateMonsterStatus: (state, action) => {
      const monster = action.payload.monster;
      const status = action.payload.status;

      const updatedMonster = { ...monster, status: status };
      state.monster = updatedMonster;
    },

    checkDefeat: (state) => {
      const allPlayersDead = state.players.every(player => player.status === 'dead');

      if (allPlayersDead) {
        console.log("Tous les joueurs sont morts. Défaite !");
        state.defeatMessage = "Vous avez perdu !";
      }
    },
    checkVictory: (state) => {
      const monsterDead = state.monster.status === 'dead';

      if (monsterDead) {
        state.victoryMessage = "Vous avez gagné !";
        console.log('Vous avez gagné !');
      }
    },
    updateLastAttackingPlayer: (state, action) => {
      const playerId = action.payload.playerId;
      state.lastAttackingPlayer = state.players.find(player => player.id === playerId);
      console.log(action.payload.playerId);
    },
    nextTurn: (state) => {
      const alivePlayers = state.players.filter(player => player.status === 'alive');

      if (alivePlayers.length > 0) {
        const currentIndex = alivePlayers.findIndex(player => player.id === state.currentTurnPlayerId);
        const nextIndex = (currentIndex + 1) % alivePlayers.length;
        state.currentTurnPlayerId = alivePlayers[nextIndex].id;

     
        state.currentTurn += 1;
      }
    },

    playerPlayed: (state, action) => {
      const playerId = action.payload.playerId;

      if (!state.playersWhoPlayed.includes(playerId)) {
        state.playersWhoPlayed.push(playerId);
        console.log('Updated playersWhoPlayed:', state.playersWhoPlayed);
        console.log(current(state));
      }
    },

    resetPlayersWhoPlayed: (state) => {
      state.playersWhoPlayed = [];
      console.log('PlayersWhoPlayed has been reset.');
    },

  },
});

export default fightSlice.reducer;
export const {
  hitMonster,
  hitBack,
  updatePlayerStatus,
  checkDefeat,
  checkVictory,
  updateMonsterStatus,
  nextTurn,
  updateLastAttackingPlayer,
  healPlayer,
  reduceMana,
  endTurn,
  specialAttackMonster, 
  HealAbility,
  ManaDrainAbility,
  UltimateAbility,
  playerPlayed,
  MonsterSpecials,
  resetPlayersWhoPlayed
} = fightSlice.actions;


