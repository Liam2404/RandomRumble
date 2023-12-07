import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  players: [
    {
      name: 'John',
      pv: 10,
      pvMax: 100,
      status: 'alive',
      mana: 100,
      manaMax: 100,
      id: 1,
      abilities: [
        { name: 'Attaque', type: 'damage', damage: 5, manaCost: 0 },
        { name: 'Soin', type: 'heal', healAmount: 20, manaCost: 20 },
        { name: 'Mana Drain', type: 'manaDrain', damage: 10, manaGain: 10, manaCost: 0 },
        { name: 'Ultimate', type: 'ultimate', damage: 20, manaCost: 30 },
      ],
    },
    
    {
      name: "Jack",
      pv: 10,
      pvMax: 100,
      status: 'alive',
      mana: 100,
      manaMax: 100,
      id: 2,
      abilities: [
        { name: 'Attaque', type: 'damage', damage: 5, manaCost: 0 },
        { name: 'Soin', type: 'heal', healAmount: 20, manaCost: 20 },
        { name: 'Mana Drain', type: 'manaDrain', damage: 10, manaGain: 10, manaCost: 0 },
        { name: 'Ultimate', type: 'ultimate', damage: 20, manaCost: 30 },
      ],
    },
    {
      name: "Jessy",
      pv: 10,
      pvMax: 100,
      status: 'alive',
      mana: 100,
      manaMax: 100,
      id: 3,
      abilities: [
        { name: 'Attaque', type: 'damage', damage: 5, manaCost: 0 },
        { name: 'Soin', type: 'heal', healAmount: 20, manaCost: 20 },
        { name: 'Mana Drain', type: 'manaDrain', damage: 10, manaGain: 10, manaCost: 0 },
        { name: 'Ultimate', type: 'ultimate', damage: 20, manaCost: 30 },
      ],
    },
    {
      name: "Jenny",
      pv: 10,
      pvMax: 100,
      status: 'alive',
      mana: 100,
      manaMax: 100,
      id: 4,
      abilities: [
        { name: 'Attaque', type: 'damage', damage: 5, manaCost: 0 },
        { name: 'Soin', type: 'heal', healAmount: 20, manaCost: 20 },
        { name: 'Mana Drain', type: 'manaDrain', damage: 10, manaGain: 10, manaCost: 0 },
        { name: 'Ultimate', type: 'ultimate', damage: 20, manaCost: 30 },
      ],
    }
  ],
  monster: {
    name: 'Monster',
    pv: '800',
    pvMax: '800',
    status: 'alive',
    specialAttack: [{name: 'Special Attack', type: 'damage', damage: 10}],
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
      const attackingPlayer = state.players.find(player => player.id === attackingPlayerId);
    
      if (attackingPlayer && attackingPlayer.mana >= attackingPlayer.abilities[0].manaCost) {
        const hit = attackingPlayer.abilities[0].damage;
        state.monster.pv -= hit;
    
        attackingPlayer.mana -= attackingPlayer.abilities[0].manaCost;
    
        if (state.monster.pv < 0) {
          state.monster.pv = 0;
        }
    
        state.lastAttackingPlayer = attackingPlayer;
      } else {
        console.log("Pas assez de mana pour attaquer.");
      }
    },
    HealAbility: (state, action) => {
      const { playerId } = action.payload;
      const player = state.players.find((p) => p.id === playerId);

      const canUseAbility = player && player.mana >= player.abilities[1].manaCost;

      canUseAbility
        ? ((player.pv += player.abilities[1].healAmount),
          (player.mana -= player.abilities[1].manaCost),
          (player.pv = Math.min(player.pv, player.pvMax)))
        : console.log("Pas assez de mana pour utiliser la capacité de soin.");
    },

    ManaDrainAbility: (state, action) => {
      const { playerId } = action.payload;
      const player = state.players.find((p) => p.id === playerId);

      const canUseAbility = player && player.mana >= player.abilities[2].manaCost;

      canUseAbility
        ? ((state.monster.pv -= player.abilities[2].damage),
          (player.mana += player.abilities[2].manaGain),
          (player.mana -= player.abilities[2].manaCost),
          (state.monster.pv = Math.max(state.monster.pv, 0)))
        : console.log("Pas assez de mana pour utiliser la capacité de drain de mana.");
    },

    UltimateAbility: (state, action) => {
      const { playerId } = action.payload;
      const player = state.players.find((p) => p.id === playerId);

      const canUseAbility = player && player.mana >= player.abilities[3].manaCost;

      canUseAbility
        ? ((state.monster.pv -= player.abilities[3].damage),
          (player.mana -= player.abilities[3].manaCost),
          (state.monster.pv = Math.max(state.monster.pv, 0)))
        : console.log("Pas assez de mana pour utiliser la capacité ultime.");
    },


    hitBack: (state, action) => {
      const hitBackPlayerId = action.payload.id;
      const hitBackPlayer = state.players.find(player => player.id === hitBackPlayerId);
    
      if (hitBackPlayer) {
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

reduceMana: (state, action) => {
  const { manaCost, playerId } = action.payload;
  const player = state.players.find((p) => p.id === playerId);

  if (player) {
    player.mana -= manaCost;

    if (player.mana < 0) {
      player.mana = 0;
    }
  }
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
} = fightSlice.actions;
