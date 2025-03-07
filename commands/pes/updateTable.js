// Description: Handles the updateTable command.
// Input example: /updateTable playerOne: "Player 1" goalsOne: 2 goalsTwo: 1 playerTwo: "Player 2"

// /update_table marcelo 2 1 juan

const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const tablePath = path.join(__dirname, '../../table.json');


// Function to load player choices from the JSON file
function loadPlayerChoices() {
  const tableData = JSON.parse(fs.readFileSync(tablePath, 'utf8'));
  return tableData.players.map(player => ({ name: player.name, value: player.name }));
}


// Function to update the player data in the table
function updatePlayerData(tableData, playerName, goalsFor, goalsAgainst) {
  if (!tableData.players) {
    tableData.players = [];
  }
  let player = tableData.players.find(player => player.name === playerName);
  if (!player) {
    player = { name: playerName, points: 0, globalGoals:0, matchesPlayed:0 };
    tableData.players.push(player);
  }
  let goals = goalsFor - goalsAgainst
  player.globalGoals += goals
  player.matchesPlayed += 1;
  if (goalsFor > goalsAgainst) {
    player.points += 3; // Win
  } else if (goalsFor === goalsAgainst) {
    player.points += 1; // Draw
  }
}

module.exports = {
data: new SlashCommandBuilder()
.setName('update_table')
.setDescription('Actualiza la tabla del torneo!')
.addStringOption(option => {
  option.setName('player_one')
    .setDescription('Nombre del jugador 1')
    .setRequired(true);

    const playerChoices = loadPlayerChoices();
    playerChoices.forEach(choice => option.addChoices(choice));

    return option;
  })
  .addIntegerOption(option =>
  option.setName('goals_one')
          .setDescription('Goles del jugador 1')
          .setRequired(true)
          .setMinValue(0))
  .addIntegerOption(option =>
      option.setName('goals_two')
          .setDescription('Goles del jugador 2')
          .setRequired(true)
          .setMinValue(0))
  .addStringOption(option => {
    option.setName('player_two')
      .setDescription('Nombre del jugador 2')
      .setRequired(true);
      
      const playerChoices = loadPlayerChoices();
      playerChoices.forEach(choice => option.addChoices(choice));

      return option;
    }),
  // Using an interaction response method confirms to Discord that your bot successfully received the interaction, and has responded to the user.
async execute(interaction) {
  const playerOne = interaction.options.getString('player_one');
  const goalsOne = interaction.options.getInteger('goals_one');
  const goalsTwo = interaction.options.getInteger('goals_two');
  const playerTwo = interaction.options.getString('player_two');

  // Load the current table data
  const tableData = JSON.parse(fs.readFileSync(tablePath, 'utf8'));

  // Update the player data for both players
  updatePlayerData(tableData, playerOne, goalsOne, goalsTwo);
  updatePlayerData(tableData, playerTwo, goalsTwo, goalsOne);

  // Save the updated table data back to the file
  fs.writeFileSync(tablePath, JSON.stringify(tableData, null, 2));

  await interaction.reply(`Match result added: ${playerOne} ${goalsOne} - ${goalsTwo} ${playerTwo}`);
 },
};