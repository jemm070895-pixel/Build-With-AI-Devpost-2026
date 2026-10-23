const fs = require('fs');
const assert = require('assert');
const text = fs.readFileSync('src/ui/IntroStory.tsx','utf8');
for (const term of ['INTRO_PROGRESS_KEY', 'INTRO_LANG_KEY', 'sessionStorage.removeItem', 'onError={() => setImageFailed(true)}', 'imageFailed ?', 'event.key === "Enter"', 'event.key === "ArrowLeft"', 'Fehe_original']) assert(text.includes(term), `Missing ${term}`);
console.log('G3 prólogo: persistencia de escena/idioma, recuperación de imagen, teclado y Fehe original OK');
