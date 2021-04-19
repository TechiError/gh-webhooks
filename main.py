import io
import logging
import random
import sys
import traceback
import uvicorn
from decouple import config
from tg.client import tgbot
from fastapi import FastAPI,Request
#from flask import Flask, request, Response

"""logging.basicConfig(
    format="[%(levelname) 5s/%(asctime)s] %(name)s: %(message)s", level=logging.WARNING
)

APP_ID = config("APP_ID", default=None, cast=int)
API_HASH = config("API_HASH", default=None)
BOT_TOKEN = config("BOT_TOKEN", default=None)

tgbot = TelegramClient("kensur", APP_ID, API_HASH)"""

#app = Flask("Kek")
app = FastAPI()
print("Successfully deployed!")
tgbot.start()

@app.post('/webhook')
async def respond(request: Request):
    result = await request.json()
#    await tgbot.start(bot_token=BOT_TOKEN)
    #print(request.json)
    try:
        #check_s = result["check_suite"]
        #umm = check_s["app"]["head_commit"]
        umm = result["head_commit"]
        commit_msg = umm["message"]
        commit_id = umm["id"]
        commit_url = umm["url"]
        commit_timestamp = umm["timestamp"]
        committer_name = umm["author"]["username"]
        committer_mail = umm["author"]["email"]
        await tgbot.send_message(-1001237141420, f"Commit: [`{commit_id}`]({commit_url})\nMessage: *{commit_msg}*\nTimeStamp: `{commit_timestamp}`\nCommiter: {committer_name} <{committer_mail}>")
    except:
        traceback.print_exc()
    #return Response(status=200)


