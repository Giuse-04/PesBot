// Command to refresh the tournament table 

// /refresh_table <OK/NO>


const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const tablePath = path.join(__dirname, '../../table.json');

module.exports = {
data: new SlashCommandBuilder()
.setName('refresh_table')
.setDescription('Reinicia la tabla del torneo!')
.addStringOption(option =>
  option.setName('are_you_sure')
    .setDescription('Estas seguro que queres reiniciar la tabla?')
          .setRequired(true)
          .addChoices(
            { name: 'Si', value: 'OK' },
            { name: 'No', value: 'NO' },
          )),
  // Using an interaction response method confirms to Discord that your bot successfully received the interaction, and has responded to the user.
async execute(interaction) {
  if (interaction.options.getString('are_you_sure') !== 'OK') {
    await interaction.reply('No se ha reiniciado la tabla del torneo!');
    return;
  }
  const tableData = JSON.parse(fs.readFileSync(tablePath, 'utf8'));
  tableData.players = []
  // Save the updated table data back to the file
  fs.writeFileSync(tablePath, JSON.stringify(tableData, null, 2));
  await interaction.reply('La tabla del torneo ha sido reiniciada!');
},
};