import styled from "@emotion/styled";
import userSvg from "/avatar.png";

export const Wrap = styled.div`
  max-width: 980px;
  margin: 24px auto 48px;
  padding: 0 16px;
`;

export const Breadcrumbs = styled.div`
  color: #9aa1ab;
  font-size: 14px;
  margin-bottom: 12px;
  span {
    color: #1f2937;
  }
`;

export const Card = styled.div`
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 20px;
  padding: 20px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #eef1f6;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.04);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Name = styled.h1`
  margin: 0;
  font-size: 32px;
  line-height: 1.1;
  font-weight: 800;
  color: #0f172a;
`;

export const Subline = styled.div`
  color: #667085;
  font-size: 16px;
`;

export const EditBtn = styled.button`
  width: fit-content;
  border: 1px solid #e6eaf1;
  background: #f2f2f7;
  color: #111827;
  border-radius: 10px;
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  &:hover {
    background: #e9e9f2;
    border-color: #dfe5ee;
  }
`;

export const Avatar = styled.div`
  width: 220px;
  height: 220px;
  border-radius: 12px;
  border: 1px solid #e6eaf1;
  background: #f2f4f7 url(${userSvg}) center/100% no-repeat;

  @media (max-width: 760px) {
    width: 100%;
    height: 180px;
  }
`;

export const SectionTitle = styled.h2`
  margin: 24px 0 12px;
  font-size: 18px;
  color: #0f172a;
`;

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 12px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const ContactCard = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f6f8fd;
  border: 1px solid #edf1f8;
  border-radius: 14px;
`;

export const ContactIcon = styled.img`
  width: 28px;
  height: 28px;
  opacity: 0.9;
`;

export const FieldTitle = styled.div`
  font-size: 14px;
  color: #667085;
`;

export const FieldValue = styled.div`
  font-weight: 600;
  color: #111827;
`;

export const IconRow = styled.div`
  display: flex;
  gap: 14px;
  margin: 14px 0 8px;
  flex-wrap: wrap;
`;

export const IconBtn = styled.button`
  width: 160px;
  height: 76px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #edf1f8;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.05s;
  img {
    width: 28px;
    height: 28px;
  }
  &:hover {
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
  }
  &:active {
    transform: translateY(1px);
  }
`;

export const AddLink = styled.a`
  color: #1e5cfb;
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;
