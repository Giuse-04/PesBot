// Command to display the tournament table

// /display_table

const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const tablePath = path.join(__dirname, '../../table.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('display_table')
    .setDescription('Muestra la tabla del torneo!'),
  async execute(interaction) {
    // Load the current table data
    const tableData = JSON.parse(fs.readFileSync(tablePath, 'utf8'));

    // Sort the players by points (and by goal difference if points are equal)
    tableData.players.sort((a, b) => {
      if (b.points === a.points) {
        return (b.globalGoals) - (a.globalGoals);
      }
      return b.points - a.points;
    });

   // Format the table data as a string with fixed width
   let tableString = '🏆 **Tabla del Torneo** 🏆\n\n';
   tableString += '```\n';
   tableString += 'Pos | Jugador       | Puntos | DG  | PJ\n';
   tableString += '----|---------------|--------|-----|----\n';

   tableData.players.forEach((player, index) => {
     tableString += `${String(index + 1).padEnd(3)} | ${player.name.padEnd(13)} | ${String(player.points).padEnd(6)} | ${String(player.globalGoals).padEnd(3)} | ${String(player.matchesPlayed).padEnd(3)}\n`;
   });

   tableString += '```';

   await interaction.reply(tableString);
  },
};