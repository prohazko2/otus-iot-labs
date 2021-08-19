require("dotenv").config();

const db = require("./db");

const { Telegraf, Markup } = require("telegraf");

const token = process.env.BOT_API_TOKEN;
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(token);

bot.use(Telegraf.log());

const { getDefaultClient } = require("@rightech/api");

const api = getDefaultClient({
  token: process.env.RIC_API_TOKEN,
});

function findLocalUser(username) {
  return db.users.find((x) => x.username === username);
}

const objectId = "60f9c359c900af0010d613d5";

const hello = `
Привет через этого бота можно отправлять команды

/info - информация об устройстве
/open - открыть замок
/close - закрыть замок
`;

bot.command("start", (ctx) => ctx.reply(hello));

bot.use((ctx, next) => {
  if (!findLocalUser(ctx.chat.username)) {
    return ctx.reply("go away");
  }
  next();
});

bot.command("info", async (ctx) => {
  const object = await api.get(`objects/${objectId}`);

  ctx.reply(`
name: ${object.name}
time: ${new Date(object.state.time).toLocaleString("ru")}
online: ${object.state.online ? "yes" : "no"} 
`);
});

bot.command("open", async (ctx) => {
  try {
    await api.post(`objects/${objectId}/commands/open`);
    ctx.reply("ok");
  } catch (err) {
    ctx.reply(err.message);
  }
});

bot.command("close", async (ctx) => {
  try {
    await api.post(`objects/${objectId}/commands/close`);
    ctx.reply("ok");
  } catch (err) {
    ctx.reply(err.message);
  }
});

bot.command("send", async (ctx) => {
  console.log(ctx.message.text.split(/\s+/));

  const object = await api.get(`objects/${objectId}`);
  const cmds = await api.get(`models/${object.model}/commands`);

  const buttons = cmds.map((x) =>
    Markup.button.callback(x.name, `send-cmd ${x.id}`)
  );

  return ctx.reply(
    "Select command",
    Markup.inlineKeyboard(buttons, {
      columns: 1,
    })
  );
});

bot.action(/send-cmd (.*)/, async (ctx) => {
  console.log("1", ctx.update.callback_query.data);
  console.log("2", ctx.match);

  await ctx.answerCbQuery("sending ...");

  try {
    await api.post(`objects/${objectId}/commands/${ctx.match[1]}`);
    ctx.editMessageText("ok");
  } catch (err) {
    ctx.editMessageText(err.message);
  }
});

bot.launch();

console.log("bot launched");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
