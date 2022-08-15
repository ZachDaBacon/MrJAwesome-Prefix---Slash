const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('This command will ban a user from your server')
    .addUserOption(option => option.setName('target').setDescription('The user you would like to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('What is the reason you would like to ban the user?')),
    async execute(interaction, client) {

        const targetUser = interaction.options.getUser('target');
        const targetMember = await interaction.guild.members.fetch(targetUser.id);

        let reason = interaction.options.getString('reason');

        const embedErrorPerms = new MessageEmbed()
        .setDescription(`Oh Oh! Seems as if you dont have perms to ban members (\`BAN_MEMBERS\`) 😮. If you think this is an error, please report it to server staff.`)
        .setColor("BLUE")
        .setFooter(`Server Name: ${interaction.guild.name}`)

        if (!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply({ embeds: [embedErrorPerms],  ephemeral: true})
        if (!targetMember) return await interaction.reply({ content: 'This user, is not in the server!', ephemeral: true})
        if (!targetMember.kickable) return interaction.reply({ content: 'This user is either because their role is higher then me or yourself.', ephmeral: true})

        const dmEmbed = new MessageEmbed()
        .setDescription(`You have been banned from **${interaction.guild.name}** | ${reason}`)
        .setColor("BLUE")
        .setFooter(`Banned From: ${interaction.guild.name}`)

        const embedBanned = new MessageEmbed()
        .setDescription(`${targetUser.tag} has been **banned**. | ${reason}`)
        .setColor("BLUE")
        .setFooter(`Banned By: ${interaction.user.tag}`)

        const embedError = new MessageEmbed()
        .setDescription(`Oh Oh! I failed to ban ${targetUser.tag} 😮. Try again, lets hope it works this time 😅.`)
        .setColor("BLUE")
        .setFooter(`Server Name: ${interaction.guild.name}`)

        await targetMember.send({ embeds: [dmEmbed] }).catch(err => {console.log('I cannot send DMS to this user!')})

        await targetMember.ban({ reason: reason}).catch(err => {interaction.user.send({embeds: [embedError]})})

        await interaction.reply({ embeds: [embedBanned] })
    },
}