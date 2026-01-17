# 🚀 IDINVERSE - Interactive 3D Web Experience

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)]([https://idin-verse.vercel.app/](https://idinverse-js.vercel.app))
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Threejs](https://img.shields.io/badge/Three.js-black?style=flat&logo=three.js&logoColor=white)](https://threejs.org/)

**IdinVerse** adalah sebuah platform portofolio interaktif berbasis web 3D yang menggabungkan seni visual, koding, dan eksplorasi virtual. Dibuat oleh **Idin Iskandar**, proyek ini dirancang untuk menunjukkan batas kemampuan teknologi web modern menggunakan React, Three.js, dan React Three Fiber.

---

## 🌌 Featured Worlds

### 1. 🔴 Mars Colony
Jelajahi pemukiman manusia pertama di Planet Merah. Dilengkapi dengan infrastruktur masa depan, robot penjelajah (Rover), dan pengawasan drone secara real-time.
- **Vibes:** Cinematic Sci-Fi.
- **Features:** High-fidelity Mars terrain, animated astronaut, and surveillance drone system.
- **Soundtrack:** *Astronaut in the Ocean* (Remix).

### 2. 👺 Mystical Camp
Masuki suasana mencekam di pedalaman hutan Jawa yang penuh dengan artefak mistis. Hati-hati, ada penunggu yang mengawasi setiap langkahmu.
- **Vibes:** Javanese Horror & Mystery.
- **Soundtrack:** Gamelan Mistis.

### 3. 👤 About Creator (Hologram Profile)
Halaman biografi interaktif yang menjelaskan visi di balik pembuatan IdinVerse dan perjalanan karir Idin Iskandar dalam dunia teknologi.

---

## 🛠️ Tech Stack

- **Framework:** React.js (Vite)
- **3D Engine:** Three.js
- **React 3D Wrapper:** React Three Fiber (R3F) & @react-three/drei
- **Icons:** Lucide React
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

---

## 🔐 Special Features

- **Audio Interaction System:** Mengatasi blokir browser modern dengan sistem "Lock & Unlock" di halaman awal. Sekali klik, audio AI (DupDub) akan menyambutmu secara otomatis.
- **Low-Poly Optimization:** Semua aset 3D (GLB) dioptimalkan agar tetap ringan dibuka lewat Browser HP tanpa mengorbankan kualitas visual.
- **Responsive 3D:** Render 3D yang adaptif untuk layar desktop maupun smartphone.

---

## 📂 Project Structure

```text
IdinVerse/
├── public/                 # Aset 3D & Audio
│   ├── audio/              # astro.mp3, welcome.mp3
│   ├── city.glb            # Mars Base Asset
│   ├── rover.glb           # Mars Car Asset
│   └── ...
├── src/
│   ├── pages/              # Halaman (Index, City, About, Explore)
│   ├── components/         # Reusable Components
│   └── App.tsx             # Main Routing
└── package.json            # Dependencies & Scripts


🧑‍💻 Developed By
Idin Iskandar "Turning lines of code into virtual realities."

Github: @idincodingweb

Vision: Menciptakan internet masa depan yang lebih interaktif dan imersif.

© 2026 IdinVerse Project. Made with ☕ and Coding by Idin Iskandar.

