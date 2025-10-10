import { ReactNode, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCheck, FiUser, FiUsers, FiAward, FiTool, FiFilter, FiChevronRight } from "react-icons/fi";
import { Modal, ModalBody, ModalFooter } from "../../components/modal/Modal";

type Props = { open: boolean; onClose: () => void; onSnooze7d: () => void };

const ease: any = [0.22, 1, 0.36, 1];
const fadeIn: Variants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: .35, ease } } };

export default function OnboardingModal({ open, onClose, onSnooze7d }: Props) {
  const [tab, setTab] = useState<"roles" | "profile" | "flow">("roles");
  const TabBtn = ({ id, icon, label }: { id: typeof tab; icon:ReactNode; label: string }) => (
    <button
      onClick={() => setTab(id)}
      aria-pressed={tab === id}
      className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition
      ${tab === id ? "bg-[#f3f4f6] border-[#e5e7eb]" : "bg-white hover:bg-[#fafafa] border-[#eef0f3]"}`}
    >
      <span style={{ display:"inline-flex", gap:8, alignItems:"center" }}>{icon}{label}</span>
    </button>
  );

  return (
    <Modal open={open} onClose={onClose} title="Yangi ro‘yxatdan o‘tish turlari & ish oqimi" width={820}>
      <ModalBody>
        <motion.div variants={fadeIn} initial="hidden" animate="show">
          {/* Tabs */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
            <TabBtn id="roles"   icon={<FiUsers />} label="Rollar / Turlar" />
            <TabBtn id="profile" icon={<FiUser />}  label="Profil maydonlari" />
            <TabBtn id="flow"    icon={<FiChevronRight />} label="Buyurtma oqimi" />
          </div>

          {/* Summary badge line */}
          <div style={{
            display:"flex", gap:12, flexWrap:"wrap", marginBottom:14,
            fontSize:12, color:"#374151"
          }}>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#e5e7eb] bg-[#f9fafb]">
              <FiCheck /> Mahalla majburiy
            </span>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#e5e7eb] bg-[#f9fafb]">
              <FiCheck /> Kelajakdagi ish tartibi: yakka / korxona / xorij
            </span>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#e5e7eb] bg-[#f9fafb]">
              <FiFilter /> Filtrlar: mutaxassislik, hudud/mahalla, narx, reyting
            </span>
          </div>

          {/* Panels */}
          {tab === "roles" && (
            <section style={{ display:"grid", gap:12 }}>
              <Block
                icon={<FiUser />}
                title="Buyurtmachilar"
                bullets={[
                  "Jismoniy buyurtmachi",
                  "Yuridik buyurtmachi (korxona)"
                ]}
                details={[
                  "Jismoniy: F.I.SH, telefon, manzil, ixtiyoriy email; funksiyalar: buyurtma berish, ustalarni qidirish, baholash, buyurtmalar tarixi.",
                  "Yuridik (korxona): korxona nomi, kontakt shaxs, telefon, manzil, email, rasmiy hujjat (PDF)."
                ]}
              />
              <Block
                icon={<FiAward />}
                title="Bajaruvchi — Kasbiy ta'lim bitiruvchisi (diplomli)"
                bullets={[
                  "Ism, familiya; yashash hududi (tuman/mahalla)",
                  "Kasb (elektr, santexnik, ustachilik, dizayn va h.k.)",
                  "Ish tajribasi (yil, joy)",
                  "Diplom/Sertifikat yuklash (PDF/JPG)",
                  "Portfolio (rasm/video), narxlar oralig‘i",
                ]}
                details={[
                  "Katta qurilish loyihalarida ishlashga tayyormi (Ha/Yo‘q); o‘z jamoasi bormi (Ha/Yo‘q), jamoa soni;",
                  "Texnika/uskuna mavjudligi (ixtiyoriy).",
                  "Kelgan buyurtmalarga javob berish; baholar/izohlarni ko‘rish; buyurtmalar tarixi;",
                  "Tanlovlarda ishtirok (Ha/Yo‘q); bo‘lsa nomi.",
                  "Kelajakdagi ish tartibi: yakka / korxonada yollanish / xorijda ishlash."
                ]}
              />
              <Block
                icon={<FiTool />}
                title="Bajaruvchi — Diplomsiz, lekin tajribali usta"
                bullets={[
                  "Ism, familiya; yashash mahallasi",
                  "Kasb (mutaxassislik tanlash)",
                  "Portfolio (rasm/video), narxlar oralig‘i",
                ]}
                details={[
                  "Katta qurilishga tayyormi (Ha/Yo‘q); jamoa va soni (ixtiyoriy); uskuna mavjudligi (ixtiyoriy).",
                  "Buyurtmalarga javob, baholar/izohlar, buyurtma tarixi."
                ]}
              />
            </section>
          )}

          {tab === "profile" && (
            <section style={{ display:"grid", gap:12 }}>
              <Block
                icon={<FiUser />}
                title="Bosh profil (hamma uchun)"
                bullets={[
                  "Ism, familiya, avatar",
                  "Asosiy xizmatlar/yo‘nalish",
                  "Aloqa",
                  "Faoliyat hududi (geolokatsiya)",
                  "Qisqacha bio",
                ]}
              />
              <Block
                icon={<FiTool />}
                title="Bajaruvchi uchun qo‘shimcha"
                bullets={[
                  "Mutaxassislik(lar), ish tajribasi (yillar)",
                  "Qaysi hududlarda ishlaydi",
                  "Narx diapazoni",
                  "Portfolio (rasm/video)",
                  "Diplom/sertifikat (PDF/JPG)",
                  "Tanlov/yutuqlar (nomi, sana, natija)",
                  "Katta loyihalarga tayyormi, jamoa, jamoa soni/ixtisosligi",
                  "Texnika/uskuna ro‘yxati (ixtiyoriy)",
                ]}
              />
              <Block
                icon={<FiUsers />}
                title="Buyurtmachi — yuridik shaxs (korxona)"
                bullets={[
                  "Korxona nomi, manzil, kontaktlar",
                  "Rasmiy hujjat (PDF) biriktirish",
                ]}
              />
            </section>
          )}

          {tab === "flow" && (
            <section style={{ display:"grid", gap:12 }}>
              <Block
                icon={<FiChevronRight />}
                title="Buyurtma oqimi"
                bullets={[
                  "1) Buyurtmachi yangi buyurtma yaratadi (manzil, ish tavsifi, rasm, byudjet, kerakli ixtisos).",
                  "2) Tizim mos ustalarni topadi va taklif yuboradi.",
                  "3) Usta qabul/rad qiladi; qabul qilinsa muddat va narx kelishiladi.",
                  "4) Ish bajarilgach, buyurtmachi baho va izoh qoldiradi.",
                  "5) Buyurtma yopiladi va reyting yangilanadi."
                ]}
              />
            </section>
          )}
        </motion.div>
      </ModalBody>

      <ModalFooter>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%" }}>
          <label style={{ display:"inline-flex", gap:8, alignItems:"center", fontSize:13, color:"#6b7280", cursor:"pointer" }}>
            <input type="checkbox" onChange={(e) => e.target.checked && onSnooze7d()} />
            Shu oynani 7 kun ko‘rsatma
          </label>

          <div style={{ display:"flex", gap:8 }}>
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#e5e7eb] bg-white hover:bg-[#fafafa] text-sm">
              Keyinroq
            </button>
            <Link to="/register" style={{ textDecoration:"none" }}>
              <button className="px-4 py-2 rounded-lg bg-[#111827] text-white text-sm hover:opacity-95">
                Boshlash
              </button>
            </Link>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}

function Block({ icon, title, bullets, details }:{
  icon: ReactNode; title: string; bullets: string[]; details?: string[];
}) {
  return (
    <div className="rounded-xl border border-[#eef0f3] bg-white p-14 pt-4 pb-4" style={{padding:12}}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
        <div className="h-9 w-9 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-center">{icon}</div>
        <h3 style={{ margin:0, fontSize:15, fontWeight:800, color:"#111827" }}>{title}</h3>
      </div>
      <ul style={{ margin:0, paddingLeft:18, display:"grid", gap:6, color:"#374151", fontSize:14 }}>
        {bullets.map((b,i)=>(<li key={i}>{b}</li>))}
      </ul>
      {details && (
        <div style={{ marginTop:8, fontSize:13, color:"#4b5563" }}>
          {details.map((d,i)=>(<div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginTop:4 }}>
            <FiCheck style={{ marginTop:2, flexShrink:0 }} /> <span>{d}</span>
          </div>))}
        </div>
      )}
    </div>
  );
}
