// ------------------------------
// 1) SATIR EKLEME
// ------------------------------
function satirEkle() {
    const container = document.getElementById("sutunlar-x");

    const yeni = container.cloneNode(true);

    // Sıra numarasını artır
    const mevcutSatirSayisi = document.querySelectorAll("#sutunlar-x").length;
    yeni.querySelector("#no-x").innerText = mevcutSatirSayisi + 1;

    // İçindeki inputları temizle
    yeni.querySelectorAll("input").forEach(inp => {
        inp.value = "";
    });

    // Yeni satırı ekle
    container.parentNode.insertBefore(yeni, document.getElementById("toplama-alani"));

    // Toplam ve KDV hesapla
    toplamHesapla();
    kdvHesapla();

    yeni.classList.add("satir-eklendi");

setTimeout(() => {
    yeni.classList.remove("satir-eklendi");
}, 400);
}
/* ==========================================
   2) SATIR SİLME
========================================== */
function satirSil() {
    const satirlar = document.querySelectorAll("#sutunlar-x");
    if (satirlar.length <= 1) return; // En az bir satır kalmalı

    const sonSatir = satirlar[satirlar.length - 1];
    const urun = sonSatir.querySelector("#urun-adi-x input").value.trim();
    const adet = sonSatir.querySelector("#adet-x input").value.trim();
    const liste = sonSatir.querySelector("#liste-fiyat-x input").value.trim();

    if (urun === "" && adet === "" && liste === "") {
        sonSatir.classList.add("satir-sil-anim");

sonSatir.addEventListener("animationend", () => {
    sonSatir.remove();

    document.querySelectorAll("#sutunlar-x").forEach((satir, i) => {
        satir.querySelector("#no-x").innerText = i + 1;
    });

    toplamHesapla();
    kdvHesapla();
}, { once: true });
        // Sıra numaralarını güncelle
        document.querySelectorAll("#sutunlar-x").forEach((satir, i) => {
            satir.querySelector("#no-x").innerText = i + 1;
        });
        toplamHesapla();
        kdvHesapla();
    } else {
        // Dolu satır uyarısı animasyonu
        sonSatir.classList.add("satir-dolu");
        setTimeout(() => sonSatir.classList.remove("satir-dolu"), 300);
    }
}

/* ==========================================
   3) SATIR HESAPLAMA
========================================== */
function hesaplaSatir(sutun) {
    const adet = parseFloat(sutun.querySelector("#adet-x input").value) || 0;
    const liste = parseFloat(sutun.querySelector("#liste-fiyat-x input").value) || 0;
    const iskonto = parseFloat(sutun.querySelector("#iskonto-x input").value) || 0;

    const netFiyatInput = sutun.querySelector("#net-fiyat-input");
    const satirTutariInput = sutun.querySelector("#satir-tutari-input");

    const netFiyat = liste - (liste * iskonto / 100);
    netFiyatInput.value = netFiyat.toFixed(2);

    const satirTutari = netFiyat * adet;
    satirTutariInput.value = satirTutari.toFixed(2);
}

/* Toplam Hesaplama */
function toplamHesapla() {
    let toplam = 0;
    document.querySelectorAll("#satir-tutari-input").forEach(el => {
        toplam += parseFloat(el.value) || 0;
    });
    document.getElementById("toplam-sonuc").innerText = toplam.toFixed(2);
    return toplam;
}

/* ==========================================
   4) KDV HESAPLAMA
========================================== */
function kdvHesapla() {
    const toplam = toplamHesapla();
    const kdvDropdown = document.getElementById("kdv-orani");
    const secilenKdv = parseFloat(kdvDropdown.value) || 0;

    const kdvTutar = toplam * (secilenKdv / 100);
    const toplamKdvDahil = toplam + kdvTutar;

    document.getElementById("kdv-sonuc").innerText = toplamKdvDahil.toFixed(2);
}

/* KDV dropdown değişince tekrar hesapla */
document.getElementById("kdv-orani").addEventListener("change", kdvHesapla);

/* ==========================================
   5) INPUT DEĞİŞİMİNDE HESAP
========================================== */
document.addEventListener("input", function (event) {
    if (event.target.classList.contains("form-kutucuk")) {
        const satir = event.target.closest("#sutunlar-x");
        hesaplaSatir(satir);
        toplamHesapla();
        kdvHesapla();
    }
});

/* Placeholder temizleme */
document.querySelectorAll("input[placeholder]").forEach(input => {
    input.addEventListener("focus", () => input.placeholder = "");
});

/* ==========================================
   6) BUTON OLAYLARI
========================================== */
document.getElementById("satir-ekle").addEventListener("click", satirEkle);
document.getElementById("satir-sil").addEventListener("click", satirSil);
document.getElementById("full-sil").addEventListener("click", tumBosSatirlariSil);

/* ==========================================
   7) KLAVYE KISAYOLLARI
========================================== */
document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { satirEkle(); event.preventDefault(); }
    if ((event.ctrlKey || event.metaKey) && event.key === "Backspace") { satirSil(); event.preventDefault(); }
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "d") { tumBosSatirlariSil(); event.preventDefault(); }
});

/* ==========================================
   8) ÇIKTI ALMA
========================================== */
// ------------------------------
// Popup ve bulanık arka plan
// ------------------------------
const ciktiBtn = document.getElementById("cikti-al-buton");
const popup = document.getElementById("cikti-popup");
const popupIcerik = popup.querySelector(".popup-icerik");
const popupKapat = document.getElementById("popup-kapat");
const sayfaBlur = document.getElementById("sayfa-blur");

// ------------------------------
// 1) Popup açma (butona tıklayınca)
// ------------------------------
ciktiBtn.addEventListener("click", function() {
    popup.style.display = "flex";
    sayfaBlur.style.display = "block"; // arka plan bulanıklaştır
});

// ------------------------------
// 2) Popup kapatma (kapat butonu)
// ------------------------------
popupKapat.addEventListener("click", function() {
    popup.style.display = "none";
    sayfaBlur.style.display = "none";
});

// ------------------------------
// 3) Popup dışına tıklama ile kapatma
// ------------------------------
popup.addEventListener("click", function(e) {
    if (!popupIcerik.contains(e.target)) {
        popup.style.display = "none";
        sayfaBlur.style.display = "none";
    }
});

// ------------------------------
// 4) Esc tuşuna basınca popup kapatma
// ------------------------------
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        popup.style.display = "none";
        sayfaBlur.style.display = "none";
    }
});

// Hover ile bulanıklaştırma
let hoverTimeout;
ciktiBtn.addEventListener("mouseenter", () => {
    hoverTimeout = setTimeout(() => { sayfaBlur.style.display = "block"; }, 500);
});
ciktiBtn.addEventListener("mouseleave", () => { clearTimeout(hoverTimeout); sayfaBlur.style.display = "none"; });

/* Çıktı verilerini al */
function tabloVerileriniAl() {
    const satirlar = document.querySelectorAll("#sutunlar-x, .dynamic-row");
    return Array.from(satirlar).map(satir => ({
        sira: satir.querySelector("#no-x")?.textContent.trim(),
        urun: satir.querySelector("#urun-adi-x input")?.value || "",
        adet: satir.querySelector("#adet-x input")?.value || "",
        cinsi: satir.querySelector("#cinsi-x select")?.value || "",
        liste: satir.querySelector("#liste-fiyat-x input")?.value || "",
        iskonto: satir.querySelector("#iskonto-x input")?.value || "",
        net: satir.querySelector("#net-fiyat-input")?.value || "",
        toplam: satir.querySelector("#satir-tutari-input")?.value || ""
    }));
}

/* Görsel çıktısı */
async function ciktiGorsel() {
    const canvas = await html2canvas(document.body);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "fiyat_teklif_formu.png";
    link.click();
}

/* Excel çıktısı */
function ciktiExcel() {
    const data = tabloVerileriniAl();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teklif");
    XLSX.writeFile(wb, "fiyat_teklifi.xlsx");
}

/* PDF çıktısı */
function ciktiPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = tabloVerileriniAl();

    doc.setFontSize(16);
    doc.text("Fiyat Teklif Formu", 14, 18);
    doc.setFontSize(12);
    doc.text("Tarih: " + new Date().toLocaleDateString("tr-TR"), 14, 26);

    doc.autoTable({
        startY: 32,
        head: [["#", "Ürün", "Adet", "Cinsi", "Liste", "İskonto", "Net", "Toplam"]],
        body: data.map(d => [d.sira, d.urun, d.adet, d.cinsi, d.liste, d.iskonto, d.net, d.toplam])
    });

    doc.save("fiyat_teklifi.pdf");
}

/* Popup içindeki çıktı seçenekleri */
document.querySelectorAll(".cikti-secim").forEach(btn => {
    btn.addEventListener("click", () => {
        const tip = btn.dataset.type;
        if (tip === "image") ciktiGorsel();
        if (tip === "excel") ciktiExcel();
        if (tip === "pdf") ciktiPDF();
        popup.style.display = "none";
        sayfaBlur.style.display = "none";
    });
});

/* ==========================================
   9) TÜM BOŞ SATIRLARI SİLME
========================================== */
function tumBosSatirlariSil() {
    const satirlar = document.querySelectorAll("#sutunlar-x");
    let bosSatirVar = false;

    // İlk satırı atla
    for (let i = 1; i < satirlar.length; i++) {
        const satir = satirlar[i];
        const urun = satir.querySelector("#urun-adi-x input").value.trim();
        const adet = satir.querySelector("#adet-x input").value.trim();
        const liste = satir.querySelector("#liste-fiyat-x input").value.trim();

        if (urun === "" && adet === "" && liste === "") {
            bosSatirVar = true;
            satir.classList.add("silinen-satir");

            satir.addEventListener("animationend", () => {
                satir.remove();
                document.querySelectorAll("#sutunlar-x").forEach((s, index) => s.querySelector("#no-x").innerText = index + 1);
                toplamHesapla();
                kdvHesapla();
            });
        }
    }

    if (!bosSatirVar) {
        const btn = document.getElementById("full-sil");
        btn.classList.add("button-shake");
        setTimeout(() => btn.classList.remove("button-shake"), 300);
    }
}
document.addEventListener("keydown", function(event) {

    // Ctrl/Command + Enter → Satır Ekle
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        satirEkle();
    }

    // Ctrl/Command + Backspace → Satır Sil
    if ((event.ctrlKey || event.metaKey) && event.key === "Backspace") {
        event.preventDefault();
        satirSil();
    }

    // Ctrl/Command + Shift + D → Tüm Boş Satırları Sil
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === "D" || event.key === "d")) {
        event.preventDefault();
        tumBosSatirlariSil();
    }

    // Ctrl/Command + E → Çıktı Al
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "e") {
        event.preventDefault();
        ciktiBtn.click(); // Çıktı popup'ını aç
    }
});


// Buraya Kadar

document.addEventListener("click", function (e) {
    const satirlar = Array.from(document.querySelectorAll("#sutunlar-x"));

    // 1) Eğer tıklanan eleman X ise -> satırı sil
    if (e.target.classList.contains("satir-sil-x")) {
        const satir = e.target.closest("#sutunlar-x");
        if (!satir) return;

        // Sağa kayarak yok ol animasyonu uygula
        satir.classList.add("saga-kayarak-yok-ol");

        // Animasyon bittikten sonra DOM'dan kaldır ve numaraları güncelle
        satir.addEventListener("animationend", () => {
            satir.remove();

            // Kalan satırların numaralarını güncelle ve X stilini temizle
            const kalanSatirlar = Array.from(document.querySelectorAll("#sutunlar-x"));
            kalanSatirlar.forEach((s, i) => {
                const no = s.querySelector("#no-x");
                no.textContent = i + 1;
                no.classList.remove("satir-sil-x");
            });

            // Hesaplamaları güncelle
            toplamHesapla();
            kdvHesapla();
        }, { once: true });

        return; // silme branşından çık
    }

    // 2) Eğer satırın herhangi bir yerine tıklandıysa -> o satırı X moduna al
    const satir = e.target.closest("#sutunlar-x");
    if (satir) {
        const satirIndex = satirlar.indexOf(satir);

        // İlk satır asla seçilip silinemez
        if (satirIndex === 0) return;

        // Önce tüm satırlardaki X modunu temizle ve numaralarını geri koy
        satirlar.forEach((s, i) => {
            const noKutusu = s.querySelector("#no-x");
            noKutusu.classList.remove("satir-sil-x");
            noKutusu.textContent = i + 1;
        });

        // Tıklanan satırı X yap
        const noKutusu = satir.querySelector("#no-x");
        noKutusu.classList.add("satir-sil-x");
        noKutusu.textContent = "Sil";

        return;
    }

    // 3) Eğer sayfanın başka bir yerine tıklanmışsa -> tüm X’leri eski hâline getir
    satirlar.forEach((s, i) => {
        const noKutusu = s.querySelector("#no-x");
        if (noKutusu.classList.contains("satir-sil-x")) {
            noKutusu.classList.remove("satir-sil-x");
            noKutusu.textContent = i + 1;
        }
    });
});

// Kısayollar div’i tıklandığında popup aç
const kisayolBtn = document.getElementById("kisayollar");
const kisayolPopup = document.getElementById("kisayol-popup");

kisayolBtn.addEventListener("click", () => {
    kisayolPopup.style.display = "flex";
    sayfaBlur.style.display = "block";
});

// Popup dışına tıklayınca kapatma (her yerde çalışır)
document.addEventListener("click", (e) => {
    const icerik = document.getElementById("kisayol-popup-icerik");
    if (kisayolPopup.style.display === "flex" && !icerik.contains(e.target) && e.target.id !== "kisayollar") {
        kisayolPopup.style.display = "none";
        sayfaBlur.style.display = "none";
    }
});

// ESC tuşu ile kapatma
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        kisayolPopup.style.display = "none";
        sayfaBlur.style.display = "none";
    }
});

