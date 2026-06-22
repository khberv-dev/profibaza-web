import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Empty, PageWrap, Title } from "../notifications.style";

export default function NotificationsPage() {
  const { t } = useTranslation();

  return (
    <PageWrap>
      <Title>{t("notificationsPage.title")}</Title>
      <Empty>
        <Bell size={40} className="ico" strokeWidth={1.5} />
        <h2>{t("notificationsPage.emptyTitle")}</h2>
        <p>{t("notificationsPage.emptyDesc")}</p>
      </Empty>
    </PageWrap>
  );
}
