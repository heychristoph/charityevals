"""Write a model back the way it was written: indented JSON, except that a top-level field the file had on one
line (`"beneficiaries": {"COD":1}`, written by beneficiary-countries.ts) keeps its line while its value is
unchanged, so a script that edits rows changes only the rows.

    from keep_json import dumps_like
    path.write_text(dumps_like(model, original_text))
"""
import json, re


def dumps_like(obj, original, indent=None):
    if indent is None:
        indent = 1 if original.startswith('{\n "') else 2
    pad = " " * indent
    kept = {}
    for line in original.split("\n"):
        mm = re.match(r'^' + pad + r'"([^"]+)": (.*?),?$', line)
        if not mm or mm.group(2)[:1] not in "{[" :
            continue
        try:
            kept[mm.group(1)] = (json.loads(mm.group(2)), mm.group(2))
        except ValueError:
            continue
    parts = []
    for k, v in obj.items():
        if k in kept and kept[k][0] == v:
            parts.append(f'{pad}{json.dumps(k)}: {kept[k][1]}')
        else:
            parts.append(f'{pad}{json.dumps(k)}: ' + json.dumps(v, indent=indent, ensure_ascii=False).replace("\n", "\n" + pad))
    out = "{\n" + ",\n".join(parts) + "\n}\n"
    assert json.loads(out) == obj
    return out
