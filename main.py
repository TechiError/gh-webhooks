import io
import os
import logging
import random
import sys
import subprocess
import traceback
import threading
import uvicorn
import requests
from decouple import config
#from pyrogram import (
#    Client,
#    __version__
#)
BOT_TOKEN = config("TOKEN")
from fastapi import FastAPI,Request
#from flask import Flask, request, Response
print("Successfully deployed!")
app = FastAPI(debug=True)
API = f'https://api.telegram.org/bot{BOT_TOKEN}/'
def post_tg(chat, message, parse_mode):
    """Send message to desired group"""
    response = requests.post(
        API + "sendMessage",
        params={
            "chat_id": chat,
            "text": message,
            "parse_mode": parse_mode,
            "disable_web_page_preview": True}).json()
    return response

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
        post_tg(-1001237141420, f"Commit: [`{commit_id}`]({commit_url})\nMessage: *{commit_msg}*\nTimeStamp: `{commit_timestamp}`\nCommiter: {committer_name} <{committer_mail}>", "markdown")
    except:
        traceback.print_exc()
    #return Response(status=200)


"""tgbot = Client("kensur",
                   api_id=APP_ID,
                   api_hash=API_HASH,
                   bot_token=BOT_TOKEN)"""

if __name__ == "__main__":
    print("Started")
    PORT = config("PORT")
    uvicorn.run("main:app", host="0.0.0.0", port=int(PORT), log_level="info")
    #subprocess.run("cd tg && python3 client.py", shell=True, check=True)
