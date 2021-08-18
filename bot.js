require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");

const token = process.env.BOT_API_TOKEN;
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(token);

const { getDefaultClient } = require("@rightech/api");

const api = getDefaultClient({
  token: process.env.RIC_API_TOKEN,
});

bot.command("send", async (ctx) => {
  const objects = await api.get("objects");
  const buttons = objects.map((x) =>
    Markup.button.callback(x.name, `cmd ${x._id}`)
  );

  return ctx.reply(
    "Select object",
    Markup.inlineKeyboard(buttons, {
      columns: 1,
    })
  );
});

bot.action(/cmd (.*) (.*)/, async (ctx) => {
  console.log("cmd action xxx", ctx.match);

  await ctx.answerCbQuery();

  try {
    await api.post(`objects/${ctx.match[1]}/commands/${ctx.match[2]}`);
    await ctx.editMessageText("ok");
  } catch (err) {
    await ctx.editMessageText(`error: ${err.message}`);
  }
});

bot.action(/cmd (.*)/, async (ctx) => {
  console.log("cmd action", ctx.match);

  const object = await api.get(`objects/${ctx.match[1]}`);
  const cmds = await api.get(`models/${object.model}/commands`);

  const buttons = cmds.map((x) =>
    Markup.button.callback(x.name, `cmd ${object._id} ${x.id}`)
  );

  await ctx.answerCbQuery();

  await ctx.editMessageText(
    "Select command",
    Markup.inlineKeyboard(buttons, { columns: 1 })
  );
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
