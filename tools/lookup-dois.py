import json, re, sys, time, urllib.parse, urllib.request, difflib
pubs = json.load(open(sys.argv[1]))
UA = {'User-Agent': 'portfolio-doi-lookup/1.0'}
def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)
norm = lambda s: re.sub(r'[^a-z0-9 ]', '', s.lower())
out = {}
for p in pubs:
    if p['type'] == 'patent':
        continue
    q = urllib.parse.quote(p['title'])
    best = None
    try:
        items = get(f'https://api.crossref.org/works?query.bibliographic={q}&rows=5&select=DOI,title,container-title,issued,type,author')['message']['items']
        for it in items:
            t = (it.get('title') or [''])[0]
            r = difflib.SequenceMatcher(None, norm(t), norm(p['title'])).ratio()
            if not best or r > best[0]:
                best = (r, it['DOI'], t, (it.get('container-title') or [''])[0], it.get('issued', {}).get('date-parts', [[None]])[0][0], it.get('type'))
    except Exception as e:
        print('crossref err', p['id'], e, file=sys.stderr)
    out[p['id']] = best
    print(f"{p['id']:26} {best[0] if best else 0:.2f} {best[1] if best else '-':40} {(best[3] if best else '')[:40]:40} {best[4] if best else ''}")
    time.sleep(0.4)
json.dump(out, open(sys.argv[2], 'w'), indent=1)
