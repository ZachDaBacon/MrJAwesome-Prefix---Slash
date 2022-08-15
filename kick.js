const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('This command will kick a user from your server')
    .addUserOption(option => option.setName('target').setDescription('The user you would like to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('What is the reason you would like to kick the user?')),
    async execute(interaction, client) {

        const targetUser = interaction.options.getUser('target');
        const targetMember = await interaction.guild.members.fetch(targetUser.id);

        const embedErrorPerms = new MessageEmbed()
        .setDescription(`Oh Oh! Seems as if you dont have perms to kick members (\`KICK_MEMBERS\`) 😮. If you think this is an error, please report it to server staff.`)
        .setColor("BLUE")
        .setFooter(`Server Name: ${interaction.guild.name}`)

        if (!interaction.member.permissions.has("KICK_MEMBERS")) return interaction.reply({ embeds: [embedErrorPerms],  ephemeral: true})
        if (!targetMember) return await interaction.reply({ content: 'The user mentioned is no longer within the server.', ephemeral: true})
        if (!targetMember.kickable) return interaction.reply({ content: 'I cannot kick this user! This is either because their higher then me or yourself.', ephmeral: true})

        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason was provided."

        const dmEmbed = new MessageEmbed()
        .setDescription(`You have been kicked from **${interaction.guild.name}** | ${reason}`)
        .setColor("BLUE")
        .setFooter(`Kicked From: ${interaction.guild.name}`)

        const embed = new MessageEmbed()
        .setDescription(`${targetUser.tag} has been **kicked**. | ${reason}`)
        .setColor('#5765F2')
        .setFooter(`Server Name: ${interaction.guild.name}`)

        const embedError = new MessageEmbed()
        .setDescription(`Oh Oh! I failed to kick ${targetUser.tag} 😮. Try again, lets hope it works this time 😅.`)
        .setColor("BLUE")
        .setFooter(`Server Name: ${interaction.guild.name}`)

        await targetMember.send({ embeds: [dmEmbed] }).catch(err => {console.log('I cannot send DMS to this user!')})

        await targetMember.kick({ reason: reason}).catch(err => {interaction.user.send({embeds: [embedError]})})

        await interaction.reply({ embeds: [embed] })
    },
}
