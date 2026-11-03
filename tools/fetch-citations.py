import json, sys, time, urllib.request
cr = json.load(open(sys.argv[1]))
UA = 'portfolio-citation-fetch/1.0'
def neg(doi, accept):
    req = urllib.request.Request(f'https://doi.org/{doi}', headers={'Accept': accept, 'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read().decode('utf-8').strip()
styles = {'apa': 'apa', 'ieee': 'ieee', 'mla': 'modern-language-association', 'chicago': 'chicago-author-date', 'harvard': 'harvard-cite-them-right'}
out = {}
for pid, best in cr.items():
    doi = best[1]
    rec = {'doi': doi}
    try:
        csl = json.loads(neg(doi, 'application/vnd.citationstyles.csl+json'))
        rec['authors'] = [f"{a.get('given','')} {a.get('family','')}".strip() for a in csl.get('author', [])]
        rec['container'] = csl.get('container-title')
        rec['volume'], rec['issue'], rec['page'] = csl.get('volume'), csl.get('issue'), csl.get('page')
        rec['year'] = (csl.get('issued') or {}).get('date-parts', [[None]])[0][0]
        rec['publisher'] = csl.get('publisher')
        rec['url'] = csl.get('URL')
        rec['bibtex'] = neg(doi, 'application/x-bibtex')
        rec['styles'] = {}
        for k, st in styles.items():
            rec['styles'][k] = neg(doi, f'text/x-bibliography; style={st}; locale=en-GB')
            time.sleep(0.2)
        ok = any('mondal' in a.lower() for a in rec['authors'])
        print(f"{pid:26} mondal_author={ok} {rec['year']} vol={rec['volume']} {len(rec['bibtex'])}b")
    except Exception as e:
        print('ERR', pid, e)
    out[pid] = rec
json.dump(out, open(sys.argv[2], 'w'), indent=1, ensure_ascii=False)
