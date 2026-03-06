const Icon = ({ d, size = 20, stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export const IcChat     = ({ size=20 }) => <Icon size={size} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
export const IcFolder   = ({ size=20 }) => <Icon size={size} d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />;
export const IcGrid     = ({ size=20 }) => <Icon size={size} d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />;
export const IcSearch   = ({ size=20 }) => <Icon size={size} d="M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm10 4-4.35-4.35" />;
export const IcEdit     = ({ size=20 }) => <Icon size={size} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
export const IcPackage  = ({ size=20 }) => <Icon size={size} d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />;
export const IcSettings = ({ size=20 }) => <Icon size={size} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8.66-4a8.52 8.52 0 0 1 0 2l2.16 1.68a.5.5 0 0 1 .12.64l-2.05 3.55a.5.5 0 0 1-.61.22l-2.55-1.02a7.5 7.5 0 0 1-1.73 1l-.38 2.71a.49.49 0 0 1-.5.42h-4.1a.49.49 0 0 1-.49-.42l-.38-2.71a7.5 7.5 0 0 1-1.74-1L5.24 18.1a.5.5 0 0 1-.61-.22L2.58 14.33a.49.49 0 0 1 .12-.64L4.86 12a7.82 7.82 0 0 1 0-2L2.7 8.32a.5.5 0 0 1-.12-.64l2.05-3.55a.5.5 0 0 1 .61-.22l2.55 1.02a7.5 7.5 0 0 1 1.73-1l.38-2.71A.49.49 0 0 1 10.4 1h4.1c.25 0 .46.18.5.42l.38 2.71a7.5 7.5 0 0 1 1.74 1l2.55-1.02a.5.5 0 0 1 .61.22l2.05 3.55a.49.49 0 0 1-.12.64L20.66 11z" />;
export const IcPlus     = ({ size=20 }) => <Icon size={size} d="M12 5v14M5 12h14" />;
export const IcArrowL   = ({ size=20 }) => <Icon size={size} d="M19 12H5M12 5l-7 7 7 7" />;
export const IcChevD    = ({ size=16 }) => <Icon size={size} d="M6 9l6 6 6-6" />;
export const IcChevL    = ({ size=16 }) => <Icon size={size} d="M15 18l-6-6 6-6" />;
export const IcChevR    = ({ size=16 }) => <Icon size={size} d="M9 18l6-6-6-6" />;
export const IcMic      = ({ size=20 }) => <Icon size={size} d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />;
export const IcAttach   = ({ size=20 }) => <Icon size={size} d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />;
export const IcX        = ({ size=18 }) => <Icon size={size} d="M18 6 6 18M6 6l12 12" />;
export const IcCalendar = ({ size=20 }) => <Icon size={size} d="M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />;
export const IcList     = ({ size=16 }) => <Icon size={size} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />;
export const IcCheck    = ({ size=16 }) => <Icon size={size} d="M20 6 9 17l-5-5" />;
export const IcDownload = ({ size=16 }) => <Icon size={size} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />;
export const IcBookmark = ({ size=16 }) => <Icon size={size} d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />;
export const IcUpload   = ({ size=32 }) => <Icon size={size} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
export const IcDoc      = ({ size=32 }) => <Icon size={size} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />;
export const IcBox      = ({ size=32 }) => <Icon size={size} d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />;
export const IcBell     = ({ size=20 }) => <Icon size={size} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />;
export const IcTrash    = ({ size=16 }) => <Icon size={size} d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />;
export const IcSend     = ({ size=18 }) => <Icon size={size} d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />;
export const IcWand     = ({ size=20 }) => <Icon size={size} d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M17.8 6.2 19 5M12.2 11.8 11 13M12.2 6.2 11 5M15 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5 22l10-10" />;
