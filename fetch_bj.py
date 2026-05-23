import urllib.request, re, ssl, time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://www.instagram.com/blindjok3r?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
name = "blind_joker"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    match = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html)
    if match:
        img_url = match.group(1).replace('&amp;', '&')
        urllib.request.urlretrieve(img_url, f'public/images/{name}.jpg')
        print(f'Downloaded {name}')
    else:
        print(f'Image not found for {name}')
except Exception as e:
    print(f'Error for {name}: {e}')
