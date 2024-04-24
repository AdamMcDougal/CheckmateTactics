"use client";
import React, { useState } from 'react';
import axios from 'axios';


const PlayerSearch = ({ setSearchText, getPlayerGames }) => (
  <div className="text-center bg-gray-900 text-white font-bold pb-6 pt-1">
    <h2 className='text-2xl pb-10'>Checkmate Tactics</h2>
    <p>Enter a player's name to see their last 5 games</p>
    <p className='pb-6'>Player name example: Rikiroll</p>
    <div className="flex justify-center">
      <input type="text" onChange={(e) => setSearchText(e.target.value)} className="border-2 border-gray-800 px-2 py-1 rounded-md mr-2 text-black"/>
      <button onClick={getPlayerGames} className="bg-blue-500 text-white px-4 py-2 rounded-md">Search</button>
    </div>
  </div>
);


const ItemList = ({ items }) => (
  <td className="text-center">
    {items.map((item, index) => (
      <div key={index} className="inline-flex">
        {item !== 0 ? (
          <img
            className="h-8 w-8 rounded-full"
            src={`https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${item}.png`}
            alt={item}
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-black"></div>
        )}
      </div>
    ))}
  </td>
);


const ParticipantRow = ({ participant }) => {
  const rowColor =
    participant.teamId === 100 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(248, 113, 113, 0.2)';

  return (
    <tr style={{ backgroundColor: rowColor }}>
      <td className=" text-black">
        <div className="flex items-center">
          <img className="h-11 w-11 rounded-full mr-2 ml-2" src={`https://ddragon.leagueoflegends.com/cdn/14.8.1/img/champion/${participant.championName}.png`} alt={participant.championName}/>
          <span>{participant.summonerName || participant.riotIdGameName}</span>
        </div>
      </td>
      <td className="text-center">
        {participant.kills} / {participant.deaths} / {participant.assists} ({((participant.kills + participant.assists) / participant.deaths).toFixed(2)} KDA)
      </td>
      <td className="text-center">{participant.totalDamageDealt}</td>
      <td className="text-center">{participant.wardsPlaced}</td>
      <td className="text-center">{participant.totalMinionsKilled + participant.neutralMinionsKilled}</td>
      <ItemList items={[participant.item0, participant.item1, participant.item2, participant.item3, participant.item4, participant.item5, participant.item6]} />
    </tr>
  );
};




const TeamTable = ({ team, participants }) => (
  <table className="w-full">
    <thead>
      <tr>
        <th>
          {team.win ? 'Victory' : 'Defeat'} ({team.teamId === 100 ? 'Blue Team' : 'Red Team'})
        </th>
        <th>KDA</th>
        <th>Damage</th>
        <th>Wards</th>
        <th>CS</th>
        <th>Items</th>
      </tr>
    </thead>
    <tbody>
      {participants
        .filter((p) => p.teamId === team.teamId)
        .map((participant, index) => (
          <ParticipantRow key={index} participant={participant} />
        ))}
    </tbody>
  </table>
);


const GameDetails = ({ gameData, index }) => (
  <div className="bg-gray-200 my-4 p-4 font-bold">
    <h3 className="text-center text-2xl pb-2">Game {index + 1}</h3>
    <TeamTable team={gameData.info.teams[0]} participants={gameData.info.participants} />
    <TeamTable team={gameData.info.teams[1]} participants={gameData.info.participants} />
  </div>
);


export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [gameList, setGameList] = useState([]);

  const getPlayerGames = () => {
    axios
      .get(`http://localhost:4000/past5Games`, { params: { username: searchText } })
      .then((response) => {
        setGameList(response.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="container mx-auto">
      <PlayerSearch setSearchText={setSearchText} getPlayerGames={getPlayerGames} />
      {gameList.length !== 0 ? (
        <>
          {gameList.map((gameData, index) => (
            <GameDetails key={index} gameData={gameData} index={index} />
          ))}
        </>
      ) : (
        <p className="text-center">No games found</p>
      )}
    </div>
  );
}