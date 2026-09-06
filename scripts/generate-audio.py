"""Build-time only. Reads authored text manifest; writes static US/UK MP3 files."""
import asyncio, json, sys, pathlib
sys.path.insert(0, str(pathlib.Path('tmp/audio-deps').resolve()))
import edge_tts
async def main():
    items=json.loads(pathlib.Path('tmp/audio-manifest.json').read_text(encoding='utf-8'))
    gate=asyncio.Semaphore(3)
    errors=[]
    async def one(item):
        path=pathlib.Path('public/audio') / (item['id']+'.mp3')
        if path.exists() and path.stat().st_size>500: return
        async with gate:
            for attempt in range(3):
                try:
                    await asyncio.wait_for(edge_tts.Communicate(item['text'], 'en-GB-SoniaNeural' if item['accent']=='uk' else 'en-US-JennyNeural',rate='-10%').save(str(path)),45)
                    return
                except Exception as e:
                    if attempt==2: errors.append([item['id'],str(e)])
                    else: await asyncio.sleep(2+attempt)
    pathlib.Path('public/audio').mkdir(parents=True,exist_ok=True)
    for i in range(0,len(items),30):
        await asyncio.gather(*(one(x) for x in items[i:i+30]))
        print(f'{min(i+30,len(items))}/{len(items)} processed; errors {len(errors)}',flush=True)
    pathlib.Path('tmp/audio-errors.json').write_text(json.dumps(errors),encoding='utf-8')
    if errors: raise SystemExit(f'{len(errors)} audio items failed')
asyncio.run(main())
