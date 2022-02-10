import logging

from decouple import config
from telethon import TelegramClient

logging.basicConfig(
    format="[%(levelname) 5s/%(asctime)s] %(name)s: %(message)s", level=logging.WARNING
)
BOT_TOKEN = config("TOKEN")
AUTH_CHATS = config("AUTH_CHATS")
tgbot = TelegramClient(None, 6, "eb06d4abfb49dc3eeb1aeb98ae0f581e").start(bot_token=BOT_TOKEN)

print("OK?")
