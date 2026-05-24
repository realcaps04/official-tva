import urllib.request, re, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

videos = [
    ('ol3Y1HhaavM', 'https://www.youtube.com/watch?v=ol3Y1HhaavM'),
    ('YDvtoLZKVDg', 'https://www.youtube.com/watch?v=YDvtoLZKVDg'),
    ('1kmwxA91SUQ', 'https://www.youtube.com/watch?v=1kmwxA91SUQ'),
]

for vid_id, url in videos:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8', errors='replace')
        m = re.search(r'"og:title"[^>]*content="([^"]+)"', html)
        if not m:
            m = re.search(r'content="([^"]+)"[^>]*property="og:title"', html)
        if not m:
            m = re.search(r'<title>(.+?) - YouTube</title>', html)
        title = m.group(1) if m else 'NOT FOUND'
        print(vid_id + ' :: ' + title)
    except Exception as e:
        print(vid_id + ' ERROR: ' + str(e))
