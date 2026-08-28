# 🌌 Odak Aurora — Pomodoro Uygulaması

Eğitim programı bitirme projesi kapsamında geliştirilmiş, **React + TypeScript + Tailwind CSS v4 + Framer Motion + Web Audio API** ile oluşturulmuş, en çok kullanılan Pomodoro uygulamalarının (Pomofocus, Focus To-Do, TickTick) sunduğu temel özellikleri barındıran profesyonel bir odaklanma uygulaması.

## Tasarım fikri

Uygulama bir **gece göğünde nefes alan aurora (kuzey ışığı)** temasındadır. Zamanlayıcı çalışırken canvas üzerinde çizilen ışık bulutları yavaşça dalgalanır; renk paleti moda göre değişir (Odak = mercan/amber, Kısa Mola = turkuaz, Uzun Mola = menekşe). Sesler de görsel gibi **canlı üretilir**: hiçbir ses dosyası indirilmez, Web Audio API ile gürültü tamponları ve filtrelerden yağmur, okyanus dalgası, orman esintisi sentezlenir; oturum bitişinde de üç notalı bir akor zili çalınır.

## Öne çıkan profesyonel özellikler

Popüler Pomodoro uygulamaları incelenerek eklenen özellikler:

| Özellik | Açıklama |
|---|---|
| **Göreve bağlı pomodoro sayacı** | Görev ekle, birini "aktif" seç; her tamamlanan odak oturumu o görevin sayacını artırır (Focus To-Do / TickTick modeli) |
| **Bitiş zili** | Oturum bitince Web Audio API ile sentezlenen üç notalı bir akor zili çalar + tarayıcı bildirimi |
| **Otomatik sonraki oturum** | Ayarlardan açılınca mola bitince odak, odak bitince mola kendiliğinden başlar |
| **Haftalık istatistik** | Son 7 günün tamamlanan pomodoro sayısı ve toplam odak süresi mini bar grafikte |
| **Sekme başlığında canlı geri sayım** | Başka sekmedeyken bile kalan süreyi `12:34 🍅 — Odak Aurora` şeklinde görürsün |
| **Klavye kısayolu** | `Boşluk` tuşu ile başlat / duraklat |
| **Kayar ayarlar paneli** | Süreler, otomatik başlatma ve zil sesi seviyesi tek bir profesyonel çekmecede |

### 🔊 Canlı ses ekleme
- Beş hazır, **gerçek zamanlı sentezlenen** ortam sesi: Yağmur, Okyanus, Orman, Kahverengi Gürültü, Beyaz Gürültü
- **Kendi ses dosyanı ekle**: bilgisayarından bir ses dosyası seçip döngüde çalabilirsin

### 🎨 Canlı görsel ekleme
- Dört hazır animasyonlu sahne teması: Kuzey Işığı, Derin Deniz, Gün Batımı, Orman
- **Kendi fotoğrafını ekle**: bir görsel seçip arka plan olarak kullanabilirsin

## Klasör yapısı

```
src/
  components/   → AuroraBackground, TimerRing, ModeTabs, ControlBar,
                  SoundPanel, VisualPanel, SettingsDrawer, SessionStats,
                  TaskList, WeeklyStats
  pages/        → HomePage
  interfaces/   → Pomodoro.ts (TypeScript tip tanımları)
  hooks/        → usePomodoroTimer, useAmbientSound, useTasks,
                  useSessionHistory, useLocalStorage
```


## Kullanılan teknolojiler

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev)
- [lucide-react](https://lucide.dev)
- Web Audio API + Canvas 2D (canlı ses ve görsel üretimi, harici dosya gerekmez)


## 🌐 Canlı Demo  
https://planorapomodoro.netlify.app/
