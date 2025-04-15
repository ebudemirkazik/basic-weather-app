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
          throw new Error("Şehir bulunamadı.");
        }
        return response.json();
      })
      .then((data) => {
        // DOM'a veri yazalım
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

// Favori listeyi güncelle
function favoriListeyiGoster() {
  const liste = document.getElementById("favoriListe");
  liste.innerHTML = "";

  favoriler.forEach(sehir => {
    const li = document.createElement("li");
    li.textContent = sehir;
    li.addEventListener("click", () => {
      document.getElementById("sehir").value = sehir;
      document.getElementById("ara").click(); // otomatik arama
    });
    liste.appendChild(li);
  });
}

// Buton ile favoriye ekle
document.getElementById("favorilereEkle").addEventListener("click", () => {
  const sehir = document.getElementById("sehir-adi").textContent;
  if (!favoriler.includes(sehir)) {
    favoriler.push(sehir);
    localStorage.setItem("favoriler", JSON.stringify(favoriler));
    favoriListeyiGoster();
  }
});

// Sayfa yüklenince listeyi göster
window.addEventListener("DOMContentLoaded", favoriListeyiGoster);