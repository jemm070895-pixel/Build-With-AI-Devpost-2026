import { useState } from "react";
import { WorldView } from "./ui/WorldView";
import { IntroStory } from "./ui/IntroStory";
function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [replaying, setReplaying] = useState(false);
  return <>
    {/* Keep the world mounted when replaying the story, preserving all game state. */}
    <div style={{display: showIntro ? "none" : "contents"}}><WorldView/></div>
    {showIntro ? <div style={{position:"fixed",inset:0,zIndex:10000}}><IntroStory onFinish={() => setShowIntro(false)} replay={replaying} /></div>
      : <button onClick={() => { setReplaying(true); setShowIntro(true); }} title="Volver a ver la historia / Replay story" style={{position:"fixed",bottom:8,right:8,zIndex:9999,padding:"6px 10px",borderRadius:8,background:"#172c3e",color:"#fff",border:"1px solid #b9965e",fontSize:12}}>Historia / Story</button>}
  </>;
}
export default App;
