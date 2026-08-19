"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  Facebook,
  Instagram,
  MapPin,
  Snowflake,
  Sun,
  CloudSun,
  Truck,
} from "lucide-react";
import type { StoreSettings } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type WeatherPayload = {
  temperature?: number;
  weatherCode?: number;
  isDay?: number;
};

const AMMAN_TIMEZONE = "Asia/Amman";

function weatherMeta(code = -1, isDay = 1) {
  if (code === 0) return { label: isDay ? "صافي" : "سماء صافية", Icon: Sun };
  if ([1, 2].includes(code)) return { label: "غائم جزئياً", Icon: CloudSun };
  if (code === 3) return { label: "غائم", Icon: Cloud };
  if ([45, 48].includes(code)) return { label: "ضباب", Icon: CloudFog };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: "أمطار", Icon: CloudRain };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "ثلوج", Icon: Snowflake };
  if ([95, 96, 99].includes(code)) return { label: "عواصف", Icon: CloudLightning };
  return { label: "طقس عمّان", Icon: CloudSun };
}

function timeToMinutes(value?: string) {
  const [hours = "0", minutes = "0"] = (value || "00:00").slice(0, 5).split(":");
  return Number(hours) * 60 + Number(minutes);
}

function isOpenNow(now: Date, openTime: string, closeTime: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: AMMAN_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value || 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value || 0);
  const current = hour * 60 + minute;
  const open = timeToMinutes(openTime);
  const close = timeToMinutes(closeTime);
  return open <= close ? current >= open && current < close : current >= open || current < close;
}

function formatBusinessTime(value: string) {
  const [hours = 0, minutes = 0] = value.slice(0, 5).split(":").map(Number);
  const date = new Date(Date.UTC(2026, 0, 1, hours, minutes));
  return new Intl.DateTimeFormat("ar-JO-u-nu-latn", {
    hour: "numeric",
    minute: minutes ? "2-digit" : undefined,
    hour12: true,
    timeZone: "UTC",
  }).format(date);
}

export function TopUtilityBar({ settings }: { settings: StoreSettings }) {
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<WeatherPayload | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    const loadWeather = async () => {
      try {
        const response = await fetch("/api/weather", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as WeatherPayload;
        if (active) setWeather(payload);
      } catch {
        // The status hub stays useful even when the weather provider is temporarily unavailable.
      }
    };
    loadWeather();
    const timer = window.setInterval(loadWeather, 10 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("ar-JO-u-nu-latn", {
        timeZone: AMMAN_TIMEZONE,
        weekday: "short",
        day: "numeric",
        month: "long",
      }).format(now),
    [now],
  );
  const timeLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("ar-JO-u-nu-latn", {
        timeZone: AMMAN_TIMEZONE,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(now),
    [now],
  );
  const open = isOpenNow(now, settings.open_time, settings.close_time);
  const weatherInfo = weatherMeta(weather?.weatherCode, weather?.isDay);
  const WeatherIcon = weatherInfo.Icon;

  return (
    <div className="status-hub-shell">
      <div className="container-shell py-2.5">
        <div className="status-hub hide-scrollbar">
          <div className="status-cluster">
            <div className="status-chip status-chip-featured">
              <span className="status-icon"><Truck size={13} /></span>
              <span><b>التوصيل {formatPrice(settings.delivery_price)}</b><small>لكل محافظات الأردن</small></span>
            </div>
            <div className="status-chip">
              <span className={`live-dot ${open ? "is-open" : "is-closed"}`} />
              <span><b>{open ? "مفتوح الآن" : "مغلق الآن"}</b><small>{formatBusinessTime(settings.open_time)} — {formatBusinessTime(settings.close_time)}</small></span>
            </div>
            <div className="status-chip">
              <span className="status-icon"><Clock3 size={13} /></span>
              <span><b>{timeLabel}</b><small>بتوقيت عمّان</small></span>
            </div>
            <div className="status-chip">
              <span className="status-icon"><CalendarDays size={13} /></span>
              <span><b>{dateLabel}</b><small>التاريخ اليوم</small></span>
            </div>
            <div className="status-chip">
              <span className="status-icon"><WeatherIcon size={14} /></span>
              <span><b>{weather?.temperature == null ? weatherInfo.label : `${Math.round(weather.temperature)}° • ${weatherInfo.label}`}</b><small className="inline-flex items-center gap-1"><MapPin size={9} /> عمّان</small></span>
            </div>
          </div>

          <div className="status-socials" aria-label="حسابات نوفا مودا">
            {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={15} /></a>}
            {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={15} /></a>}
          </div>
        </div>
      </div>
    </div>
  );
}
