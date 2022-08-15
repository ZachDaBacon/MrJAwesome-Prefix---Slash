const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('This command will warn a user from your server')
    .addUserOption(option => option.setName('target').setDescription('The user you would like to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('What is the reason you would like to warn the user?')),
    async execute(interaction, client) {

        const targetUser = interaction.options.getUser('target');
        const targetMember = await interaction.guild.members.fetch(targetUser.id);

        const embedErrorPerms = new MessageEmbed()
        .setDescription(`Oh Oh! Seems as if you dont have perms to warn members (\`KICK_MEMBERS\`) 😮. If you think this is an error, please report it to server staff.`)
        .setColor("BLUE")
        .setFooter(`Server Name: ${interaction.guild.name}`)

        let reason = interaction.options.getString('reason');

        if (!interaction.member.permissions.has("KICK_MEMBERS")) return interaction.reply({ embeds: [embedErrorPerms],  ephemeral: true})
        if (!targetMember) return await interaction.reply({ content: 'The user mentioned is no longer within the server.', ephemeral: true})

        const dmEmbed = new MessageEmbed()
        .setDescription(`You have been warned within **${interaction.guild.name}** | ${reason}`)
        .setColor("BLUE")
        .setFooter(`Server Warned In: ${interaction.guild.name}`)

        const embed = new MessageEmbed()
        .setDescription(`${targetUser.tag} has been **warned**. | ${reason}`)
        .setColor("BLUE")
        .setFooter(`Server Name: ${interaction.guild.name}`)

        await targetMember.send({ embeds: [dmEmbed] }).catch(err => {console.log('I cannot send DMS to this user!')})

        await interaction.reply({ embeds: [embed] })
    },
}