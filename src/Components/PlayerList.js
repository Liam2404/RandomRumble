import React from 'react';
import PlayerCard from './PlayerCard';
import { useSelector } from 'react-redux';


const PlayerList = () => {
  const players = useSelector(state => state.fight.players);

  const displayPlayers = () => {
    return Object.keys(players).map(key => (
      <PlayerCard key={players[key].id} player={players[key]} />
    ));
  };

  return (
    <div className='row'>
      {displayPlayers()}
    </div>
  );
};



export default PlayerList;