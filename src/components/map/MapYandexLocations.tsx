import React, { useMemo } from "react";
import { YMaps, Map, Placemark, Circle } from "@pbe/react-yandex-maps";

export type MapLocation = {
  latitude: number;
  longitude: number;
  radius: number; // км (в UI), в круг передаём метры
};

type Props = {
  apiKey: string;
  locations: MapLocation[];
  onAdd: (loc: MapLocation) => void;
  onChange: (index: number, next: MapLocation) => void;
  onRemove: (index: number) => void;
  height?: number | string;
};

const DEFAULT_CENTER: [number, number] = [41.3111, 69.2797]; // Ташкент
const toMeters = (km: number) => Math.max(0, km) * 1000;

/** Красивый «рабочий» пин — SVG как data URL */
const WORK_PIN_SVG = encodeURIComponent(`
<svg width="48" height="56" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- тень -->
  <ellipse cx="24" cy="53" rx="12" ry="3" fill="rgba(0,0,0,0.18)"/>
  <!-- капля -->
  <path d="M24 52C24 52 42 37.5 42 26C42 15.5066 33.4934 7 23.9999 7C14.5066 7 6 15.5066 6 26C6 37.5 24 52 24 52Z"
        fill="#2F6BFF"/>
  <!-- обводка для объёма -->
  <path d="M24 52C24 52 42 37.5 42 26C42 15.5066 33.4934 7 23.9999 7C14.5066 7 6 15.5066 6 26C6 37.5 24 52 24 52Z"
        stroke="rgba(255,255,255,0.8)" stroke-width="1.2"/>
  <!-- белый круг в центре -->
  <circle cx="24" cy="26" r="9.5" fill="white" stroke="#E4ECFF" stroke-width="1.2"/>
  <!-- брифкейс -->
  <path d="M20.5 27.5v-3.2c0-.66.54-1.2 1.2-1.2h4.6c.66 0 1.2.54 1.2 1.2v3.2"
        stroke="#2F6BFF" stroke-width="1.4" stroke-linecap="round"/>
  <rect x="18.5" y="26.5" width="11" height="6" rx="1.2" fill="#2F6BFF"/>
  <rect x="18.5" y="26.5" width="11" height="6" rx="1.2" stroke="#2F6BFF" stroke-width="1"/>
  <circle cx="24" cy="29.5" r="0.9" fill="white"/>
</svg>
`);

export const MapYandexLocations: React.FC<Props> = ({
  apiKey,
  locations,
  onAdd,
  onChange,
  onRemove,
  height = 380,
}) => {
  const center = useMemo<[number, number]>(() => {
    if (locations[0]) return [locations[0].latitude, locations[0].longitude];
    return DEFAULT_CENTER;
  }, [locations]);

  const handleMapClick = (e: any) => {
    const coords = e.get("coords") as [number, number];
    onAdd({ latitude: coords[0], longitude: coords[1], radius: 10 });
  };

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #e7ecf3",
      }}
    >
      <YMaps query={{ apikey: apiKey, lang: "ru_RU", load: "package.full" }}>
        <Map
          onClick={handleMapClick}
          defaultState={{ center, zoom: 10 }}
          state={{ center, zoom: 10 }}
          width="100%"
          height={height}
          options={{
            suppressMapOpenBlock: true,
            yandexMapDisablePoiInteractivity: true,
          }}
          modules={["geoObject.addon.hint", "geoObject.addon.balloon"]}
        >
          {locations.map((loc, i) => {
            const coords: [number, number] = [loc.latitude, loc.longitude];
            return (
              <React.Fragment key={i}>
                <Circle
                  geometry={[coords, toMeters(loc.radius)]}
                  options={{
                    fillColor: "rgba(47,107,255,0.15)",
                    strokeColor: "rgba(47,107,255,0.55)",
                    strokeWidth: 2,
                  }}
                  properties={{
                    hintContent: `Зона #${i + 1} — ${loc.radius} км`,
                  }}
                />
                <Placemark
                  geometry={coords}
                  options={{
                    draggable: true,
                    // используем своё изображение + контент (если понадобится)
                    iconLayout: "default#imageWithContent",
                    iconImageHref: `data:image/svg+xml;utf8,${WORK_PIN_SVG}`,
                    iconImageSize: [48, 56],
                    // сдвигаем так, чтобы «носик» капли указывал точно на координату
                    iconImageOffset: [-24, -56],
                  }}
                  properties={{
                    iconCaption: "Рабочая зона",
                    hintContent: `Зона #${i + 1}`,
                    balloonContent: `<b>Зона #${i + 1}</b><br/>Радиус: ${
                      loc.radius
                    } км`,
                    // iconContent: "💼", // если нужен эмодзи-контент поверх — раскомментируй
                  }}
                  onDragEnd={(ev: any) => {
                    const newCoords = ev
                      .get("target")
                      .geometry.getCoordinates() as [number, number];
                    onChange(i, {
                      ...loc,
                      latitude: newCoords[0],
                      longitude: newCoords[1],
                    });
                  }}
                />
              </React.Fragment>
            );
          })}
        </Map>
      </YMaps>
    </div>
  );
};
