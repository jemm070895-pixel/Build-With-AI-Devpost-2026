import { useEffect, useState } from "react";
import "./IntroStory.css";

type Slide = { image: string; speaker: string; es: string; en: string };
const INTRO_PROGRESS_KEY = "azheryn-v2-prologue-progress";
const INTRO_LANG_KEY = "azheryn-language";
const slides: Slide[] = [
  { image: "reino", speaker: "Narrador / Narrator", es: "Antes de llegar al claro, el Forastero acudió ante el Rey. Su propuesta era levantar una Academia donde todavía no había nada.", en: "Before reaching the clearing, the Outsider came before the King. He proposed an Academy where nothing yet stood." },
  { image: "rey", speaker: "Rey / King", es: "—Acepto que comiences. Pondré a siete de mis guardias a tu disposición. Lo demás llegará a su tiempo.", en: "—You may begin. Seven of my guards will accompany you. The rest will come in time." },
  { image: "guardias", speaker: "Narrador / Narrator", es: "Los siete habían sido cazadores antes de servir al Rey. Conocían el bosque, los senderos y los peligros de la naturaleza.", en: "The seven had been hunters before serving the King. They knew the woods, the paths and the dangers of the wild." },
  { image: "resistencia", speaker: "Guardia / Guard", es: "—Sabemos cazar y proteger. No somos leñadores ni constructores. ¿Por qué debemos levantar edificios?", en: "—We know how to hunt and protect. We are not loggers or builders. Why must we raise buildings?" },
  { image: "entrega_fehe_canonica", speaker: "Mui / Outsider", es: "—No os pido que olvidéis lo que sois. Os pido que aprendamos juntos algo nuevo. Ahora os entrego una Fehe a cada uno. Aprenderemos juntos a usarla.", en: "—I am not asking you to forget who you are. I am giving each of you a Fehe now. Together we will learn to use it." },
  { image: "entrega_fehe_canonica", speaker: "Narrador / Narrator", es: "Mui entregó una Fehe a cada uno de los siete guardias. Todas comparten el mismo diseño de trece puntas y mineral violeta oscuro. Las de los guardias miden 30 cm (hoja 17 cm y mango 13 cm); la de Mui mide 40 cm (hoja 25 cm y mango 15 cm).", en: "Mui gave each of the seven guards a Fehe. All share the same thirteen-point dark-violet mineral design. The guards’ Fehe measure 30 cm (17 cm blade, 13 cm handle); Mui’s measures 40 cm (25 cm blade, 15 cm handle)." },
  { image: "Fehe_original", speaker: "Narrador / Narrator", es: "La Fehe tiene una hoja de mineral violeta oscuro, trece puntas y un mango cubierto de fibra vegetal. Su hoja mide 17 cm y su mango 13 cm: 30 cm en total. Esta es su forma original.", en: "The Fehe has a dark violet mineral blade, thirteen points and a plant-fiber-wrapped handle. Its blade is 17 cm and its handle 13 cm: 30 cm overall. This is its original form." },
  { image: "partida", speaker: "Narrador / Narrator", es: "Mui, el mismo Forastero que habló con el Rey, emprendió el camino acompañado por los siete hombres.", en: "Mui, the very Outsider who spoke to the King, set out with the seven men." },
  { image: "claro", speaker: "Mui", es: "—Aquí comenzaremos. Primero aseguraremos la madera y levantaremos nuestro almacén. Después vendrá todo lo demás.", en: "—Here we begin. First we gather timber and build our storehouse. Everything else will follow." },
];
export function IntroStory({ onFinish, replay = false }: { onFinish: () => void; replay?: boolean }) {
  const [index, setIndex] = useState(0);
  const [splash, setSplash] = useState(!replay);
  const [languageChosen, setLanguageChosen] = useState(replay);
  const [language, setLanguage] = useState<"es" | "en">(() => {
    try { return localStorage.getItem(INTRO_LANG_KEY) === "en" ? "en" : "es"; }
    catch { return "es"; }
  });
  const [imageFailed, setImageFailed] = useState(false);
  const [cinematic, setCinematic] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [pausedByPage, setPausedByPage] = useState(() => typeof document !== "undefined" && document.visibilityState === "hidden");
  const [playbackSeconds, setPlaybackSeconds] = useState<6 | 9 | 12>(9);
  const finish = () => { try { sessionStorage.removeItem(INTRO_PROGRESS_KEY); localStorage.setItem(INTRO_LANG_KEY, language); } catch { /* private mode */ } onFinish(); };
  const chooseLanguage = (selected: "es" | "en") => { setLanguage(selected); setLanguageChosen(true); try { localStorage.setItem(INTRO_LANG_KEY, selected); } catch { /* private mode */ } };
  useEffect(() => { try { sessionStorage.setItem(INTRO_PROGRESS_KEY, String(index)); } catch { /* private mode */ } setImageFailed(false); }, [index]);
  useEffect(() => { try { localStorage.setItem(INTRO_LANG_KEY, language); } catch { /* private mode */ } }, [language]);
  useEffect(() => {
    const onVisibility = () => setPausedByPage(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
  useEffect(() => {
    if (!languageChosen || splash || !autoPlay || pausedByPage) return;
    const timer = window.setTimeout(() => {
      if (index < slides.length - 1) setIndex(i => Math.min(slides.length - 1, i + 1));
      else finish(); // Enter the clearing after the last scene.
    }, playbackSeconds * 1000);
    return () => window.clearTimeout(timer);
  }, [autoPlay, pausedByPage, index, playbackSeconds, languageChosen, splash]);
  useEffect(() => { if (!splash || pausedByPage) return; const timer = window.setTimeout(() => setSplash(false), 3200); return () => window.clearTimeout(timer); }, [splash, pausedByPage]);
  const slide = slides[index];
  const last = index === slides.length - 1;
  // Preload the following illustration to avoid a blank frame on slower phones.
  useEffect(() => {
    const next = slides[index + 1];
    if (!next) return;
    const image = new Image();
    image.src = next.image === "Fehe_original" ? "/intro/Fehe_detalle_original.webp" : `/intro/${next.image}.webp`;
  }, [index]);
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
      if (event.key === "ArrowRight") { event.preventDefault(); setIndex(i => Math.min(slides.length - 1, i + 1)); }
      if (event.key === "ArrowLeft") { event.preventDefault(); setIndex(i => Math.max(0, i - 1)); }
      if ((event.key === " " || event.key === "Enter") && !(event.target instanceof HTMLElement && event.target.closest("button, input, textarea, select"))) {
        event.preventDefault(); setIndex(i => Math.min(slides.length - 1, i + 1));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  if (!languageChosen) return <main className="azh-language-gate"><h1>AZHERYN V2</h1><p>Elige el idioma antes de comenzar / Choose your language before starting</p><div><button onClick={() => chooseLanguage("es")}>Español</button><button onClick={() => chooseLanguage("en")}>English</button></div></main>;
  if (splash) return <main className="azh-splash" aria-label="AZHERYN V2"><div className="azh-splash-emblem" aria-hidden="true">✦</div><h1>AZHERYN <span>V2</span></h1><p>{language === "es" ? "CAPÍTULO 1 · FUNDACIÓN" : "CHAPTER 1 · FOUNDATION"}</p><div className="azh-splash-loader" aria-label={language === "es" ? "Cargando presentación" : "Loading presentation"}><span/></div><button onClick={() => setSplash(false)}>{language === "es" ? "Entrar →" : "Enter →"}</button></main>;
  return <main className="azh-intro" aria-label="Prólogo de AZHERYN">
    <div className="azh-intro-top"><strong>AZHERYN V2 · {language === "es" ? "PRÓLOGO" : "PROLOGUE"}</strong><div className="azh-intro-settings"><button aria-pressed={autoPlay} onClick={() => setAutoPlay(v => !v)}>{language === "es" ? (autoPlay ? "Pausar vídeo" : "Reproducir vídeo") : (autoPlay ? "Pause video" : "Play video")}</button><button aria-pressed={cinematic} onClick={() => setCinematic(v => !v)}>{language === "es" ? (cinematic ? "Cine: sí" : "Cine: no") : (cinematic ? "Cinema: on" : "Cinema: off")}</button><button aria-label={language === "es" ? "Cambiar duración de escena" : "Change scene duration"} onClick={() => setPlaybackSeconds(v => v === 6 ? 9 : v === 9 ? 12 : 6)}>{playbackSeconds}s</button><button onClick={() => { const next = language === "es" ? "en" : "es"; setLanguage(next); try { localStorage.setItem(INTRO_LANG_KEY, next); } catch {} }}>{language === "es" ? "EN" : "ES"}</button></div></div>
    <div className={`azh-intro-art ${cinematic && autoPlay && !pausedByPage ? "azh-intro-cinematic" : ""}`} style={{"--azh-scene-duration": `${playbackSeconds}s`} as React.CSSProperties}>{imageFailed ? <div role="status" className="azh-intro-image-fallback">{language === "es" ? "Ilustración no disponible. Puedes continuar la historia." : "Illustration unavailable. You can continue the story."}</div> : <img key={slide.image} src={slide.image === "Fehe_original" ? "/intro/Fehe_detalle_original.webp" : `/intro/${slide.image}.webp`} onError={() => setImageFailed(true)} alt={slide.image === "entrega_fehe_canonica" || slide.image === "entrega_fehe_original" || slide.image === "Fehe_original" ? "Daga Fehe original del proyecto, hoja violeta de trece puntas y mango de fibra vegetal" : "Ilustración del prólogo"}/>}</div>
    <section className="azh-intro-dialog" aria-live="polite"><small>{slide.speaker.split(" / ")[language === "es" ? 0 : 1] || slide.speaker}</small><p>{slide[language]}</p></section>
    <nav className="azh-intro-actions"><button onClick={finish}>{language === "es" ? "Omitir historia" : "Skip story"}</button><span className="azh-intro-progress" aria-label={`${language === "es" ? "Escena" : "Scene"} ${index + 1} ${language === "es" ? "de" : "of"} ${slides.length}`}>{index + 1} / {slides.length}</span><button disabled={index === 0} onClick={() => setIndex(index - 1)}>{language === "es" ? "Anterior" : "Back"}</button><button onClick={() => last ? finish() : setIndex(index + 1)}>{last ? (language === "es" ? "Comenzar capítulo 1" : "Begin chapter 1") : (language === "es" ? "Siguiente →" : "Next →")}</button></nav>
  </main>;
}
