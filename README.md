# AZHERYN V2 — Chapter 1

Open-source source code for the Build With AI — Devpost 2026 submission.

## Quick start (Windows)

1. Download the repository as ZIP from GitHub and extract it completely.
2. Install **Node.js LTS** from https://nodejs.org/ if it is not installed.
3. Open the `azheryn-v2` folder and double-click **INICIAR_JUEGO_WINDOWS.bat**.
4. Wait for dependency installation and the production build. The game opens at http://localhost:5173/.
5. Keep the command window open while playing; close it to stop the server.

Internet access is required for the first dependency installation. Do not open `index.html` directly: this game runs through Vite.

## Command-line alternative

```sh
cd azheryn-v2
npm ci
npm run build
npm run dev -- --host 127.0.0.1
```

Then open http://localhost:5173/. Requires Node.js and npm. `npm ci` uses the committed lockfile.

## Scope and documentation

Lead Mui and seven guards through forest logging, paired transport and construction of a 91-log storehouse. The interface supports Spanish and English.

See [game documentation](azheryn-v2/README.md), [Skill Pack](.agents/skills), [planning](devpost), and [license](LICENSE). Original game artwork and worldbuilding have separate rights described in [ASSET_RIGHTS](azheryn-v2/ASSET_RIGHTS.md).

**Verification:** The launcher and repository paths were reviewed; a fresh installation and build on a clean Windows machine have not yet been independently executed. Please report any installation or build error.
