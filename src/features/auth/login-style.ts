import styled from "@emotion/styled";

export const PageWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100dvh;
  background: #f7f8fc;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

/* LEFT */
export const LeftSide = styled.div`
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: center;
  align-items: center;
  background: #f7f8fc;

  @media (max-width: 992px) {
    display: none; /* как на референсе — можно скрыть на мобиле */
  }
`;

export const Brand = styled.div`
  position: absolute;
  top: 20px;
  left: 32px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #0f172a;
`;

export const Illustration = styled.img`
  width: 340px;
  max-width: 70%;
  height: auto;
  user-select: none;
`;

export const Welcome = styled.h1`
  margin: 0;
  font-size: 36px;
  font-weight: 800;
  color: #0f172a;
`;

export const Subtitle = styled.p`
  margin: 0;
  color: #64748b;
`;

/* RIGHT */
export const RightSide = styled.div`
  display: grid;
  place-items: center;
  background: #ffffff;
`;

export const Card = styled.form`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  // border: 1px solid #eef1f6;
  box-sizing: border-box;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  // box-shadow: 0 8px 24px rgba(16, 24, 40, 0.04);
`;

export const CardTitle = styled.h2`
  margin: 4px 0 0;
  font-size: 24px;
  font-weight: 800;
  color: #111827;
`;

export const TopHint = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 6px;
`;

export const AgreementText = styled.p`
  margin: 5px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: #737373;
  text-align: center;
  max-width: 420px; /* чтобы не ломался перенос */
  align-self: center; /* центрируем в карточке */
  word-break: break-word;

  /* если вдруг забудем Trans и придёт обычный <a> — тоже ок */
  a {
    color: #1e5cfb;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

export const AgreementLink = styled.a`
  color: #1e5cfb;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

// опционально отдельный alias под ссылки в Trans:
export const AgreementA = AgreementLink;

export const LinksRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
`;

export const LinkA = styled.a`
  color: #1e5cfb;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;
