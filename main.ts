// Purpose: Main file for the bot
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.18.1/mod.ts";
import bot, { chats, port } from "./config.ts";
import { getRepoDetails } from "./functions.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

// Register a GET route for the root path
router.get("/", (ctx) => {
  ctx.response.body = "Hello world!";
});

// Register a POST route for the webhook from github
router.post("/webhook", async (ctx) => {
  const { value } = await ctx.request.body();
  // promise to string deno
  const body = await value;
  if (body.commits) {
    let message =
      `<b>${body.repository.name}</b>: ${body.commits.length} new Commit(s) to <b>${
        body.ref.split("/")[2]
      }</b>\n\n`;
    for (const commit of body.commits) {
      message += `- <code>${
        commit.id.slice(0, 7)
      }</code> by <b>${commit.author.name}</b>\n`;
      message += `-   ${commit.message}\n\n`;
    }
    message += `#GithubBot`;
    const keyboard = new InlineKeyboard()
      .url("View Diff", body.compare)
      .url("View Commit", body.head_commit.url);
    for (const chat of chats) {
      const chatinfo = await bot.api.getChat(chat);
      const [chatId, replyToMessageId] = chat.split(":");
      if (chatinfo.is_forum) {
        await bot.api.sendMessage(Number(chatId), message, {
          parse_mode: "HTML",
          reply_markup: keyboard,
          reply_to_message_id: Number(replyToMessageId),
        });
      } else {
        await bot.api.sendMessage(chatId, message, {
          parse_mode: "HTML",
          reply_markup: keyboard,
        });
      }
    }
  } else if (body.action == "created") {
    const message =
      `🌟 <a href="${body.sender.html_url}">${body.sender.login}</a> starred <a href="${body.repository.html_url}">${body.repository.name}</a>\n\n#GithubBot`;
    for (const chat of chats) {
      const [chatId, replyToMessageId] = chat.split(":");
      await bot.api.sendMessage(chatId, message, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_to_message_id: Number(replyToMessageId),
        reply_markup: new InlineKeyboard().text(
          "Total Stars",
          `stargazers${body.repository.full_name}`,
        ),
      });
    }
  } else if (body.forkee) {
    const message =
      `🍴 <a href="${body.sender.html_url}">${body.sender.login}</a> forked <a href="${body.repository.html_url}">${body.repository.name}</a>\n\n#GithubBot`;
    for (const chat of chats) {
      const [chatId, replyToMessageId] = chat.split(":");
      await bot.api.sendMessage(chatId, message, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_to_message_id: Number(replyToMessageId),
        reply_markup: new InlineKeyboard().text(
          "Total Forks",
          `forks${body.repository.full_name}`,
        ),
      });
    }
  }
  ctx.response.body = "OK";
});

bot.command("start", async (ctx) => {
  await ctx.reply(
    `Hello ${ctx.from.first_name}!\nI am a github bot for @TeamUltroid !`,
  );
});

bot.command("ping", async (ctx) => {
  const start = Date.now();
  const message = await ctx.reply("Pinging...");
  await ctx.api.editMessageText(
    message.chat.id,
    message.message_id,
    `\nPing: <code>${Date.now() - start}ms</code>`,
    { parse_mode: "HTML" },
  );
});

bot.command("stats", async (ctx) => {
  // repo status
  const repo = await getRepoDetails("TeamUltroid/Ultroid");
  const message = `Stars: ${repo.stargazers_count}\nForks: ${repo.forks_count}\nWatchers: ${repo.watchers_count}\nOpen Issues: ${repo.open_issues_count}`;
  await ctx.reply(message);
});

bot.command("topics", async (ctx) => {
  // get group info of id x
  const chat = await bot.api.getChat(ctx.chat.id);
  // reply the whole message
  const message = await chat;
  await ctx.reply(message);
});

bot.callbackQuery(RegExp("stargazers(.*)"), async (ctx) => {
  const repo = ctx.callbackQuery.data.replace("stargazers", "");
  const repoDetails = await getRepoDetails(repo);
  const message = `Total Stars: ${repoDetails.stargazers_count}`;
  await ctx.answerCallbackQuery(message);
});

bot.callbackQuery(RegExp("forks(.*)"), async (ctx) => {
  const repo = ctx.callbackQuery.data.replace("forks", "");
  const repoDetails = await getRepoDetails(repo);
  const message = `Total Forks: ${repoDetails.forks_count}`;
  await ctx.answerCallbackQuery(message);
});

// Create a new application
const app = new Application();

// Register the router as middleware
app.use(router.routes());

// Start the application and bot
bot.start();
await app.listen({ port });
