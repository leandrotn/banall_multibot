const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');


const GUILD_ID = 'id_do_servidor';


async function banMembers(client, bannedMembers) {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const members = await guild.members.fetch();

    for (const member of members.values()) {
      
      if (!member.user.bot && !bannedMembers.has(member.id)) {
        try {
          await member.ban({ reason: 'Remoção em massa solicitada' });
          console.log(`Membro ${member.user.tag} banido.`);
          bannedMembers.add(member.id);
        } catch (error) {
          console.error(`Erro ao banir ${member.user.tag}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao buscar o servidor ou os membros:', error);
  } finally {
    client.destroy();
  }
}


async function main() {
  const tokens = Object.values(config);
  const bannedMembers = new Set();

  for (const token of tokens) {
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

    client.once('ready', () => {
      console.log(`Bot ${client.user.tag} está pronto.`);
      banMembers(client, bannedMembers);
    });

    await client.login(token);
  }
}

main().catch(console.error);
