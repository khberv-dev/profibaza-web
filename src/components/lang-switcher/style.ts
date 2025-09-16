import styled from "@emotion/styled";

export const SwitcherWrapper = styled.div`
  position: relative;
  display: inline-block;
  font-family: "Inter", sans-serif;
`;

export const SwitcherButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: none;
  background: transparent;
  color: #6b7280; /* серый */
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }

  svg {
    font-size: 14px;
  }
`;

export const SwitcherMenu = styled.ul`
  position: absolute;
  top: 110%;
  right: 0;
  margin: 0;
  padding: 6px 0;
  list-style: none;
  background: #fff;
  //   border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  min-width: 140px;
  z-index: 100;
`;

export const SwitcherMenuItem = styled.li<{ active?: boolean }>`
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  color: ${({ active }) => (active ? "#1e5cfb" : "#111827")};
  background: ${({ active }) => (active ? "#f3f6ff" : "transparent")};

  &:hover {
    background: #f9fafb;
  }
`;
