import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  hitMonster, hitBack,
  updatePlayerStatus, updateMonsterStatus,
  checkDefeat, checkVictory,
  nextTurn, updateLastAttackingPlayer,
  HealAbility, ManaDrainAbility, UltimateAbility,
  playerPlayed,MonsterSpecials,resetPlayersWhoPlayed
} from '../features/fight/fightSlice';

const ButtonCapacity = ({ player, ability }) => {
  const dispatch = useDispatch();
  const monster = useSelector((state) => state.fight.monster);
  const whoPlayed = useSelector((state) => state.fight.playersWhoPlayed)
  const currentTurnPlayerId = useSelector((state) => state.fight.currentTurnPlayerId);

  const combat = () => {
    if (player.status !== 'alive' || player.id !== currentTurnPlayerId) {
      console.log("Le joueur ne peut pas attaquer actuellement.");
      return;
    }

    if (player.status === 'dead') {
      console.log("Le joueur est mort.");
      return;
    }

    const attackingPlayerId = player.id;

    switch (ability.type) {
      case 'heal':
        dispatch(HealAbility({ healAmount: ability.healAmount, playerId: attackingPlayerId }));
        break;

      case 'manaDrain':
        dispatch(ManaDrainAbility({ playerId: attackingPlayerId }));
        break;

      case 'ultimate':
        dispatch(UltimateAbility({ playerId: attackingPlayerId }));
        break;

      default:
        dispatch(hitMonster({ dmg: ability.damage, attackingPlayerId }));
        break;
    }

    dispatch(hitBack({ id: player.id }));
    dispatch(updateLastAttackingPlayer({ playerId: attackingPlayerId }));

    const newStatus = player.pv <= 0 ? 'dead' : 'alive';

    if (newStatus === 'dead') {
      dispatch(updatePlayerStatus({ player: player, status: newStatus }));
      dispatch(checkDefeat());
      console.log('joueur mort');
    } else {
      console.log("attaque.");
    }

    const monsterStatus = monster.pv <= 0 ? 'dead' : 'alive';

    if (monsterStatus === 'dead') {
      dispatch(updateMonsterStatus({ monster: monster, status: monsterStatus }));
      dispatch(checkVictory());
    }

    dispatch(playerPlayed({ playerId: attackingPlayerId }));
    dispatch(nextTurn());
    console.log('Tour suivant');

    if (whoPlayed.length === 4) {
      
      dispatch(MonsterSpecials());
      dispatch(resetPlayersWhoPlayed());
    }

  };

  return (
    <div>
      <button type="button" onClick={combat} className="btn btn-success material-tooltip-main">
        {ability.name}
        <i className="fas fa-bomb"></i> {ability.damage}
        <i className="fas fa-fire-alt"></i> - {ability.manaCost}
      </button>
    </div>
  );
};

export default ButtonCapacity;
