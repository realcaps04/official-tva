import urllib.request, re, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
req = urllib.request.Request('https://www.instagram.com/eagle.gamingop/', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    match = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html)
    if match:
        img_url = match.group(1).replace('&amp;', '&')
        urllib.request.urlretrieve(img_url, 'public/images/eagle_gaming.jpg')
        print('Downloaded:', img_url)
    else:
        print('Image not found in HTML')
except Exception as e:
    print('Error:', e)
