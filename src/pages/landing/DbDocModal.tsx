import { Modal, ModalBody } from "../../components/modal/Modal";
import { useEffect, useState } from "react";

export default function DbDocModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Platforma texnik hujjati"
      width={900}
      closeOnOverlay={true}
    >
      <ModalBody>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            lineHeight: "1.6",
            color: "#111827",
            overflowY: "auto",
            maxHeight: "80vh",
          }}
        >
          {/* ======== Bajarilgan ======== */}
          <h2 style={sectionTitle}>Bajarilgan:</h2>
          <p>
            <b>Platforma tili:</b> O’zbek tili va Rus tili (Google Translate orqali)
          </p>
          <p>
            <b>Maqsad:</b> Buyurtmachilar va ustalarni (ijrochilarni) birlashtiruvchi
            onlayn platforma yaratish — 4 tomonlama ekotizim:
          </p>
          <ul>
            <li>Jismoniy buyurtmachi</li>
            <li>Yuridik buyurtmachi (korxona)</li>
            <li>Kasbiy ta'lim bitiruvchisi (diplomli)</li>
            <li>Diplomsiz, lekin tajribali usta</li>
          </ul>

          <h3 style={subTitle}>Qo‘shimcha ro‘yxatdan o‘tish talablari</h3>
          <ul>
            <li>
              Har bir foydalanuvchi (buyurtmachi yoki bajaruvchi) o‘zining yashash
              mahallasini ham kiritishi shart.
            </li>
            <li>
              Kelajakdagi ish tartibi (tanlov): yakka tartib, korxonada yollanish,
              xorijda ishlash.
            </li>
          </ul>

          <Divider />
          <h2 style={sectionTitle}>2.2 Rollar (4 tomonli)</h2>
          <h3 style={subTitle}>1. Buyurtmachi — Jismoniy shaxs</h3>
          <p>
            Ro‘yhat: F.I.SH, telefon, manzil, ixtiyoriy email. Funktsiyalar: buyurtma
            berish, ustalarni qidirish, baho berish, buyurtmalar tarixi.
          </p>

          <h3 style={subTitle}>2. Buyurtmachi — Yuridik shaxs (korxona)</h3>
          <p>
            Ro‘yhat: korxona nomi, kontakt shaxs, telefon, manzil, email, rasmiy hujjat
            (PDF).
          </p>

          <h3 style={subTitle}>3. Bajaruvchi — Kasbiy ta'lim bitiruvchisi (diplomli)</h3>
          <ul>
            <li>Ismi, familiyasi</li>
            <li>Yashash hududi (tuman, mahalla)</li>
            <li>Kasb (elektr, santexnik, ustachilik, dizayn va h.k.)</li>
            <li>Ish tajribasi (yil, joy)</li>
            <li>Diplom/Sertifikat (PDF, JPG)</li>
            <li>Portfolio (rasmlar/video)</li>
            <li>Narxlar oralig‘i</li>
          </ul>
          <p>
            <b>Qo‘shimcha:</b> katta loyihalarda ishlashga tayyormi (Ha/Yo‘q), jamoasi
            bormi, texnika/uskuna mavjudligi (ixtiyoriy), tanlovlarda ishtirok (Ha/Yo‘q),
            buyurtmalarga javob, baho va izohlarni ko‘rish, tarix.
          </p>

          <h3 style={subTitle}>4. Bajaruvchi — Diplomsiz, lekin tajribali usta</h3>
          <ul>
            <li>Ismi, familiyasi</li>
            <li>Yashash hududi (mahalla)</li>
            <li>Kasb (elektr, santexnik, ustachilik, dizayn va h.k.)</li>
            <li>Portfolio (rasm/video)</li>
            <li>Narxlar oralig‘i</li>
          </ul>

          <Divider />
          <h2 style={sectionTitle}>Ish qidirish filtr va jadval funksiyalari</h2>
          <ul>
            <li>Mutaxassislik</li>
            <li>Hudud / mahalla</li>
            <li>Narx diapazoni</li>
            <li>Reyting</li>
          </ul>

          <Divider />
          <h2 style={sectionTitle}>6. Profil va ma’lumot maydonlari</h2>
          <h3 style={subTitle}>6.1 Bosh profil (hamma uchun)</h3>
          <ul>
            <li>Ism, familiya, avatar</li>
            <li>Xizmat yo‘nalishi</li>
            <li>Aloqa, faoliyat hududi (geolokatsiya)</li>
            <li>Qisqacha bio</li>
          </ul>

          <h3 style={subTitle}>6.2 Bajaruvchi (ustalar uchun)</h3>
          <ul>
            <li>Mutaxassislik(lar), ish tajribasi (yillar)</li>
            <li>Hududlar, narx diapazoni</li>
            <li>Portfolio (rasmlar/video), diplom/sertifikat (PDF/JPG)</li>
            <li>Tanlovlar va yutuqlar (nomi, sana, natija)</li>
            <li>Katta loyihalarga tayyormi, jamoa va texnika ro‘yxati</li>
          </ul>

          <h3 style={subTitle}>6.3 Buyurtmachi — yuridik shaxs</h3>
          <p>Korxona nomi, manzil, kontakt ma’lumotlar.</p>

          <Divider />
          <h2 style={sectionTitle}>7.2 Buyurtma oqimi</h2>
          <ol>
            <li>
              Buyurtmachi yangi buyurtma yaratadi (manzil, tavsif, rasm, byudjet, ixtisos).
            </li>
            <li>Tizim mos ustalarni topadi va xabardor qiladi.</li>
            <li>Usta qabul/rad etadi, narx va muddat kelishiladi.</li>
            <li>Ish tugaganda baho va izoh qoldiriladi.</li>
            <li>Buyurtma yopiladi, reyting yangilanadi.</li>
          </ol>

          <Divider />
          <h2 style={sectionTitle}>Qolgan (rejalashtirilgan):</h2>
          <h3 style={subTitle}>Monetizatsiya</h3>
          <ul>
            <li>
              Usta akkauntini faollashtirish uchun 5000 so‘m (Uzcard/Humo/Click/Payme).
            </li>
            <li>Premium xizmatlar: yuqori qidiruv, reklama, kengaytirilgan portfolio.</li>
          </ul>

          <h3 style={subTitle}>Autentifikatsiya</h3>
          <ul>
            <li>Telefon raqam + SMS tasdiqlash</li>
            <li>2FA (SMS yoki Authenticator)</li>
          </ul>

          <h3 style={subTitle}>Avtomatik rezyume</h3>
          <ul>
            <li>Savol-javob orqali rezyume yaratiladi</li>
            <li>Platformada ko‘rinadi, ish beruvchilar uchun ochiq</li>
          </ul>

          <h3 style={subTitle}>Geolokatsiya</h3>
          <ul>
            <li>Google/Yandex Maps (geocoding, reverse geocoding, distance matrix)</li>
            <li>Default radius: 5 km (sozlanadi)</li>
            <li>Sortlash: masofa, mahalla, reyting, tajriba</li>
            <li>Ustalar kartada pin sifatida ko‘rsatiladi</li>
          </ul>

          <h3 style={subTitle}>Reyting algoritmi</h3>
          <ul>
            <li>Baho (yulduzlar), ishlar soni, hujjatlar/foto, faollik, tanlovlar, jamoa</li>
            <li>Avtomatik yangilanish</li>
          </ul>

          <h3 style={subTitle}>Statistika</h3>
          <ul>
            <li>Oy yakunida ishlar soni, eng faol ustalar, talabgir kasblar</li>
            <li>Umumiy to‘lovlar hajmi (foydalanuvchilarga ko‘rinadi)</li>
          </ul>

          <h3 style={subTitle}>Xorijdagi ishlar integratsiyasi</h3>
          <p>
            Migratsiya agentligi bilan bog‘langan vakansiyalar, moderatorlar e’lonlarni
            tasdiqlaydi, cron yoki webhooks orqali sinxronizatsiya.
          </p>

          <h3 style={subTitle}>Yuridik shaxs analitikasi</h3>
          <p>Vakansiyalar, yollanganlar, reytinglar, korxona statistika paneli.</p>

          <h3 style={subTitle}>Mehnat yarmarkalari</h3>
          <p>Bannerlar, e’lonlar (sana, joy, format, ishtirokchilar).</p>

          <h3 style={subTitle}>Texnikum o‘quv dasturlari</h3>
          <p>
            Kurs, modul, muddati, sertifikat, manzil. Moderator texnikum ostida dastur
            biriktira oladi.
          </p>

          <Divider />
          <h2 style={{ ...sectionTitle, color: "#b91c1c" }}>RAZRABOTKADA:</h2>
          <ul>
            <li>Mavjud bo‘lish sanalari (bandlik kalendari)</li>
            <li>Qaysi hududlarda ishlaydi (geolokatsiya kengaytmasi)</li>
            <li>API: Google Maps/Yandex Maps</li>
            <li>Sortlash: masofa, reyting, tajriba</li>
          </ul>
        </div>
      </ModalBody>
    </Modal>
  );
}

/* ======= inline styles ======= */
const sectionTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  marginTop: 20,
  marginBottom: 10,
  color: "#0f172a",
  textTransform: "uppercase",
};

const subTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  marginTop: 12,
  marginBottom: 6,
  color: "#1e293b",
};

function Divider() {
  return (
    <div
      style={{
        borderTop: "1px solid #e5e7eb",
        margin: "20px 0",
        opacity: 0.8,
      }}
    />
  );
}
