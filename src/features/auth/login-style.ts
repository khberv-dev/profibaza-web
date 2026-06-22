import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const primary = "#2563eb";
const primaryDark = "#1d4ed8";

export const PageWrap = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(440px, 1.25fr) minmax(380px, 500px);
  min-height: 100dvh;
  background: #f8fafc;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

export const LeftSide = styled.div`
  position: relative;
  overflow: hidden;
  padding: 56px 64px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(155deg, #070b14 0%, #0f172a 42%, #1e3a8a 100%);
  color: #fff;

  &::before {
    content: "";
    position: absolute;
    width: 520px;
    height: 520px;
    top: -140px;
    right: -100px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(96, 165, 250, 0.32) 0%,
      transparent 68%
    );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    width: 380px;
    height: 380px;
    bottom: -120px;
    left: -80px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(37, 99, 235, 0.26) 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  @media (max-width: 992px) {
    display: none;
  }
`;

export const LeftContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 22px;
  width: 100%;
  max-width: 520px;
`;

export const BrandLink = styled(Link)`
  position: absolute;
  top: 28px;
  left: 40px;
  z-index: 2;
  text-decoration: none;

  @media (max-width: 992px) {
    display: none;
  }
`;

export const Brand = styled.div`
  font-weight: 800;
  font-size: 20px;
  letter-spacing: 0.06em;
  color: #fff;
`;

export const MobileHeader = styled.div`
  display: none;
  width: 100%;
  padding: 18px 20px 0;
  box-sizing: border-box;
  align-items: center;
  justify-content: flex-start;

  @media (max-width: 992px) {
    display: flex;
  }
`;

export const MobileBrand = styled(Link)`
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 0.04em;
  color: #fff;
  text-decoration: none;
`;

export const MobileHero = styled.div`
  display: none;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 20px 28px;
  background: linear-gradient(165deg, #070b14 0%, #0f172a 55%, #1e3a8a 100%);
  color: #fff;
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 280px;
    height: 280px;
    top: -80px;
    right: -40px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(96, 165, 250, 0.25) 0%,
      transparent 68%
    );
    pointer-events: none;
  }

  @media (max-width: 992px) {
    display: block;
  }
`;

export const MobileHeroInner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
`;

export const LottieStage = styled.div`
  position: relative;
  width: min(420px, 100%);
  height: min(340px, 42vw);
  display: grid;
  place-items: center;
  margin: 0 auto;

  &::before {
    content: "";
    position: absolute;
    inset: 8% 10%;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(96, 165, 250, 0.22) 0%,
      rgba(37, 99, 235, 0.08) 45%,
      transparent 72%
    );
    filter: blur(8px);
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 18% 14%;
    border-radius: 28px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 1;
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    max-height: none !important;
  }

  canvas,
  svg {
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    max-height: none !important;
  }
`;

export const LottieWrap = styled(LottieStage)`
  @media (max-width: 992px) {
    display: none;
  }
`;

export const MobileLottieStage = styled(LottieStage)`
  display: none;
  width: min(300px, 88vw);
  height: min(220px, 52vw);
  margin-top: 4px;

  @media (max-width: 992px) {
    display: grid;
  }
`;

export const Welcome = styled.h1`
  margin: 0;
  font-size: clamp(30px, 3vw, 42px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.12;
  color: #fff;
`;

export const MobileWelcome = styled(Welcome)`
  font-size: clamp(24px, 6.5vw, 30px);
`;

export const Subtitle = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.76);
  font-size: 16px;
  line-height: 1.65;
  max-width: 460px;
`;

export const MobileSubtitle = styled(Subtitle)`
  font-size: 14px;
  line-height: 1.55;
  max-width: 320px;
`;

export const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 6px 0 0;
  display: grid;
  gap: 12px;
  width: 100%;
  text-align: left;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 14px;
  line-height: 1.5;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    margin-top: 6px;
    border-radius: 50%;
    background: linear-gradient(135deg, #93c5fd, #60a5fa);
    box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.15);
    flex-shrink: 0;
  }
`;

export const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: 32px 28px 48px;
  background:
    radial-gradient(circle at 15% 8%, rgba(37, 99, 235, 0.07), transparent 42%),
    radial-gradient(circle at 85% 92%, rgba(37, 99, 235, 0.05), transparent 38%),
    #f8fafc;

  @media (max-width: 992px) {
    flex: 1;
    justify-content: flex-start;
    padding: 0 0 32px;
    min-height: auto;
    background: #f8fafc;
  }
`;

export const AuthFormScroll = styled.div`
  width: 100%;
  max-width: 460px;
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  padding: 4px 6px 4px 2px;
  box-sizing: border-box;
  margin: 0 auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(15, 23, 42, 0.12);
    border-radius: 999px;
  }

  @media (max-width: 992px) {
    max-width: none;
    max-height: none;
    overflow: visible;
    padding: 0 16px;
    width: 100%;
  }
`;

export const Card = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
  background: #fff;
  padding: 32px;
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 16px 48px rgba(15, 23, 42, 0.08);

  @media (max-width: 992px) {
    margin-top: -18px;
    position: relative;
    z-index: 2;
    border-radius: 24px 24px 20px 20px;
    box-shadow:
      0 -8px 32px rgba(15, 23, 42, 0.08),
      0 16px 40px rgba(15, 23, 42, 0.06);
  }

  @media (max-width: 520px) {
    padding: 26px 20px 24px;
    border-radius: 22px 22px 18px 18px;
  }
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #0f172a;
`;

export const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 2px;
  position: relative;
  z-index: 20;
`;

export const CardEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.08);
  color: ${primary};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  flex-shrink: 0;
`;

export const CardLangWrap = styled.div`
  position: relative;
  z-index: 21;
  flex-shrink: 0;
  margin-left: auto;

  button {
    color: #475569 !important;
    padding: 6px 10px !important;
    border-radius: 999px !important;
    border: 1px solid #e2e8f0 !important;
    background: #f8fafc !important;
    font-size: 13px !important;
    font-weight: 600 !important;
  }

  button:hover {
    background: #f1f5f9 !important;
    color: #0f172a !important;
    border-color: #cbd5e1 !important;
  }
`;

export const TopHint = styled.div`
  font-size: 14px;
  color: #64748b;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
`;

export const SubmitWrap = styled.div`
  margin-top: 4px;

  button {
    height: 48px !important;
    border-radius: 12px !important;
    font-weight: 700 !important;
    font-size: 15px !important;
    background: linear-gradient(180deg, ${primary} 0%, ${primaryDark} 100%) !important;
    box-shadow: 0 10px 28px rgba(37, 99, 235, 0.28) !important;
    transition: transform 0.12s ease, box-shadow 0.15s ease !important;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 14px 32px rgba(37, 99, 235, 0.34) !important;
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }
`;

export const AgreementText = styled.p`
  margin: 2px 0 0;
  font-size: 12px;
  line-height: 1.65;
  color: #64748b;
  text-align: center;
  word-break: break-word;

  a {
    color: ${primary};
    text-decoration: none;
    font-weight: 600;
  }
  a:hover {
    text-decoration: underline;
  }
`;

export const AgreementLink = styled.a`
  color: ${primary};
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

export const AgreementA = AgreementLink;

export const LinksRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2px;
`;

export const LinkA = styled.a`
  color: ${primary};
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;


export const FieldLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: -4px;
`;

export const GenderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 4px;
`;

export const GenderOption = styled.label<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ active }) => (active ? primary : "#e2e8f0")};
  background: ${({ active }) => (active ? "rgba(37, 99, 235, 0.08)" : "#fff")};
  color: ${({ active }) => (active ? primaryDark : "#334155")};
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: ${({ active }) => (active ? primary : "#cbd5e1")};
  }

  input {
    display: none;
  }
`;

/* legacy alias */
export const Illustration = styled.img`
  width: 340px;
  max-width: 70%;
  height: auto;
  user-select: none;
`;
