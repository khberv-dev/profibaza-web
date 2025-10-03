import styled from "@emotion/styled";

/* Кнопка-иконка календаря (слева/справа внутри инпута) */
export const DateIconBtn = styled.button`
  position: absolute;
  right: 36px;              /* перед крестиком */
  top: 50%;
  transform: translateY(-50%);
  width: 24px; height: 24px;
  display: grid; place-items: center;
  border: 0; background: transparent;
  color: #9aa3b2;          /* нейтральная иконка */
  pointer-events: none;    /* чисто декоративная */
`;

/* Кнопка очистки (крестик) — визуально совпадает с твоим ToggleButton */
export const ClearBtn = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px; height: 28px;
  display: grid; place-items: center;
  border: 0; background: #fff;
  color: #6b7280;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow .15s ease, color .12s ease, transform .06s ease;

  &:hover { color: #374151; box-shadow: 0 0 0 3px rgba(30,92,251,.12); }
  &:active { transform: translateY(calc(-50% + 1px)); }
`;
