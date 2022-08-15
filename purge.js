const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Message, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Purge an amount of messages within this channel') 
    .addIntegerOption((option) => {
        return option
        .setName('amount') // the option name 
        .setDescription('amount of messages you wish to delete')
        .setRequired(true)
    }),
    async execute(interaction, client) {

        var amount = interaction.options.getInteger('amount')

        if(!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ content: "You don't have `MANAGE_MESSAGES` permission to use this command" });
        if(!interaction.guild.me.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: "I don't have `MANAGE_MESSAGES` permission to use this command" });


        if(isNaN(amount))
        return interaction.reply({ content: '**Please specufy a valid amount beetween 1 - 100!*' })

        if(parseInt(amount) > 99) {
           return interaction.reply({ content: '**I can only delete 99 messages at once!**', ephemeral: true }) 
        } else {
            try {
            let { size } = await interaction.channel.bulkDelete(amount)


   const embed = new MessageEmbed()
  .setColor("BLUE")
  .setDescription(`:white_check_mark: ${interaction.user.username} Deleted **${amount}** messages.`)
  .setFooter(`Purge Done By: ${interaction.user.tag}`)

  await interaction.reply({ embeds: [embed]})  } catch(e) { // if error (mostly because trying to delete older then 14 days)
    console.log(e)

    const embedForError = new MessageEmbed()
    .setColor("BLUE")
    .setDescription(`🚨 **ERROR** 🚨 \n\n I am not sure what this is, but it may be.. I cannot delete messages that are older than 14 days. (This is due to discord limitations)`)
    .setFooter(`Error | Server Name: ${interaction.guild.nam,e}`) 


    interaction.reply({ embeds: [embedForError], ephemeral: true})
}}
            }
        }