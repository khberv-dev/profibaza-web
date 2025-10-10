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
      title="Platforma holati (2025)"
      width={760}
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
            maxHeight: "75vh",
            paddingRight: 6,
          }}
        >
          <div
            style={{
              fontWeight: 900,
              fontSize: 20,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              marginBottom: 10,
              color: "#065f46",
            }}
          >
            HOZIRGA QADAR PLATFORMAGA QO‘SHILGAN FUNKSIYALAR
          </div>

          <pre
            style={{
              fontFamily: "Inter, sans-serif",
              whiteSpace: "pre-wrap",
              marginBottom: 24,
            }}
          >
{`- Jismoniy buyurtmachi 
• Yuridik buyurtmachi (korxona) 
• Kasbiy ta'lim bitiruvchisi (diplomli) 
• Diplomsiz, lekin tajribali usta rollar qo‘shildi
- O‘zbek va rus tillari qo‘shildi
- Har bir foydalanuvchi (buyurtmachi yoki bajaruvchi) o‘zining yashash mahallasini ham kiritishi qo‘shildi
- Kelajakdagi ish tartibi maydoni (tanlov): yakka tartib, korxonada yollanish, xorijda ishlash qo‘shildi
- Foydalanuvchi profilida ism, familiya, aloqa, xizmat yo‘nalishi, faoliyat hududi, bio maydonlari kiritildi
- Bajaruvchilar uchun tajriba, mutaxassislik(lar), narx diapazoni, portfolio (rasm/video), diplom/sertifikat (PDF/JPG) maydonlari qo‘shildi
- Buyurtmachilar uchun buyurtma tarixi, baholash va izohlar funksiyasi kiritildi
- Buyurtma oqimi: buyurtma → ustaga yuborish → qabul/rad → bajarish → baholash → yopish jarayoni ishga tushirildi
- Ish qidirish filtrlari: mutaxassislik, hudud/mahalla, narx diapazoni, reyting
- Reyting tizimi: bajarilgan ishlar soni, baholar, faollik va hujjatlar asosida hisoblanadi
- Statistika: oy yakunida ishlar soni, eng faol ustalar, eng talabgir kasblar, umumiy to‘lovlar hajmi
- Geolokatsiya: foydalanuvchi joylashuvi, qidiruv radiusi (5 km), masofa bo‘yicha sortlash
- Yuridik shaxs profili: kompaniya ma’lumotlari, vakansiyalar va baholash bo‘limi
- Avtomatik rezyume: usta savol-javob orqali o‘z rezyumesini yaratishi mumkin
- Texnikum o‘quv dasturlari: kurs, modul, muddati, sertifikat, o‘quv muassasa manzili qo‘shildi`}
          </pre>

          <div
            style={{
              fontWeight: 900,
              fontSize: 20,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              marginBottom: 10,
              color: "#b45309",
            }}
          >
            BAJARILMOQDA
          </div>

          <pre
            style={{
              fontFamily: "Inter, sans-serif",
              whiteSpace: "pre-wrap",
              marginBottom: 24,
            }}
          >
{`- Monetizatsiya tizimi (Uzcard/Humo/Click/Payme integratsiyasi)
- Bandlik kalendari — ustaning qaysi sanalarda band ekanligini ko‘rsatish
- Yarmarkalar va reklama bo‘limi — mehnat yarmarkalari va e’lonlarni boshqarish
- Moderator paneli — texnikumlar, vakansiyalar va ustalarni tasdiqlash uchun interfeys
- Reyting algoritmi — real vaqtli baholash va avtomatik yangilanish logikasi
- Responsive dizayn — mobil va planshet versiyalari uchun adaptiv interfeys`}
          </pre>


          <div
            style={{
              fontSize: 13,
              color: "#6b7280",
              borderTop: "1px solid #e5e7eb",
              paddingTop: 8,
            }}
          >
            Oxirgi yangilanish: <b>2025-yil 10 oktabr</b>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
