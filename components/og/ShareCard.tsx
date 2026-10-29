type ShareCardProps = {
  kicker: string;
  title: string;
  lines: string[];
};

/** Layout for next/og ImageResponse. Satori needs flex on each box. */
export function ShareCard({ kicker, title, lines }: ShareCardProps) {
  const titleSize = title.length > 48 ? 52 : title.length > 32 ? 60 : 68;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0b1f3a",
        color: "#fafbfc",
        padding: "68px 72px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 18,
            height: 18,
            backgroundColor: "#d4af37",
            marginRight: 16,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 3,
            color: "#d4af37",
          }}
        >
          {kicker}
        </div>
      </div>

      <div style={{ display: "flex", paddingRight: 40 }}>
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            lineHeight: 1.12,
          }}
        >
          {title}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {lines.map((line, index) => (
          <div
            key={`${index}-${line}`}
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.35,
              color: index === lines.length - 1 ? "#f3e2a4" : "#fafbfc",
              marginTop: index === 0 ? 0 : 8,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
