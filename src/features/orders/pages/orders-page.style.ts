import styled from "@emotion/styled";

export const Wrap = styled.div`
  padding: 20px 16px 32px;
  display: grid;
  gap: 16px;
  overflow-x: clip;

  @media (max-width: 640px) {
    padding: 0 0 24px;
    gap: 0;
  }
`;

export const FilesWrap = styled.div`
  max-height: min(70vh, 560px);
  overflow: auto;
  padding-right: 4px;
`;

export const FilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
    gap: 8px;
  }
`;

export const FileCard = styled.div`
  position: relative;
  border: 1px solid #e7ecf3;
  border-radius: 10px;
  background: #f9fbff;
  padding: 8px;
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 6px;
  min-height: 120px;

  a {
    display: block;
    border-radius: 8px;
    overflow: hidden;
    line-height: 0;
    background: #eef2ff;
  }

  @media (max-width: 640px) {
    min-height: 100px;
    padding: 6px;
  }
`;

export const FileName = styled.div`
  font-size: 11px;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EmptyFiles = styled.div`
  padding: 20px 12px;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
  color: #64748b;
  background: #fafafa;
  text-align: center;
  font-size: 14px;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 640px) {
    align-items: center;
    padding: 14px 16px 10px;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  color: #0f172a;

  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

export const Counter = styled.span`
  color: #667085;
  font-size: 13px;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

export const SoftBanner = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #ffe8cc;
  background: #fff7ed;
  color: #92400e;
  font-size: 14px;

  @media (max-width: 640px) {
    margin: 0 16px 8px;
    font-size: 13px;
  }

  button {
    margin-left: 8px;
    border: 0;
    background: transparent;
    color: #7c3aed;
    cursor: pointer;
  }
`;

export const List = styled.div`
  display: grid;
  gap: 12px;

  @media (max-width: 640px) {
    gap: 0;
  }
`;

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #e7effc;
  box-shadow: 0 4px 14px rgba(2, 32, 71, 0.04);
  min-width: 0;

  @media (max-width: 640px) {
    gap: 12px;
    padding: 14px 16px;
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom: 1px solid #e7effc;
    box-shadow: none;
  }
`;

export const CardHead = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
`;

export const CardHeadMain = styled.div`
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 4px;
`;

export const CardHeadTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;

  a {
    text-decoration: none;
    color: inherit;
    min-width: 0;
    flex: 1;
  }
`;

export const CardBody = styled.div`
  display: grid;
  gap: 10px;
  min-width: 0;
`;

export const Name = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #12284a;
  word-break: break-word;
  line-height: 1.25;

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

export const Sub = styled.div`
  font-size: 13px;
  color: #6b7a90;
  line-height: 1.4;

  @media (max-width: 640px) {
    font-size: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const Status = styled.span<{
  $tone: "blue" | "green" | "amber" | "gray" | "red";
}>`
  --c: #0b3b8f;
  --bg1: #f5f9ff;
  --bg2: #ecf3ff;
  --halo: 37, 99, 235;

  ${({ $tone }) =>
    $tone === "green"
      ? `--c:#14532d; --bg1:#f3fcf7; --bg2:#e8fbf2; --halo:20,83,45;`
      : $tone === "amber"
      ? `--c:#92400e; --bg1:#fff8ef; --bg2:#fff3e3; --halo:146,64,14;`
      : $tone === "gray"
      ? `--c:#475467; --bg1:#f7f8fa; --bg2:#f2f4f7; --halo:71,84,103;`
      : $tone === "red"
      ? `--c:#991b1b; --bg1:#fff5f5; --bg2:#feecec; --halo:153,27,27;`
      : ""}

  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  color: var(--c);
  background: linear-gradient(180deg, var(--bg1), var(--bg2));
  flex-shrink: 0;
  white-space: nowrap;

  &::before {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: var(--c);
    box-shadow: 0 0 0 2px rgba(var(--halo), 0.12);
  }
`;

export const Desc = styled.p`
  margin: 0;
  color: #1f2937;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;

  @media (max-width: 640px) {
    font-size: 13px;
    padding: 9px 10px;
  }
`;

export const Meta = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;
  border: 1px solid #eef2f7;
  border-radius: 10px;
  background: #f8fafc;
  overflow: hidden;

  li {
    display: grid;
    grid-template-columns: 18px minmax(72px, auto) minmax(0, 1fr);
    gap: 6px 8px;
    align-items: baseline;
    padding: 9px 12px;
    font-size: 13px;
    color: #6b7a90;
    border-bottom: 1px solid #eef2f7;
    min-width: 0;
  }

  li:last-child {
    border-bottom: none;
  }

  li svg {
    width: 16px;
    height: 16px;
    margin-top: 1px;
    flex-shrink: 0;
  }

  .k {
    color: #7b8ba5;
    font-size: 12px;
  }

  .v {
    color: #12284a;
    font-weight: 600;
    font-size: 13px;
    text-align: right;
    word-break: break-word;
  }

  @media (max-width: 640px) {
    li {
      padding: 8px 10px;
      grid-template-columns: 16px minmax(64px, auto) minmax(0, 1fr);
    }

    .k {
      font-size: 11px;
    }

    .v {
      font-size: 12px;
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
`;

const Btn = styled.button`
  height: 38px;
  font-size: 13px;
  padding: 0 12px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

export const Primary = styled(Btn)`
  border: 1px solid #2f6bff;
  background: #2f6bff;
  color: #fff;
`;

export const Ghost = styled(Btn)`
  border: 1px solid #e7ecf3;
  background: #fff;
  color: #0f172a;
  text-decoration: none;

  @media (max-width: 640px) {
    width: 100%;
    min-width: 0;
    height: 40px;
    font-size: 12px;
    padding: 0 8px;
  }
`;

export const Empty = styled.div`
  margin: 24px 0;
  padding: 28px;
  border-radius: 16px;
  border: 1px dashed #dbeafe;
  background: #f8fbff;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 8px;
  color: #0f172a;

  .ico {
    color: #2563eb;
  }

  h3 {
    margin: 8px 0 0;
  }

  p {
    margin: 0;
    color: #6b7a90;
  }

  @media (max-width: 640px) {
    margin: 12px 16px;
    padding: 22px 16px;
    border-radius: 12px;
  }
`;

export const CreateBtn = styled.button`
  margin-top: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #2f6bff;
  background: #2f6bff;
  color: #fff;
  font-weight: 700;
  cursor: pointer;

  @media (max-width: 640px) {
    width: 100%;
    max-width: 280px;
  }
`;

export const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #e7effc;
  overflow: hidden;

  .head {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .a {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    flex-shrink: 0;
    background: linear-gradient(90deg, #f3f4f6, #eef2ff, #f3f4f6);
    animation: ordersShimmer 1.3s infinite;
  }

  .b {
    flex: 1;
    display: grid;
    gap: 8px;
  }

  .l1,
  .l2,
  .l3 {
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(90deg, #f3f4f6, #eef2ff, #f3f4f6);
    animation: ordersShimmer 1.3s infinite;
  }

  .l2 {
    width: 70%;
  }

  .l3 {
    width: 50%;
  }

  @media (max-width: 640px) {
    padding: 14px 16px;
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom: 1px solid #e7effc;
  }

  @keyframes ordersShimmer {
    0% {
      background-position: -120px 0;
    }
    100% {
      background-position: 120px 0;
    }
  }
`;

export const ModalScroll = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: min(70vh, 560px);
  overflow: auto;
  min-height: 0;
`;

export const CommentBlock = styled.div`
  border-radius: 8px;
`;

export const CommentToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.25;
  font-weight: 600;
  background: #f1f4f9;
  border: none;
  color: #111827;
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 640px) {
    width: 100%;
    height: 40px;
    font-size: 12px;
  }
`;

export const CommentForm = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  textarea {
    width: 100%;
    min-height: 88px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    padding: 10px 12px;
    resize: vertical;
    font-size: 14px;
    color: #0f172a;
    box-sizing: border-box;

    &:focus,
    &:focus-visible {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 8px;

    button {
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 14px;
      cursor: pointer;
    }

    .save {
      background: #2563eb;
      color: #fff;
      border: none;
    }

    .cancel {
      background: #fff;
      border: 1px solid #d1d5db;
    }

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: stretch;

      button {
        width: 100%;
        min-height: 40px;
      }
    }
  }
`;

export const StarsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
`;

export const StarBtn = styled.button`
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #9aa5b2;

  &[data-active="true"] {
    color: #f59e0b;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

/* legacy aliases */
export const Left = CardHead;
export const Mid = CardBody;
export const Head = CardHeadTop;
