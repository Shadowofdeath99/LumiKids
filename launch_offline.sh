#!/usr/bin/env bash
PORT=8765
DIR="$HOME/LumiKids"

# تشغيل الخادم المحلي في الخلفية إذا لم يكن يعمل بالفعل
if ! pgrep -f "http.server $PORT" >/dev/null 2>&1; then
  nohup python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$DIR" >/dev/null 2>&1 &
  sleep 0.6
fi

URL="http://127.0.0.1:$PORT/index.html"
if command -v google-chrome >/dev/null; then
  google-chrome --app="$URL"
elif command -v chromium-browser >/dev/null; then
  chromium-browser --app="$URL"
elif command -v brave-browser >/dev/null; then
  brave-browser --app="$URL"
else
  xdg-open "$URL"
fi
