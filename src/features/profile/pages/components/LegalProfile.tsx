// src/features/profile/components/LegalProfile.tsx
import React, { useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Field,
  Label,
  Input,
  Small,
  Notice,
  Divider,
  PrimaryBtn,
  GhostBtn,
  Upload,
} from "../../pro-profile-section.style";

export const LegalProfile: React.FC = () => {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [vacancies, setVacancies] = useState<
    Array<{ title: string; city?: string; salary?: string }>
  >([]);

  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <Card>
        <CardBody>
          <Row>
            <Field>
              <Label>Название компании</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </Field>
            <Field>
              <Label>Контактное лицо</Label>
              <Input
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </Field>
          </Row>

          <Row>
            <Field>
              <Label>Телефон</Label>
              <Input
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                inputMode="tel"
              />
            </Field>
            <Field>
              <Label>Email</Label>
              <Input
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                type="email"
              />
            </Field>
            <Field>
              <Label>Адрес</Label>
              <Input
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
            </Field>
          </Row>

          <Divider />

          <Row>
            <Field>
              <Label>Официальный документ (PDF)</Label>
              <Upload>
                <div>Перетащите PDF сюда или нажмите для выбора</div>
                <Small>(демо — без загрузки)</Small>
                <input type="file" accept="application/pdf" hidden />
              </Upload>
            </Field>
          </Row>

          <Divider />

          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "6px 0 14px" }}>
            Вакансии
          </h3>
          <Row>
            <Field>
              <button
                type="button"
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#1e5cfb",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
                onClick={() =>
                  setVacancies((v) => [
                    ...v,
                    {
                      title: `Новая вакансия #${v.length + 1}`,
                      city: "",
                      salary: "",
                    },
                  ])
                }
              >
                Добавить вакансию
              </button>
              <Small>Позже подключим CRUD и таблицу</Small>
            </Field>
          </Row>

          {vacancies.length === 0 ? (
            <Notice tone="muted">Пока нет вакансий</Notice>
          ) : (
            vacancies.map((v, idx) => (
              <Row key={idx}>
                <Field>
                  <Label>Должность</Label>
                  <Input
                    value={v.title}
                    onChange={(e) =>
                      setVacancies((all) =>
                        all.map((x, i) =>
                          i === idx ? { ...x, title: e.target.value } : x
                        )
                      )
                    }
                  />
                </Field>
                <Field>
                  <Label>Город/страна</Label>
                  <Input
                    value={v.city || ""}
                    onChange={(e) =>
                      setVacancies((all) =>
                        all.map((x, i) =>
                          i === idx ? { ...x, city: e.target.value } : x
                        )
                      )
                    }
                  />
                </Field>
                <Field>
                  <Label>Зарплата</Label>
                  <Input
                    value={v.salary || ""}
                    onChange={(e) =>
                      setVacancies((all) =>
                        all.map((x, i) =>
                          i === idx ? { ...x, salary: e.target.value } : x
                        )
                      )
                    }
                  />
                </Field>
              </Row>
            ))
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <PrimaryBtn type="button" disabled>
              Сохранить
            </PrimaryBtn>
            <GhostBtn type="button" disabled>
              Отмена
            </GhostBtn>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
