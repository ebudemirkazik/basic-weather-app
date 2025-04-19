let sonVeriGecerliMi = false; // en başta başarısız say

document.getElementById("sehir").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    document.getElementById("ara").click(); // Butona tıklamış gibi yap
  }
});

document.getElementById("ara").addEventListener("click", () => {
  const sehir = document.getElementById("sehir").value.trim();

  if (sehir === "") {
    alert("Lütfen bir şehir adı giriniz.");
    return;
  }

  function havaDurumunuGetir(sehir) {
    const apiKey = "7b29cbf831043e990eb5f42880ee4414";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${sehir}&appid=${apiKey}&units=metric&lang=tr`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          sonVeriGecerliMi = false;
          throw new Error("Şehir bulunamadı.");
        }
        return response.json();
      })
      .then((data) => {
        // DOM'a veri yazalım
        sonVeriGecerliMi = true;
        document.getElementById("sehir-adi").textContent = data.name;
        document.getElementById(
          "sicaklik"
        ).textContent = `Sıcaklık: ${data.main.temp.toFixed(1)}°C`;
        document.getElementById(
          "aciklama"
        ).textContent = `Durum: ${data.weather[0].description}`;
        document.getElementById(
          "nem"
        ).textContent = `Nem: ${data.main.humidity}%`;
        document.getElementById(
          "ruzgar"
        ).textContent = `Rüzgar: ${data.wind.speed} km/s`;

        // Hava durumu simgesini ayarlayalım
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById("hava-ikonu").src = iconUrl;
        document.getElementById("hava-ikonu").alt = data.weather[0].description;

        // Hata mesajını temizle, sonucu göster
        document.getElementById("hata-mesaji").textContent = "";
        document.getElementById("hava-sonuc").classList.remove("gizle");

        // hava durumuna göre arka plan ayarlama

        const durum = data.weather[0].main.toLowerCase();

        const body = document.body;
        body.className = ""; // Önce eski sınıfları temizle

        if (durum.includes("cloud")) {
          body.classList.add("bulutlu");
        } else if (durum.includes("rain")) {
          body.classList.add("yagmurlu");
        } else if (durum.includes("clear")) {
          body.classList.add("acik");
        } else if (durum.includes("snow")) {
          body.classList.add("karlı");
        } else {
          body.classList.add("normal");
        }
      })
      .catch((error) => {
        console.error("Hata:", error);
        document.getElementById("hata-mesaji").textContent =
          "Şehir bulunamadı veya bağlantı hatası.";
        document.getElementById("hava-sonuc").classList.add("gizle");
      });
  }

  havaDurumunuGetir(sehir);
});

document.getElementById("reset").addEventListener("click", () => {
  document.getElementById("hava-sonuc").textContent = "";
  document.getElementById("sehir").value = "";
});

// Favori şehirleri tut
let favoriler = JSON.parse(localStorage.getItem("favoriler")) || [];

// Buton ile favoriye ekle
document.getElementById("favorilereEkle").addEventListener("click", () => {
  const sehir = document.getElementById("sehir-adi").textContent;

  if (!sonVeriGecerliMi) {
    alert("Geçerli bir şehir araması yapmadan favorilere ekleyemezsiniz.");
    return;
  }

  if (!favoriler.includes(sehir)) {
    favoriler.push(sehir);
    localStorage.setItem("favoriler", JSON.stringify(favoriler));
    favoriListeyiGoster();
  }
});

// Favori listeyi güncelle
function favoriListeyiGoster() {
  const liste = document.getElementById("favoriListe");
  liste.innerHTML = "";

  favoriler.forEach((sehir) => {
    const li = document.createElement("li");
    li.textContent = sehir;

    li.addEventListener("click", () => {
      document.getElementById("sehir").value = sehir;
      document.getElementById("ara").click(); // otomatik arama
    });

    // 🗑️ Sil butonu oluştur
    const silButonu = document.createElement("button");
    silButonu.textContent = "🗑️";
    silButonu.style.marginLeft = "10px";
    silButonu.addEventListener("click", (event) => {
      event.stopPropagation(); // li tıklamasını engelle
      favoriler = favoriler.filter((item) => item !== sehir);
      localStorage.setItem("favoriler", JSON.stringify(favoriler));
      favoriListeyiGoster();
    });

    li.appendChild(silButonu);
    liste.appendChild(li);
  });
}

const modal = document.getElementById("favoriModal");
const modalAc = document.getElementById("favoriAc");
const modalKapat = document.getElementById("modalKapat");

modalAc.addEventListener("click", () => {
  modal.classList.add("aktif");
});

modalKapat.addEventListener("click", () => {
  modal.classList.remove("aktif");
});

// Escape tuşu ile modal kapansın
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.classList.remove("aktif");
  }
});

// Sayfa yüklenince listeyi göster
window.addEventListener("DOMContentLoaded", favoriListeyiGoster);
