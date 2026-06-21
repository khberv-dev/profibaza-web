import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Page404 = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        textAlign: "center",
        background: "#f6f8fc",
      }}
    >
      <div>
        <div style={{ fontSize: 72, fontWeight: 900, color: "#12284a" }}>404</div>
        <h1 style={{ margin: "8px 0", color: "#12284a" }}>
          {t("errors.notFoundTitle")}
        </h1>
        <p style={{ color: "#6b7a90", maxWidth: 420, margin: "0 auto 20px" }}>
          {t("errors.notFoundText")}
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "10px 18px",
            borderRadius: 12,
            background: "#2f6bff",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          {t("errors.backHome")}
        </Link>
      </div>
    </div>
  );
};

export default Page404;
