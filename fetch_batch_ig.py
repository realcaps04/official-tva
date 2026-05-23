import urllib.request, re, ssl, time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    ("demon", "https://www.instagram.com/its.demon._?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="),
    ("messboi_goku", "https://www.instagram.com/messboi_gokuo7?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="),
    ("balan_k_nair", "https://www.instagram.com/ig_mallu.viner?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="),
    ("savage", "https://www.instagram.com/s1vage_op?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="),
    ("maddy_kindi", "https://www.instagram.com/maddykindi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="),
    ("moby", "https://www.instagram.com/moby.xd?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="),
    ("ash", "https://www.instagram.com/ash_brutal?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="),
    ("lex", "https://www.instagram.com/lx2_pc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==")
]

for name, url in urls:
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
    time.sleep(2)
