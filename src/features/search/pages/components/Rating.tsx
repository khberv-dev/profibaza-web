import React, { useId } from "react";
import {
  RatingWrap,
  StarRow,
  StarSvg,
  RatingPill,
} from "../../masters-search.style";

type Props = {
  value: number; // 0..5
  reviews?: number; // число отзывов
  size?: "m" | "s"; // компактный вариант для узких мест
};

const STAR_PATH =
  "M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.401 8.164L12 19.771 4.665 23.158l1.401-8.164L.132 9.21l8.2-1.192L12 .587z";

export default function Rating({ value, reviews, size = "m" }: Props) {
  const uid = useId();
  const stars = Array.from({ length: 5 }, (_, i) => {
    const fill = Math.max(0, Math.min(1, value - i)); // [0..1]
    return { idx: i, fill };
  });

  return (
    <RatingWrap aria-label={`Рейтинг ${value.toFixed(1)} из 5`}>
      <StarRow data-size={size}>
        {stars.map(({ idx, fill }) => {
          const clipId = `${uid}-clip-${idx}`;
          return (
            <StarSvg
              key={idx}
              viewBox="0 0 24 24"
              aria-hidden="true"
              data-size={size}
            >
              <defs>
                <clipPath id={clipId}>
                  <rect x="0" y="0" width={`${fill * 24}`} height="24" />
                </clipPath>
              </defs>
              {/* фон (пустая звезда) */}
              <path d={STAR_PATH} fill="#E2E8F0" />
              {/* заполнение (золото) обрезаем по ширине */}
              <g clipPath={`url(#${clipId})`}>
                <path d={STAR_PATH} fill="#F5B301" />
              </g>
            </StarSvg>
          );
        })}
      </StarRow>

      <RatingPill
        data-size={size}
        title={`${value.toFixed(1)} • отзывов: ${reviews ?? 0}`}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path d={STAR_PATH} fill="#F5B301" />
        </svg>
        <span>{value.toFixed(1)}</span>
        {!!reviews && <small>({reviews})</small>}
      </RatingPill>
    </RatingWrap>
  );
}
