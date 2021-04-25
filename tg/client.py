from decouple import config
#from telethon import Button, TelegramClient, events
from telethon import TelegramClient
import logging
logging.basicConfig(
    format="[%(levelname) 5s/%(asctime)s] %(name)s: %(message)s", level=logging.WARNING
)

APP_ID = config("APP_ID", default=None, cast=int)
API_HASH = config("API_HASH", default=None)
BOT_TOKEN = config("BOT_TOKEN", default=None)

tgbot = TelegramClient("kensur", api_id=APP_ID, api_hash=API_HASH).start(bot_token=BOT_TOKEN)

tgbot.run_until_disconnected()
