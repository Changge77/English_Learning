export function audioId(text,accent='us') {let h=2166136261;for(const c of text){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return `${accent}-${(h>>>0).toString(16)}`;}
export function spokenWord(text){return text.replace('sb / sth','somebody or something').replace(/^Ms$/,'Miz');}
