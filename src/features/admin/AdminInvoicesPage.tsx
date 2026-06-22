import React, { useMemo, useState } from "react";
import { useAdminInvoices } from "../../shared/modules/invoices";

const Skel: React.FC<{ h?: number }> = ({ h = 18 }) => (
  <div style={{height:h,borderRadius:8,background:"#f1f5f9",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,transform:"translateX(-100%)",
      background:"linear-gradient(90deg, rgba(241,245,249,0) 0%, rgba(255,255,255,.6) 50%, rgba(241,245,249,0) 100%)",
      animation:"sk 1.2s infinite"}}/>
    <style>{`@keyframes sk{100%{transform:translateX(100%);}}`}</style>
  </div>
);

const Badge: React.FC<{ status?: string | null }> = ({ status }) => {
  const map: Record<string, { bg: string; bd: string; fg: string; label: string }> = {
    CREATED: { bg: "#eff6ff", bd: "#dbeafe", fg: "#1d4ed8", label: "Создан" },
    PAID: { bg: "#dcfce7", bd: "#bbf7d0", fg: "#15803d", label: "Оплачен" },
    CANCELLED: { bg: "#fee2e2", bd: "#fecaca", fg: "#b91c1c", label: "Отменён" },
  };

  const key = (status ?? "").toUpperCase();
  const style = map[key] ?? {
    bg: "#f1f5f9",
    bd: "#e2e8f0",
    fg: "#475569",
    label: status || "—",
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        background: style.bg,
        border: `1px solid ${style.bd}`,
        color: style.fg,
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      {style.label}
    </span>
  );
};

const fmtMoney = (n?: number) => typeof n === "number" ? `${n.toLocaleString("ru-RU")} сум` : "—";
const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleString("ru-RU") : "—";

export default function AdminInvoicesPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isFetching } = useAdminInvoices(page, limit);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  // агрегаты (пока по видимым данным страницы)
  const totals = useMemo(() => {
    const sum = items.reduce((s, x) => s + (x.amount || 0), 0);
    const paid = items.filter(x => x.status === "PAID").reduce((s,x)=>s+(x.amount||0),0);
    return { sum, paid, count: items.length };
  }, [items]);

  return (
    <div style={{ padding:24, display:"grid", gap:16 }}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h2 style={{margin:0, fontSize:24, fontWeight:900, letterSpacing:"-0.01em"}}>Инвойсы</h2>
        <div style={{display:"flex", gap:8, alignItems:"center"}}>
          <div style={{padding:"6px 10px", border:"1px solid #e7ecf3", borderRadius:10, background:"#fff", fontWeight:700}}>
            На странице: {totals.count} • Сумма: {fmtMoney(totals.sum)} • Оплачено: {fmtMoney(totals.paid)}
          </div>
        </div>
      </div>

      <div style={{
        background:"#fff", border:"1px solid #e7ecf3", borderRadius:14,
        boxShadow:"0 10px 24px rgba(2,6,23,0.06)", overflow:"hidden"
      }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
          <thead>
            <tr style={{ background:"#f9fafb", textAlign:"left" }}>
              <th style={{ padding:"12px 16px" }}>ID</th>
              <th style={{ padding:"12px 16px" }}>Пользователь</th>
              <th style={{ padding:"12px 16px" }}>Описание</th>
              <th style={{ padding:"12px 16px" }}>Сумма</th>
              <th style={{ padding:"12px 16px" }}>Статус</th>
              <th style={{ padding:"12px 16px" }}>Создан</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && !items.length && Array.from({length:limit}).map((_,i)=>(
              <tr key={i}><td colSpan={6} style={{padding:"12px 16px"}}><Skel/></td></tr>
            ))}

            {!isFetching && items.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding:24, textAlign:"center", color:"#64748b" }}>
                  Нет инвойсов
                </td>
              </tr>
            )}

            {items.map(row => (
              <tr key={row.id} style={{ borderTop:"1px solid #f1f5f9" }}>
                <td style={{ padding:"12px 16px", fontWeight:700, color:"#0f172a" }}>
                  {row.id.slice(0,8).toUpperCase()}
                </td>
                <td style={{ padding:"12px 16px", color:"#334155" }}>
                  {row.userId}
                </td>
                <td style={{ padding:"12px 16px", color:"#475569", maxWidth:420 }}>
                  {row.description || "—"}
                </td>
                <td style={{ padding:"12px 16px", fontWeight:700, color:"#1e40af" }}>
                  {fmtMoney(row.amount)}
                </td>
                <td style={{ padding:"12px 16px" }}>
                  <Badge status={row.status} />
                </td>
                <td style={{ padding:"12px 16px", color:"#64748b" }}>
                  {fmtDate(row.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* пагинация */}
      <div style={{ display:"flex", justifyContent:"center", gap:8 }}>
        <button
          onClick={()=>setPage(p=>Math.max(1, p-1))}
          disabled={page<=1}
          style={{
            padding:"8px 12px", borderRadius:10, border:"1px solid #e7ecf3",
            background:"#fff", cursor: page<=1 ? "not-allowed":"pointer"
          }}
        >
          Назад
        </button>
        <div style={{ alignSelf:"center", fontWeight:800 }}>Стр. {page} / {pages}</div>
        <button
          onClick={()=>setPage(p=>Math.min(pages, p+1))}
          disabled={page>=pages}
          style={{
            padding:"8px 12px", borderRadius:10, border:"1px solid #e7ecf3",
            background:"#fff", cursor: page>=pages ? "not-allowed":"pointer"
          }}
        >
          Далее
        </button>
      </div>
    </div>
  );
}
