// A practical General American core, plus explicitly labelled British comparisons.
const raw=`
iː|Vowels|元音|see|green|Smile gently; keep your tongue high and forward.|嘴角轻轻展开，舌位高而靠前。|1
ɪ|Vowels|元音|sit|six|Relax your lips; keep the sound short.|嘴唇放松，声音短促。|1
e|Vowels|元音|pen|red|Open your mouth a little; relax the tongue.|嘴巴稍微张开，舌头放松。|2
æ|Vowels|元音|cat|apple|Open your jaw wider; keep the tongue forward.|下巴张开较大，舌头靠前。|3
ɑː|Vowels|元音|father|car|Open your mouth; move the tongue low and back.|张开嘴，舌位低而靠后。|3
ɔː|Vowels|元音|four|door|Round your lips with the tongue toward the back.|嘴唇拢圆，舌头靠后。|2
ʊ|Vowels|元音|book|good|Round your lips loosely; keep it short.|嘴唇轻轻拢圆，发音短促。|1
uː|Vowels|元音|blue|two|Round your lips; hold the sound a little longer.|嘴唇拢圆，声音稍长。|1
ʌ|Vowels|元音|sun|cup|Relax your mouth with a low central tongue.|嘴部放松，舌位居中偏低。|2
ə|Vowels|元音|about|sofa|Make a very relaxed, unstressed sound.|放松发出轻而不重读的声音。|1
ɝ|Vowels|元音|bird|girl|Make a stressed r-coloured vowel; do not touch the roof.|发重读的卷舌元音，舌头不碰上颚。|1
ɚ|Vowels|元音|teacher|mother|Use a gentle, unstressed r-coloured ending.|词尾轻读卷舌音，嘴部放松。|1
eɪ|Diphthongs|双元音|name|play|Glide from an e-like sound toward /ɪ/.|从类似 e 的音滑向 /ɪ/。|2
aɪ|Diphthongs|双元音|hi|nine|Start with an open mouth, then glide toward /ɪ/.|张口起音，再滑向 /ɪ/。|3
ɔɪ|Diphthongs|双元音|toy|boy|Start rounded, then glide toward /ɪ/.|先拢圆嘴唇，再滑向 /ɪ/。|2
aʊ|Diphthongs|双元音|now|how|Start open and finish with rounded lips.|张口起音，收尾时嘴唇拢圆。|3
oʊ|Diphthongs|双元音|no|home|Move from a rounded o sound toward /ʊ/.|从圆唇的 o 音滑向 /ʊ/。|2
p|Consonants|辅音|pen|play|Close both lips, then release air without voice.|双唇闭合再放开送气，声带不振动。|0
b|Consonants|辅音|book|bag|Close both lips and release with voice.|双唇闭合再放开，声带振动。|0
t|Consonants|辅音|two|toy|Touch behind your upper teeth, then release air.|舌尖接触上齿龈后放开送气。|1
d|Consonants|辅音|dog|day|Touch behind your upper teeth and release with voice.|舌尖接触上齿龈后放开，声带振动。|1
k|Consonants|辅音|cat|kite|Lift the back of your tongue, then release air.|舌后部抬起再放开送气。|2
ɡ|Consonants|辅音|go|good|Lift the back of your tongue and release with voice.|舌后部抬起再放开，声带振动。|2
f|Consonants|辅音|friend|four|Touch your lower lip with your upper teeth; blow gently.|上齿轻触下唇，轻轻送气。|1
v|Consonants|辅音|very|five|Use the /f/ position and add voice.|保持 /f/ 的口形，声带振动。|1
θ|Consonants|辅音|three|thank|Place your tongue gently between your teeth; blow.|舌尖轻放上下齿之间，送气。|1
ð|Consonants|辅音|this|they|Use the /θ/ position and add voice.|保持 /θ/ 的口形，声带振动。|1
s|Consonants|辅音|see|sun|Keep the tongue near the tooth ridge; let air hiss.|舌头靠近齿龈，让气流发出嘶声。|1
z|Consonants|辅音|zoo|zip|Use the /s/ position and add voice.|保持 /s/ 的口形，声带振动。|1
ʃ|Consonants|辅音|she|share|Round your lips slightly; make a quiet sh sound.|嘴唇稍拢圆，发出嘘声。|1
ʒ|Consonants|辅音|vision|measure|Use the /ʃ/ position and add voice.|保持 /ʃ/ 的口形，声带振动。|1
h|Consonants|辅音|hi|happy|Let a soft breath flow through your open mouth.|张嘴轻轻呼气。|2
tʃ|Consonants|辅音|chair|China|Start with /t/ and release into /ʃ/.|先发 /t/，再释放为 /ʃ/。|1
dʒ|Consonants|辅音|jump|age|Start with /d/ and release into a voiced /ʒ/.|先发 /d/，再释放为有声的 /ʒ/。|1
m|Consonants|辅音|me|mum|Close your lips and let your voice pass through the nose.|闭合双唇，让声音从鼻腔通过。|0
n|Consonants|辅音|nine|name|Touch the tooth ridge and let voice pass through the nose.|舌尖接触齿龈，声音从鼻腔通过。|1
ŋ|Consonants|辅音|sing|song|Raise the back of your tongue; let voice pass through the nose.|舌后部抬起，声音从鼻腔通过。|2
l|Consonants|辅音|look|like|Touch the upper tooth ridge; air passes at the sides.|舌尖轻触上齿龈，气流从两侧通过。|1
r|Consonants|辅音|red|read|Curl or bunch the tongue without touching the roof.|舌头卷起或收拢，不接触上颚。|1
j|Consonants|辅音|yes|you|Start with a high front tongue and glide into the vowel.|舌位高而靠前，滑入后面的元音。|1
w|Consonants|辅音|we|with|Round your lips, then open into the vowel.|先拢圆嘴唇，再展开滑入元音。|1
ɒ|UK comparison|英音对照|hot|dog|A short open back vowel with rounded lips.|短促的后元音，嘴唇拢圆。|3
ɜː|UK comparison|英音对照|bird|girl|Keep a central tongue; do not add an r sound.|舌头居中，不加卷舌音。|2
əʊ|UK comparison|英音对照|no|home|Start relaxed in the centre and glide toward /ʊ/.|从放松的中央元音滑向 /ʊ/。|2
ɪə|UK comparison|英音对照|here|dear|Glide from /ɪ/ to a relaxed central sound.|从 /ɪ/ 滑向放松的中央元音。|1
eə|UK comparison|英音对照|chair|share|Glide from /e/ toward a relaxed centre.|从 /e/ 滑向放松的中央元音。|2
ʊə|UK comparison|英音对照|pure|tour|A traditional UK glide; modern speakers may use other vowels.|传统英音的滑动音，现代说话者可能使用其他元音。|1
`;
export const sounds=raw.trim().split('\n').map((line,i)=>{const [ipa,group,groupZh,example,other,tip,tipZh,open]=line.split('|');return {id:`s${i}`,ipa,group,groupZh,example,other,tip,tipZh,open:Number(open),accent:group==='UK comparison'?'uk':'us'};});
export const soundQuestions=[['she','see'],['three','tree'],['ship','sheep'],['cat','cut'],['pen','pan'],['very','berry'],['rice','lice'],['thin','fin']];
