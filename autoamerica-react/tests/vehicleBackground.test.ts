import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { modelKey, officialToyotaPage, localVideoPath, approvedVideo, allowBackgroundMotion } from '../src/lib/vehicleBackground.ts';
const valid = { modelId: 'prado', src: '/media/videos/prado-12345678.mp4', mime: 'video/mp4', sourcePage: 'https://www.toyota.com/vehicles/landcruiser/2027', market: 'CO', modelYear: 2027, variant: 'tx', reviewedBy: 'test-reviewer', reviewedAt: '2026-10-20', approvalReference: 'test-approval', approved: true, matchesColombia: true };
test('model key recognizes an exact supported reference', () => assert.equal(modelKey('new:prado'), 'prado'));
test('marketing records never inherit media of a reference vehicle', () => assert.equal(modelKey('new:prado','marketing'), undefined));
test('unknown and similar names never inherit a Toyota background', () => { assert.equal(modelKey('prado-us'),undefined); assert.equal(modelKey('used:prado'),undefined); });
test('Toyota retail sources are explicit', () => { assert.ok(officialToyotaPage('https://www.toyota.com/rav4/')); assert.ok(officialToyotaPage('https://www.toyota.com.co/')); });
test('lookalike and editorial-only source domains are not enabled', () => { assert.equal(officialToyotaPage('https://www.toyota.com.attacker.example/video'),false); assert.equal(officialToyotaPage('https://pressroom.toyota.com/video'),false); });
test('source cannot carry login credentials or insecure HTTP', () => { assert.equal(officialToyotaPage('https://name:secret@www.toyota.com/'),false); assert.equal(officialToyotaPage('http://www.toyota.com/'),false); });
test('direct playback accepts local MP4 and WebM only', () => { assert.ok(localVideoPath('/media/videos/rav4-abcd.mp4')); assert.ok(localVideoPath('/media/videos/prado.webm')); });
test('playback rejects pages, embeds, hotlinks and path traversal', () => { for(const path of ['https://www.toyota.com/rav4/','https://example.com/a.mp4','//example.com/a.mp4','/media/videos/../a.mp4','/media/videos/a.mp4?x=1','javascript:alert(1)','blob:a']) assert.equal(localVideoPath(path),false); });
test('reviewed video is selected for the correct model and variant', () => assert.equal(approvedVideo(valid,'new:prado','reference','tx'),valid));
test('one model never plays another models video', () => assert.equal(approvedVideo(valid,'new:hilux'),undefined));
test('variant changes cannot leak a previous variants video', () => assert.equal(approvedVideo(valid,'new:prado','reference','txl'),undefined));
test('US media are not silently promoted to a Colombian model', () => assert.equal(approvedVideo({...valid,market:'US'},'new:prado'),undefined));
test('fitment confirmation and documentary permission are required', () => { for(const patch of [{matchesColombia:false},{approved:false},{approvalReference:''},{reviewedBy:''},{variant:''}]) assert.equal(approvedVideo({...valid,...patch},'new:prado'),undefined); });
test('mime and extension must agree', () => assert.equal(approvedVideo({...valid,mime:'video/webm'},'new:prado'),undefined));
test('review requires a date and a plausible model year', () => { assert.equal(approvedVideo({...valid,reviewedAt:'no'},'new:prado'),undefined); assert.equal(approvedVideo({...valid,modelYear:NaN},'new:prado'),undefined); });
test('null or missing media safely falls back', () => { for(const input of [null,undefined,{},'not a video']) assert.equal(approvedVideo(input,'new:prado'),undefined); });
const conditions={reduced:false,compact:false,saveData:false,hidden:false,visible:true,paused:false,blocked:false};
test('visible desktop can play permitted media', () => assert.ok(allowBackgroundMotion(conditions)));
for(const key of ['reduced','compact','saveData','hidden','paused','blocked'] as const) test(`background is stopped when ${key}`, () => assert.equal(allowBackgroundMotion({...conditions,[key]:true}),false));
test('offscreen players do not run', () => assert.equal(allowBackgroundMotion({...conditions,visible:false}),false));
test('delivery has no invented video URL or implied approval', () => {
 const r=JSON.parse(readFileSync(new URL('../public/media/vehicle-backgrounds.json',import.meta.url),'utf8'));
 assert.equal(r.schema,1);
 for(const [id, record] of Object.entries(r.models) as [string,{video:unknown}][]) {
   if(record.video !== null) assert.ok(approvedVideo(record.video,id));
 }
});
