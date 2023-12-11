import React, { useEffect } from 'react';
import ButtonCapacity from './ButtonCapacity';
import ProgressBar from './ProgressBar';
import { useDispatch, useSelector } from 'react-redux';

const PlayerCard = (props) => {
  const { player } = props;
  const hasPlayed = useSelector((state) => state.fight.playersWhoPlayed.includes(player.id));
  const isTakingDamage = player.pv < player.previousPv;

  useEffect(() => {
    if (isTakingDamage) {
      const cardElement = document.getElementById(`joueur${player.id}`);
      cardElement.classList.add('shake');

      const animationEndHandler = () => {
        cardElement.classList.remove('shake');
      };

      cardElement.addEventListener('animationend', animationEndHandler);

     
      return () => {
        cardElement.removeEventListener('animationend', animationEndHandler);
      };
    }
  }, [isTakingDamage, player.id]);

  return (
    <div
      key={player.id}
      className={`col-sm-3 card center ${hasPlayed ? 'played-card' : ''} ${isTakingDamage ? 'damage-animation' : ''}`}
      id={`joueur${player.id}`}
    >
      <div className="card-body text-center">
        <h5 className="card-title">
          {player.sprite && <img src={player.sprite} alt="Player Image" className="player-image" />}
          {player.name}
        </h5>
        
        <ProgressBar pv={player.pv} pvMax={player.pvMax} faType="fa-heart" barName=" : pv " bgType="bg-danger"
         className="custom-progress-bar" />
        <ProgressBar pv={player.mana} pvMax={player.manaMax} faType="fa-fire-alt" barName=" : mana " bgType="bg-info"
         className="custom-progress-bar" />
        <span className="badge badge-danger ml-2 " id="degatSpanJ1"></span>
        
<div className="row">
  <div className="ButtonCapacity">
    {player.abilities.slice(0, 2).map((ability, index) => (
      <ButtonCapacity key={index} player={player} ability={ability} />
    ))}
  </div>
  <div className="ButtonCapacity">
    {player.abilities.slice(2).map((ability, index) => (
      <ButtonCapacity key={index + 2} player={player} ability={ability} />
    ))}
  </div>
</div>
      </div>
    </div>
  );
};

export default PlayerCard;
