import { Bot } from "https://deno.land/x/grammy@v1.18.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

config({ safe: true });

const port : number = Number(Deno.env.get("PORT")) || 3000;
const chats = Deno.env.get("AUTH_CHATS")?.split(" ") || [];

// Create a new bot
const bot = new Bot(Deno.env.get("TOKEN")!);

export { port, chats };
export default bot;
