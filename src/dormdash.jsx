import { useState, useEffect, useCallback, useRef } from "react";

const DINING_HALLS = [
  { id: "allison", name: "Allison", subtitle: "South Campus", emoji: "🏛️", lat: 42.0514, lng: -87.6773, hours: "7am – 9pm", isOpen: true, radius: 120, color: "#FF6B6B" },
  { id: "elder", name: "Elder", subtitle: "North Campus", emoji: "🌿", lat: 42.0589, lng: -87.6752, hours: "7am – 8pm", isOpen: true, radius: 100, color: "#4ECB71" },
  { id: "plex", name: "Plex", subtitle: "Mid Campus", emoji: "🔷", lat: 42.0553, lng: -87.6741, hours: "7am – 10pm", isOpen: true, radius: 100, color: "#4A9EFF" },
  { id: "foster", name: "Foster-Walker", subtitle: "North Campus", emoji: "🍂", lat: 42.0596, lng: -87.6764, hours: "7am – 9pm", isOpen: false, radius: 100, color: "#FF9500" },
  { id: "hinman", name: "Hinman", subtitle: "South Campus", emoji: "⚡", lat: 42.0506, lng: -87.6759, hours: "11am – 2pm", isOpen: false, radius: 100, color: "#BF5AF2" },
];

const ALL_TAGS = ["🔥 Amazing!", "🍽️ Huge Portion", "🥦 Healthy", "🧂 Too Salty", "🌶️ Too Spicy", "😑 Bland", "🍬 Too Sweet", "🥵 Overcooked", "❄️ Undercooked", "📦 Small Portion"];
const POS_TAGS = ["🔥 Amazing!", "🍽️ Huge Portion", "🥦 Healthy"];

const SEED_MENU = {
  allison: [
    { id: 1, name: "Truffle Mac & Cheese", station: "Comfort", emoji: "🧀", upvotes: 142, downvotes: 12, tags: { "🔥 Amazing!": 89, "🍽️ Huge Portion": 44, "🧂 Too Salty": 8 }, reviews: [
      { id: "r1", user: "wildcat_2027", avatar: "W", vote: "up", tags: ["🔥 Amazing!"], text: "Honestly the best thing in Allison. Truffle flavor is subtle but so good. Get it while it's hot!", time: "2h ago", helpful: 14 },
      { id: "r2", user: "lakefill_lurker", avatar: "L", vote: "up", tags: ["🍽️ Huge Portion", "🧂 Too Salty"], text: "Portions are massive — could barely finish. A tiny bit salty for me but overall a total banger.", time: "5h ago", helpful: 8 },
    ]},
    { id: 2, name: "Korean BBQ Bowl", station: "Global", emoji: "🍚", upvotes: 98, downvotes: 6, tags: { "🔥 Amazing!": 61, "🥦 Healthy": 29, "🌶️ Too Spicy": 4 }, reviews: [
      { id: "r3", user: "nugrad_cs", avatar: "N", vote: "up", tags: ["🔥 Amazing!"], text: "Legitimately surprised how good this was. Rice was perfectly cooked and the sauce slaps.", time: "1h ago", helpful: 22 },
    ]},
    { id: 3, name: "Spinach Omelette", station: "Breakfast", emoji: "🥚", upvotes: 44, downvotes: 19, tags: { "😑 Bland": 18, "🥦 Healthy": 22 }, reviews: [] },
    { id: 4, name: "Chicken Tikka Masala", station: "Global", emoji: "🍛", upvotes: 87, downvotes: 14, tags: { "🌶️ Too Spicy": 23, "🔥 Amazing!": 51 }, reviews: [
      { id: "r4", user: "sheridan_rd", avatar: "S", vote: "down", tags: ["🌶️ Too Spicy"], text: "Too spicy for me personally, but if you like heat you'd love it. The sauce base tastes great.", time: "3h ago", helpful: 5 },
    ]},
    { id: 5, name: "Caesar Salad", station: "Salad Bar", emoji: "🥗", upvotes: 35, downvotes: 8, tags: { "😑 Bland": 6, "🥦 Healthy": 25 }, reviews: [] },
    { id: 6, name: "Banana Foster Pancakes", station: "Breakfast", emoji: "🥞", upvotes: 71, downvotes: 3, tags: { "🔥 Amazing!": 58, "🍬 Too Sweet": 10 }, reviews: [
      { id: "r5", user: "dillo_fan", avatar: "D", vote: "up", tags: ["🔥 Amazing!"], text: "These are DANGEROUS. I showed up at 8am just for these. The caramelized banana topping is elite.", time: "6h ago", helpful: 31 },
    ]},
  ],
  elder: [
    { id: 7, name: "Pepperoni Pizza", station: "Pizza", emoji: "🍕", upvotes: 201, downvotes: 18, tags: { "🔥 Amazing!": 130, "🧂 Too Salty": 15 }, reviews: [
      { id: "r6", user: "tech_wildcat", avatar: "T", vote: "up", tags: ["🔥 Amazing!"], text: "Elder pizza hits different at 11pm. Crispy crust, generous toppings. A NU institution.", time: "30m ago", helpful: 44 },
    ]},
    { id: 8, name: "Vegan Burger", station: "Grill", emoji: "🍔", upvotes: 56, downvotes: 31, tags: { "😑 Bland": 28, "🥦 Healthy": 19 }, reviews: [
      { id: "r7", user: "wildcat_2027", avatar: "W", vote: "down", tags: ["😑 Bland"], text: "I really wanted to like this but it needs serious seasoning. Texture is fine but zero flavor.", time: "4h ago", helpful: 17 },
    ]},
    { id: 9, name: "Sweet Potato Soup", station: "Soup", emoji: "🍲", upvotes: 73, downvotes: 4, tags: { "🔥 Amazing!": 40, "🥦 Healthy": 30 }, reviews: [] },
    { id: 10, name: "BBQ Ribs", station: "Grill", emoji: "🍖", upvotes: 115, downvotes: 9, tags: { "🔥 Amazing!": 88, "🍽️ Huge Portion": 22 }, reviews: [] },
  ],
  plex: [
    { id: 11, name: "Beef Tacos", station: "Mexican", emoji: "🌮", upvotes: 119, downvotes: 9, tags: { "🔥 Amazing!": 80, "🌶️ Too Spicy": 12 }, reviews: [] },
    { id: 12, name: "Pasta Primavera", station: "Pasta", emoji: "🍝", upvotes: 48, downvotes: 21, tags: { "😑 Bland": 19, "🥵 Overcooked": 8 }, reviews: [] },
    { id: 13, name: "Miso Ramen", station: "Asian", emoji: "🍜", upvotes: 134, downvotes: 7, tags: { "🔥 Amazing!": 99, "🧂 Too Salty": 11 }, reviews: [
      { id: "r8", user: "nugrad_cs", avatar: "N", vote: "up", tags: ["🔥 Amazing!"], text: "Best thing at Plex by miles. Broth is rich, noodles al dente. I come here just for this.", time: "1h ago", helpful: 29 },
    ]},
  ],
  foster: [
    { id: 14, name: "Eggs Benedict", station: "Brunch", emoji: "🍳", upvotes: 77, downvotes: 5, tags: { "🔥 Amazing!": 55, "🍽️ Huge Portion": 14 }, reviews: [] },
    { id: 15, name: "Grilled Salmon", station: "Grill", emoji: "🐟", upvotes: 92, downvotes: 7, tags: { "🔥 Amazing!": 60, "🥦 Healthy": 28 }, reviews: [] },
  ],
  hinman: [
    { id: 16, name: "Chocolate Lava Cake", station: "Dessert", emoji: "🍫", upvotes: 188, downvotes: 5, tags: { "🔥 Amazing!": 160, "🍽️ Huge Portion": 20 }, reviews: [
      { id: "r9", user: "dillo_fan", avatar: "D", vote: "up", tags: ["🔥 Amazing!", "🍽️ Huge Portion"], text: "This is dangerous. Molten center every single time. Hinman stay winning.", time: "45m ago", helpful: 52 },
    ]},
    { id: 17, name: "Minestrone Soup", station: "Soup", emoji: "🥣", upvotes: 41, downvotes: 11, tags: { "😑 Bland": 10, "🥦 Healthy": 18 }, reviews: [] },
  ],
};

const SEED_ACTIVITY = [
  { id: "a1", user: "wildcat_2027", avatar: "W", item: "Truffle Mac & Cheese", hall: "Allison", vote: "up", tag: "🔥 Amazing!", review: "Honestly the best thing in Allison.", time: "2m" },
  { id: "a2", user: "nugrad_cs", avatar: "N", item: "Korean BBQ Bowl", hall: "Allison", vote: "up", tag: null, review: null, time: "5m" },
  { id: "a3", user: "dillo_fan", avatar: "D", item: "Pepperoni Pizza", hall: "Elder", vote: "up", tag: "🍽️ Huge Portion", review: null, time: "8m" },
  { id: "a4", user: "lakefill_lurker", avatar: "L", item: "Vegan Burger", hall: "Elder", vote: "down", tag: "😑 Bland", review: "Zero flavor, needs seasoning badly.", time: "11m" },
  { id: "a5", user: "tech_wildcat", avatar: "T", item: "Grilled Salmon", hall: "Foster-Walker", vote: "up", tag: "🥦 Healthy", review: null, time: "14m" },
  { id: "a6", user: "sheridan_rd", avatar: "S", item: "Miso Ramen", hall: "Plex", vote: "up", tag: "🔥 Amazing!", review: "Best thing at Plex by miles.", time: "19m" },
];

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getNearbyHalls(lat, lng) {
  return DINING_HALLS.map(h => ({ ...h, distance: Math.round(haversineDistance(lat, lng, h.lat, h.lng)) })).sort((a, b) => a.distance - b.distance);
}

function ScoreBar({ upvotes, downvotes }) {
  const total = upvotes + downvotes;
  const pct = total === 0 ? 50 : Math.round((upvotes / total) * 100);
  const color = pct >= 80 ? "#4ECB71" : pct >= 55 ? "#FFD60A" : "#FF6B6B";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
      <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 800, color, fontFamily: "monospace", minWidth: 28 }}>{pct}%</span>
    </div>
  );
}

function Avatar({ letter, size, color }) {
  const s = size || 32;
  const c = color || "#4A9EFF";
  return (
    <div style={{ width: s, height: s, borderRadius: Math.round(s / 3), background: c + "22", border: "1.5px solid " + c + "44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: s * 0.42, fontWeight: 900, color: c, flexShrink: 0, fontFamily: "Syne, sans-serif" }}>
      {letter}
    </div>
  );
}

function ReviewCard({ review, onHelpful }) {
  const [helped, setHelped] = useState(false);
  const isPos = review.vote === "up";
  const col = isPos ? "#4ECB71" : "#FF6B6B";
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "14px 16px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.07)", animation: "fadeUp 0.3s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Avatar letter={review.avatar} size={32} color={col} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>@{review.user}</span>
            <span style={{ fontSize: 15 }}>{isPos ? "👍" : "👎"}</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>{review.time}</div>
        </div>
      </div>
      {review.tags && review.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {review.tags.map(function(tag) {
            const ip = POS_TAGS.includes(tag);
            return (
              <span key={tag} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: ip ? "rgba(78,203,113,0.12)" : "rgba(255,107,107,0.12)", color: ip ? "#4ECB71" : "#FF6B6B", fontWeight: 700, border: "1px solid " + (ip ? "rgba(78,203,113,0.2)" : "rgba(255,107,107,0.2)") }}>
                {tag}
              </span>
            );
          })}
        </div>
      )}
      {review.text && (
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, margin: "0 0 12px", fontStyle: "italic" }}>"{review.text}"</p>
      )}
      <button
        onClick={function() { if (!helped) { setHelped(true); onHelpful(review.id); } }}
        style={{ background: helped ? "rgba(74,158,255,0.12)" : "transparent", border: "1px solid " + (helped ? "rgba(74,158,255,0.3)" : "rgba(255,255,255,0.1)"), borderRadius: 99, padding: "5px 12px", cursor: helped ? "default" : "pointer", display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s", fontFamily: "Syne, sans-serif" }}
      >
        <span style={{ fontSize: 12 }}>👍</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: helped ? "#4A9EFF" : "rgba(255,255,255,0.3)" }}>Helpful · {review.helpful + (helped ? 1 : 0)}</span>
      </button>
    </div>
  );
}

function FoodCard({ item, onRate, onReviews, index }) {
  const topTag = Object.entries(item.tags).sort(function(a, b) { return b[1] - a[1]; })[0];
  const isPos = topTag && POS_TAGS.includes(topTag[0]);
  const total = item.upvotes + item.downvotes;
  const reviewsWithText = (item.reviews || []).filter(function(r) { return r.text; });
  const latestReview = reviewsWithText[0];
  const reviewCount = item.reviews ? item.reviews.length : 0;

  return (
    <div
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "16px 18px", marginBottom: 12, animation: "fadeUp 0.4s ease " + (index * 0.06) + "s both", backdropFilter: "blur(8px)", transition: "background 0.15s, border-color 0.15s" }}
      onMouseEnter={function(e) { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
      onMouseLeave={function(e) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
    >
      <div onClick={function() { onRate(item); }} style={{ cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{item.emoji}</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 15, color: "#fff", fontFamily: "Syne, sans-serif", lineHeight: 1.2 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{item.station} · {total} ratings</div>
              </div>
            </div>
            {topTag && (
              <div style={{ marginTop: 10 }}>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: isPos ? "rgba(78,203,113,0.15)" : "rgba(255,107,107,0.15)", color: isPos ? "#4ECB71" : "#FF6B6B", fontWeight: 700, border: "1px solid " + (isPos ? "rgba(78,203,113,0.3)" : "rgba(255,107,107,0.3)") }}>
                  {topTag[0]} · {topTag[1]}
                </span>
              </div>
            )}
            <ScoreBar upvotes={item.upvotes} downvotes={item.downvotes} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, marginLeft: 14, flexShrink: 0, paddingTop: 4 }}>
            <div style={{ fontSize: 16, color: "#4ECB71" }}>▲</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#4ECB71", fontFamily: "Syne, sans-serif" }}>{item.upvotes}</div>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "14px 0 12px" }} />

      {latestReview && (
        <div style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 12, borderLeft: "2.5px solid " + (latestReview.vote === "up" ? "rgba(78,203,113,0.5)" : "rgba(255,107,107,0.5)"), marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
            <Avatar letter={latestReview.avatar} size={20} color={latestReview.vote === "up" ? "#4ECB71" : "#FF6B6B"} />
            <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)" }}>@{latestReview.user}</span>
            <span style={{ fontSize: 13 }}>{latestReview.vote === "up" ? "👍" : "👎"}</span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{latestReview.time}</span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.55, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", fontStyle: "italic" }}>"{latestReview.text}"</p>
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={function() { onRate(item); }}
          style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.15s", fontFamily: "Syne, sans-serif" }}
          onMouseEnter={function(e) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={function(e) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
        >
          ✏️ Rate
        </button>
        <button
          onClick={function() { onReviews(item); }}
          style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.15s", fontFamily: "Syne, sans-serif" }}
          onMouseEnter={function(e) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={function(e) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
        >
          💬 {reviewCount > 0 ? reviewCount + " Review" + (reviewCount !== 1 ? "s" : "") : "Reviews"}
        </button>
      </div>
    </div>
  );
}

function ReviewsSheet({ item, hall, onClose, onStartRating, onHelpful }) {
  const hallObj = DINING_HALLS.find(function(h) { return h.id === hall; });
  const total = item.upvotes + item.downvotes;
  const pct = total === 0 ? 50 : Math.round((item.upvotes / total) * 100);
  const pctColor = pct >= 80 ? "#4ECB71" : pct >= 55 ? "#FFD60A" : "#FF6B6B";
  const topTags = Object.entries(item.tags).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "#0d0d1c", borderRadius: "28px 28px 0 0", maxHeight: "90vh", display: "flex", flexDirection: "column", animation: "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)", border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none" }}>
        <div style={{ padding: "16px 20px 0", flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 99, margin: "0 auto 18px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 50, height: 50, borderRadius: 15, background: (hallObj ? hallObj.color : "#4ECB71") + "20", border: "1.5px solid " + (hallObj ? hallObj.color : "#4ECB71") + "30", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{item.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 19, color: "#fff", fontFamily: "Syne, sans-serif" }}>{item.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{item.station} · {hallObj ? hallObj.name : ""}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 900, fontSize: 24, color: pctColor, fontFamily: "Syne, sans-serif", lineHeight: 1 }}>{pct}%</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{total} ratings</div>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {topTags.map(function(entry) {
              const tag = entry[0]; const count = entry[1];
              const ip = POS_TAGS.includes(tag);
              return (
                <span key={tag} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 99, background: ip ? "rgba(78,203,113,0.12)" : "rgba(255,107,107,0.12)", color: ip ? "#4ECB71" : "#FF6B6B", fontWeight: 700, border: "1px solid " + (ip ? "rgba(78,203,113,0.2)" : "rgba(255,107,107,0.2)") }}>
                  {tag} · {count}
                </span>
              );
            })}
          </div>
          <button
            onClick={onStartRating}
            style={{ width: "100%", padding: "13px 0", borderRadius: 14, border: "none", background: "linear-gradient(135deg, " + (hallObj ? hallObj.color : "#4ECB71") + ", " + (hallObj ? hallObj.color : "#4ECB71") + "bb)", color: "#fff", fontWeight: 900, fontSize: 14, cursor: "pointer", marginBottom: 16, fontFamily: "Syne, sans-serif", boxShadow: "0 6px 20px " + (hallObj ? hallObj.color : "#4ECB71") + "35" }}
          >
            ✏️ Rate & Write a Review
          </button>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 12 }}>
            {(item.reviews ? item.reviews.length : 0)} Student Reviews
          </div>
        </div>
        <div style={{ overflowY: "auto", padding: "0 20px 40px", flex: 1 }}>
          {(!item.reviews || item.reviews.length === 0) ? (
            <div style={{ textAlign: "center", padding: "36px 0", color: "rgba(255,255,255,0.2)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>No reviews yet</div>
              <div style={{ fontSize: 12, marginTop: 5, lineHeight: 1.5 }}>Be the first Wildcat to review this dish.</div>
            </div>
          ) : (
            item.reviews.map(function(r) { return <ReviewCard key={r.id} review={r} onHelpful={onHelpful} />; })
          )}
        </div>
      </div>
    </div>
  );
}

function RatingSheet({ item, hall, onClose, onSubmit }) {
  const [step, setStep] = useState("vote");
  const [vote, setVote] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const MAX_CHARS = 280;
  const hallObj = DINING_HALLS.find(function(h) { return h.id === hall; });
  const hallColor = hallObj ? hallObj.color : "#4ECB71";
  const textRef = useRef(null);

  useEffect(function() {
    if (step === "review" && textRef.current) { setTimeout(function() { if (textRef.current) textRef.current.focus(); }, 150); }
  }, [step]);

  function toggleTag(tag) { setSelectedTags(function(p) { return p.includes(tag) ? p.filter(function(t) { return t !== tag; }) : [...p, tag]; }); }

  function submitAll() {
    onSubmit(item.id, vote, selectedTags, reviewText.trim());
    setStep("done");
    setTimeout(onClose, 1800);
  }

  const stepIndex = ["vote", "tags", "review", "done"].indexOf(step);

  const VoteBtn = function(props) {
    const sel = vote === props.v;
    return (
      <button
        onClick={function() { setVote(props.v); }}
        style={{ flex: 1, padding: "22px 12px", borderRadius: 20, border: "2px solid " + (sel ? props.col : "rgba(255,255,255,0.1)"), background: sel ? props.col + "18" : "rgba(255,255,255,0.03)", cursor: "pointer", transition: "all 0.18s", transform: sel ? "scale(1.04)" : "", fontFamily: "Syne, sans-serif", boxShadow: sel ? "0 8px 24px " + props.col + "30" : "none" }}
      >
        <div style={{ fontSize: 36, marginBottom: 8 }}>{props.emoji}</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: sel ? props.col : "rgba(255,255,255,0.6)" }}>{props.label}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>{props.sub}</div>
      </button>
    );
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 210, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={step !== "done" ? onClose : undefined} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)" }} />
      <div style={{ position: "relative", background: "#0d0d1c", borderRadius: "28px 28px 0 0", padding: "20px 22px 50px", maxHeight: "94vh", overflowY: "auto", animation: "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)", border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none" }}>
        <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 99, margin: "0 auto 16px" }} />

        {step !== "done" && (
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {["vote", "tags", "review"].map(function(s, i) {
                return <div key={s} style={{ flex: 1, height: 3, borderRadius: 99, background: stepIndex > i ? hallColor : stepIndex === i ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />;
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {["1 · Vote", "2 · Tags", "3 · Review"].map(function(s, i) {
                return <span key={s} style={{ fontSize: 10, fontWeight: 700, color: stepIndex === i ? "#fff" : stepIndex > i ? hallColor : "rgba(255,255,255,0.2)", letterSpacing: 0.3 }}>{s}</span>;
              })}
            </div>
          </div>
        )}

        {step !== "done" && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: hallColor + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{item.emoji}</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, color: "#fff", fontFamily: "Syne, sans-serif" }}>{item.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                {step === "vote" && "Step 1 — How was it overall?"}
                {step === "tags" && "Step 2 — What stood out?"}
                {step === "review" && "Step 3 — Tell us more (optional)"}
              </div>
            </div>
          </div>
        )}

        {step === "vote" && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
              <VoteBtn v="up" emoji="👍" label="Love it" sub="Would eat again" col="#4ECB71" />
              <VoteBtn v="down" emoji="👎" label="Not great" sub="Needs work" col="#FF6B6B" />
            </div>
            <button
              onClick={function() { if (vote) setStep("tags"); }}
              disabled={!vote}
              style={{ width: "100%", padding: "15px 0", borderRadius: 14, border: "none", background: vote ? "linear-gradient(135deg, " + hallColor + ", " + hallColor + "bb)" : "rgba(255,255,255,0.07)", color: vote ? "#fff" : "rgba(255,255,255,0.2)", fontWeight: 900, fontSize: 15, cursor: vote ? "pointer" : "not-allowed", transition: "all 0.2s", fontFamily: "Syne, sans-serif", boxShadow: vote ? "0 8px 24px " + hallColor + "40" : "none" }}
            >
              Continue →
            </button>
          </div>
        )}

        {step === "tags" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 14 }}>Select all that apply</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 28 }}>
              {ALL_TAGS.map(function(tag) {
                const sel = selectedTags.includes(tag);
                const ip = POS_TAGS.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={function() { toggleTag(tag); }}
                    style={{ padding: "9px 14px", borderRadius: 99, border: "1.5px solid " + (sel ? (ip ? "#4ECB71" : "#FF6B6B") : "rgba(255,255,255,0.12)"), background: sel ? (ip ? "rgba(78,203,113,0.15)" : "rgba(255,107,107,0.15)") : "rgba(255,255,255,0.04)", color: sel ? (ip ? "#4ECB71" : "#FF6B6B") : "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s", fontFamily: "Syne, sans-serif", transform: sel ? "scale(1.05)" : "" }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={function() { setStep("vote"); }} style={{ padding: "14px 20px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Syne, sans-serif" }}>← Back</button>
              <button
                onClick={function() { setStep("review"); }}
                style={{ flex: 1, padding: "14px 0", borderRadius: 14, border: "none", background: "linear-gradient(135deg, " + hallColor + ", " + hallColor + "bb)", color: "#fff", fontWeight: 900, fontSize: 15, cursor: "pointer", fontFamily: "Syne, sans-serif", boxShadow: "0 8px 24px " + hallColor + "35" }}
              >
                {selectedTags.length === 0 ? "Skip →" : "Next → (" + selectedTags.length + " selected)"}
              </button>
            </div>
          </div>
        )}

        {step === "review" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 18 }}>
              <span style={{ padding: "5px 12px", borderRadius: 99, background: vote === "up" ? "rgba(78,203,113,0.12)" : "rgba(255,107,107,0.12)", color: vote === "up" ? "#4ECB71" : "#FF6B6B", fontSize: 12, fontWeight: 800, border: "1px solid " + (vote === "up" ? "rgba(78,203,113,0.25)" : "rgba(255,107,107,0.25)") }}>
                {vote === "up" ? "👍 Loved it" : "👎 Not great"}
              </span>
              {selectedTags.slice(0, 2).map(function(t) {
                return <span key={t} style={{ padding: "5px 10px", borderRadius: 99, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, border: "1px solid rgba(255,255,255,0.1)" }}>{t}</span>;
              })}
              {selectedTags.length > 2 && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>+{selectedTags.length - 2} more</span>}
            </div>

            <div style={{ position: "relative", marginBottom: 12 }}>
              <textarea
                ref={textRef}
                value={reviewText}
                onChange={function(e) { if (e.target.value.length <= MAX_CHARS) setReviewText(e.target.value); }}
                placeholder={vote === "up" ? "What made it great? Any tips for the next Wildcat?" : "What was off about it? Help Levi improve."}
                rows={5}
                style={{ width: "100%", padding: "14px 14px 36px", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 16, color: "#fff", fontSize: 14, lineHeight: 1.65, resize: "none", outline: "none", fontFamily: "Syne, sans-serif", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={function(e) { e.target.style.borderColor = hallColor; }}
                onBlur={function(e) { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
              <div style={{ position: "absolute", bottom: 12, right: 14, fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: reviewText.length > MAX_CHARS * 0.85 ? (reviewText.length === MAX_CHARS ? "#FF6B6B" : "#FFD60A") : "rgba(255,255,255,0.2)" }}>
                {reviewText.length}/{MAX_CHARS}
              </div>
            </div>

            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginBottom: 22, lineHeight: 1.6, display: "flex", gap: 6 }}>
              <span>🔒</span>
              <span>Your review posts with your username and is shared with Levi Restaurant Associates to help reduce food waste.</span>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={function() { setStep("tags"); }} style={{ padding: "14px 20px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Syne, sans-serif" }}>← Back</button>
              <button
                onClick={submitAll}
                style={{ flex: 1, padding: "14px 0", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #4ECB71, #1fa84a)", color: "#fff", fontWeight: 900, fontSize: 15, cursor: "pointer", fontFamily: "Syne, sans-serif", boxShadow: "0 8px 24px rgba(78,203,113,0.35)" }}
              >
                {reviewText.trim().length > 0 ? "📝 Post Review" : "Submit Rating Only"}
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center", padding: "28px 0 14px" }}>
            <div style={{ fontSize: 64, marginBottom: 16, display: "inline-block", animation: "pop 0.45s cubic-bezier(0.34,1.56,0.64,1)" }}>
              {reviewText.trim().length > 0 ? "🎉" : "✅"}
            </div>
            <div style={{ fontWeight: 900, fontSize: 24, color: "#fff", fontFamily: "Syne, sans-serif", marginBottom: 10 }}>
              {reviewText.trim().length > 0 ? "Review posted!" : "Rating saved!"}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 260, margin: "0 auto" }}>
              {reviewText.trim().length > 0
                ? "Your review helps fellow Wildcats and gives Levi real, actionable feedback."
                : "Your vote is counted and instantly visible in Levi's analytics."}
            </div>
            {selectedTags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", marginTop: 18 }}>
                {selectedTags.slice(0, 3).map(function(t) {
                  return <span key={t} style={{ padding: "5px 12px", borderRadius: 99, background: POS_TAGS.includes(t) ? "rgba(78,203,113,0.15)" : "rgba(255,107,107,0.15)", color: POS_TAGS.includes(t) ? "#4ECB71" : "#FF6B6B", fontSize: 12, fontWeight: 700 }}>{t}</span>;
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function GeoPromptBanner({ hall, onAccept, onDismiss }) {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 300, animation: "slideDown 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
      <div style={{ background: "#1a1a2e", borderRadius: "0 0 20px 20px", padding: "18px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderTop: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 14, background: hall.color + "20", border: "2px solid " + hall.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{hall.emoji}</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "Syne, sans-serif" }}>📍 You're near {hall.name}!</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 }}>{hall.distance}m away · {hall.isOpen ? "Open now" : "Currently closed"}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onAccept} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "none", background: hall.color, color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "Syne, sans-serif", boxShadow: "0 4px 14px " + hall.color + "55" }}>View {hall.name} Menu →</button>
          <button onClick={onDismiss} style={{ padding: "11px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Syne, sans-serif" }}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}

function AnalyticsDashboard({ menu }) {
  const allItems = Object.entries(menu).flatMap(function(entry) { return entry[1].map(function(i) { return Object.assign({}, i, { hallId: entry[0] }); }); });
  const totalRatings = allItems.reduce(function(s, i) { return s + i.upvotes + i.downvotes; }, 0);
  const totalReviews = allItems.reduce(function(s, i) { return s + (i.reviews ? i.reviews.filter(function(r) { return r.text; }).length : 0); }, 0);
  const topItems = allItems.slice().sort(function(a, b) { return b.upvotes - a.upvotes; }).slice(0, 5);
  const tagTotals = {};
  allItems.forEach(function(item) { Object.entries(item.tags).forEach(function(e) { tagTotals[e[0]] = (tagTotals[e[0]] || 0) + e[1]; }); });
  const topTags = Object.entries(tagTotals).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 6);
  const hallStats = DINING_HALLS.map(function(h) {
    const items = menu[h.id] || [];
    const ups = items.reduce(function(s, i) { return s + i.upvotes; }, 0);
    const total = items.reduce(function(s, i) { return s + i.upvotes + i.downvotes; }, 0);
    const revCount = items.reduce(function(s, i) { return s + (i.reviews ? i.reviews.filter(function(r) { return r.text; }).length : 0); }, 0);
    return Object.assign({}, h, { score: total === 0 ? 0 : Math.round((ups / total) * 100), ratingCount: total, reviewCount: revCount });
  }).sort(function(a, b) { return b.score - a.score; });
  const recentReviews = allItems.flatMap(function(i) { return (i.reviews || []).filter(function(r) { return r.text; }).map(function(r) { return Object.assign({}, r, { itemName: i.name, itemEmoji: i.emoji }); }); }).slice(0, 4);

  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Levi Insights</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", fontFamily: "Syne, sans-serif" }}>Analytics Dashboard</div>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {[[String(totalRatings), "Ratings", "↑ 23% this week"], [String(totalReviews), "Reviews", "With written text"], ["5", "Halls", "All tracked"]].map(function(item) {
          return (
            <div key={item[1]} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "14px 12px", flex: 1, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: "Syne, sans-serif" }}>{item[0]}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{item[1]}</div>
              <div style={{ fontSize: 10, color: "#4ECB71", marginTop: 4, fontWeight: 700 }}>{item[2]}</div>
            </div>
          );
        })}
      </div>
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "18px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 16, fontFamily: "Syne, sans-serif" }}>Hall Approval Ratings</div>
        {hallStats.map(function(h) {
          const col = h.score >= 80 ? "#4ECB71" : h.score >= 55 ? "#FFD60A" : "#FF6B6B";
          return (
            <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}>
              <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{h.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{h.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>💬 {h.reviewCount}</span>
                    <span style={{ fontSize: 12, fontWeight: 900, color: col, fontFamily: "Syne, sans-serif" }}>{h.score}%</span>
                  </div>
                </div>
                <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: h.score + "%", background: col, borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 3 }}>{h.ratingCount} ratings</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "18px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 14, fontFamily: "Syne, sans-serif" }}>🏆 Most Loved Items</div>
        {topItems.map(function(item, i) {
          const hall = DINING_HALLS.find(function(h) { return h.id === item.hallId; });
          const revCount = item.reviews ? item.reviews.filter(function(r) { return r.text; }).length : 0;
          return (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < topItems.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <span style={{ fontSize: 14, width: 22 }}>{["🥇","🥈","🥉"][i] || "#" + (i+1)}</span>
              <span>{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{hall ? hall.name : ""} · 💬 {revCount} reviews</div>
              </div>
              <div style={{ fontWeight: 900, fontSize: 13, color: "#4ECB71", fontFamily: "Syne, sans-serif" }}>👍 {item.upvotes}</div>
            </div>
          );
        })}
      </div>
      {recentReviews.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "18px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 14, fontFamily: "Syne, sans-serif" }}>💬 Latest Student Reviews</div>
          {recentReviews.map(function(r, i) {
            return (
              <div key={r.id} style={{ padding: "10px 0", borderBottom: i < recentReviews.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 15 }}>{r.itemEmoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{r.itemName}</span>
                  <span style={{ fontSize: 14 }}>{r.vote === "up" ? "👍" : "👎"}</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "0 0 4px", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", fontStyle: "italic" }}>"{r.text}"</p>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>@{r.user} · {r.time}</div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "18px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 14, fontFamily: "Syne, sans-serif" }}>🔖 Top Feedback Tags</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {topTags.map(function(entry) {
            const tag = entry[0]; const count = entry[1]; const ip = POS_TAGS.includes(tag);
            return <span key={tag} style={{ padding: "6px 12px", borderRadius: 99, background: ip ? "rgba(78,203,113,0.15)" : "rgba(255,107,107,0.15)", color: ip ? "#4ECB71" : "#FF6B6B", fontSize: 12, fontWeight: 700, border: "1px solid " + (ip ? "rgba(78,203,113,0.25)" : "rgba(255,107,107,0.25)") }}>{tag} <span style={{ opacity: 0.6 }}>{count}</span></span>;
          })}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, rgba(78,203,113,0.1), rgba(74,158,255,0.1))", borderRadius: 20, padding: "18px", border: "1px solid rgba(78,203,113,0.2)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#4ECB71", letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" }}>💡 Waste Reduction Insight</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>Items tagged <strong style={{ color: "#fff" }}>"Bland"</strong> have written reviews confirming flavor issues — students say Vegan Burger <em style={{ color: "rgba(255,255,255,0.8)" }}>"needs serious seasoning."</em> Recommend recipe adjustment before next service. Chocolate Lava Cake (98% approval) should be replicated at lower-rated halls.</div>
      </div>
    </div>
  );
}

function PhoneFrame({ children }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#050509",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
    }}>
      <div style={{
        width: "390px",
        minWidth: "390px",
        maxWidth: "390px",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 24px 80px rgba(0,0,0,0.7)",
      }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("feed");
  const [selectedHall, setSelectedHall] = useState("allison");
  const [menu, setMenu] = useState(SEED_MENU);
  const [activity, setActivity] = useState(SEED_ACTIVITY);
  const [ratingItem, setRatingItem] = useState(null);
  const [reviewsItem, setReviewsItem] = useState(null);
  const [sortBy, setSortBy] = useState("top");
  const [toast, setToast] = useState(null);
  const [geoState, setGeoState] = useState("idle");
  const [nearbyHall, setNearbyHall] = useState(null);
  const [geoPrompt, setGeoPrompt] = useState(null);
  const [dismissedPrompt, setDismissedPrompt] = useState(null);
  const watchRef = useRef(null);

  const showToast = useCallback(function(msg) { setToast(msg); setTimeout(function() { setToast(null); }, 2400); }, []);

  function handleGeoSuccess(pos) {
    var lat = pos.coords.latitude; var lng = pos.coords.longitude;
    setGeoState("granted");
    var halls = getNearbyHalls(lat, lng);
    var closest = halls[0];
    if (closest.distance <= closest.radius) {
      setNearbyHall(closest);
      if (closest.id !== dismissedPrompt) setGeoPrompt(closest);
    } else { setNearbyHall(null); setGeoPrompt(null); }
  }

  function requestGeo() {
    if (!navigator.geolocation) return showToast("Geolocation not supported");
    setGeoState("requesting");
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, function() { setGeoState("denied"); showToast("📍 Location denied — browse from anywhere!"); }, { enableHighAccuracy: true, timeout: 8000 });
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = navigator.geolocation.watchPosition(handleGeoSuccess, function() {}, { maximumAge: 30000 });
  }

  function simulateLocation(hallId) {
    var hall = DINING_HALLS.find(function(h) { return h.id === hallId; });
    handleGeoSuccess({ coords: { latitude: hall.lat + 0.0001, longitude: hall.lng + 0.0001 } });
    showToast("📍 Simulating near " + hall.name);
  }

  useEffect(function() { return function() { if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current); }; }, []);

  function handleSubmit(itemId, vote, tags, reviewText) {
    var hasReview = reviewText.trim().length > 0;
    var newReview = hasReview ? { id: "r_" + Date.now(), user: "you", avatar: "Y", vote: vote, tags: tags, text: reviewText.trim(), time: "just now", helpful: 0 } : null;
    var itemName = ""; var itemEmoji = "";
    for (var hid in menu) { var f = menu[hid].find(function(i) { return i.id === itemId; }); if (f) { itemName = f.name; itemEmoji = f.emoji; break; } }

    setMenu(function(prev) {
      var updated = {};
      for (var h in prev) {
        updated[h] = prev[h].map(function(item) {
          if (item.id !== itemId) return item;
          var newTags = Object.assign({}, item.tags);
          tags.forEach(function(t) { newTags[t] = (newTags[t] || 0) + 1; });
          return Object.assign({}, item, {
            upvotes: vote === "up" ? item.upvotes + 1 : item.upvotes,
            downvotes: vote === "down" ? item.downvotes + 1 : item.downvotes,
            tags: newTags,
            reviews: newReview ? [newReview].concat(item.reviews || []) : (item.reviews || [])
          });
        });
      }
      return updated;
    });

    var hallName = "";
    var hallObj = DINING_HALLS.find(function(h) { return h.id === selectedHall; });
    if (hallObj) hallName = hallObj.name;
    setActivity(function(prev) {
      return [{ id: "act_" + Date.now(), user: "you", avatar: "Y", item: itemName, hall: hallName, vote: vote, tag: tags[0] || null, review: reviewText.trim() || null, time: "just now" }].concat(prev);
    });
    showToast(hasReview ? "📝 Review posted!" : vote === "up" ? "👍 Upvoted!" : "👎 Feedback noted!");
  }

  function handleHelpful(reviewId) {
    setMenu(function(prev) {
      var updated = {};
      for (var h in prev) {
        updated[h] = prev[h].map(function(item) {
          return Object.assign({}, item, { reviews: (item.reviews || []).map(function(r) { return r.id === reviewId ? Object.assign({}, r, { helpful: r.helpful + 1 }) : r; }) });
        });
      }
      return updated;
    });
  }

  var hallItems = menu[selectedHall] || [];
  var sorted = hallItems.slice().sort(function(a, b) {
    if (sortBy === "top") return b.upvotes - a.upvotes;
    if (sortBy === "new") return b.id - a.id;
    return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
  });
  var currentHall = DINING_HALLS.find(function(h) { return h.id === selectedHall; });
  var liveReviewsItem = reviewsItem ? Object.values(menu).flat().find(function(i) { return i.id === reviewsItem.id; }) || reviewsItem : null;

  return (
    <PhoneFrame>
    <div style={{ fontFamily: "Syne, sans-serif", width: "100%", minHeight: "100vh", background: "#0a0a14", position: "relative", display: "flex", flexDirection: "column", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { background: #050509; min-height: 100vh; }
        ::-webkit-scrollbar { display: none; }
        @keyframes slideUp { from { transform: translateY(100%); opacity:0 } to { transform: translateY(0); opacity:1 } }
        @keyframes slideDown { from { transform: translateY(-100%); opacity:0 } to { transform: translateY(0); opacity:1 } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        textarea::placeholder { color: rgba(255,255,255,0.2); }
        textarea { caret-color: #4ECB71; }
      `}</style>

      {geoPrompt && (
        <GeoPromptBanner
          hall={geoPrompt}
          onAccept={function() { setSelectedHall(geoPrompt.id); setTab("feed"); setGeoPrompt(null); showToast("Switched to " + geoPrompt.name + " 🍽️"); }}
          onDismiss={function() { setDismissedPrompt(geoPrompt.id); setGeoPrompt(null); }}
        />
      )}

      {toast && (
        <div style={{ position: "absolute", top: 68, left: "50%", transform: "translateX(-50%)", background: "rgba(20,20,35,0.95)", backdropFilter: "blur(16px)", color: "#fff", padding: "10px 20px", borderRadius: 99, fontSize: 13, fontWeight: 700, zIndex: 400, border: "1px solid rgba(255,255,255,0.12)", animation: "fadeIn 0.2s ease", whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
          {toast}
        </div>
      )}

      <div style={{ background: "rgba(10,10,20,0.97)", backdropFilter: "blur(16px)", padding: "16px 18px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 11, background: "linear-gradient(135deg, #4ECB71, #4A9EFF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🍱</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: "-0.5px", lineHeight: 1 }}>DormDash</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: 0.5 }}>NORTHWESTERN DINING</div>
            </div>
          </div>
          {geoState === "requesting" && <div style={{ width: 8, height: 8, borderRadius: 99, background: "#FFD60A", animation: "pulse 1s infinite" }} />}
          {geoState === "granted" && nearbyHall && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(78,203,113,0.08)", border: "1px solid rgba(78,203,113,0.22)", borderRadius: 99, padding: "4px 10px" }}>
              <div style={{ width: 6, height: 6, borderRadius: 99, background: "#4ECB71" }} />
              <span style={{ fontSize: 11, color: "#4ECB71", fontWeight: 700 }}>Near {nearbyHall.name}</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex" }}>
          {[["feed", "🍽️ Menu"], ["activity", "⚡ Live"], ["analytics", "📊 Insights"]].map(function(item) {
            return (
              <button key={item[0]} onClick={function() { setTab(item[0]); }} style={{ flex: 1, padding: "10px 0", border: "none", background: "none", cursor: "pointer", fontSize: 12, fontWeight: tab === item[0] ? 800 : 600, color: tab === item[0] ? "#4ECB71" : "rgba(255,255,255,0.3)", borderBottom: "2px solid " + (tab === item[0] ? "#4ECB71" : "transparent"), transition: "all 0.2s", fontFamily: "Syne, sans-serif" }}>
                {item[1]}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "feed" && (
          <div style={{ padding: "16px 16px 120px" }}>
            <button
              onClick={requestGeo}
              style={{ width: "100%", padding: "10px 14px", background: geoState === "granted" ? "rgba(78,203,113,0.07)" : "rgba(255,255,255,0.03)", border: "1px solid " + (geoState === "granted" ? "rgba(78,203,113,0.22)" : "rgba(255,255,255,0.07)"), borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontFamily: "Syne, sans-serif", transition: "all 0.15s" }}
            >
              <span style={{ fontSize: 14 }}>{geoState === "granted" ? "📍" : geoState === "denied" ? "🚫" : "🔍"}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: geoState === "granted" ? "#4ECB71" : "rgba(255,255,255,0.38)", flex: 1, textAlign: "left" }}>
                {geoState === "granted" && nearbyHall ? "Near " + nearbyHall.name + " (" + nearbyHall.distance + "m)" : geoState === "granted" ? "Location active · Browse from anywhere" : geoState === "denied" ? "Location denied · Tap to retry" : "Enable location for live menu suggestions"}
              </span>
              {geoState !== "granted" && <span style={{ fontSize: 11, color: "#4A9EFF", fontWeight: 700 }}>Enable →</span>}
            </button>

            {geoState !== "granted" && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Demo: simulate location</div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                  {DINING_HALLS.slice(0, 3).map(function(h) {
                    return <button key={h.id} onClick={function() { simulateLocation(h.id); }} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 99, border: "1px solid " + h.color + "40", background: h.color + "15", color: h.color, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif" }}>📍 {h.name}</button>;
                  })}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14, paddingBottom: 4 }}>
              {DINING_HALLS.map(function(hall) {
                var sel = selectedHall === hall.id;
                var isNearby = nearbyHall && nearbyHall.id === hall.id;
                return (
                  <button key={hall.id} onClick={function() { setSelectedHall(hall.id); }} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 14, border: "1.5px solid " + (sel ? hall.color : "rgba(255,255,255,0.1)"), background: sel ? hall.color + "18" : "rgba(255,255,255,0.04)", cursor: "pointer", transition: "all 0.15s", fontFamily: "Syne, sans-serif", position: "relative" }}>
                    {isNearby && <div style={{ position: "absolute", top: -4, right: -4, width: 10, height: 10, borderRadius: 99, background: "#4ECB71", border: "2px solid #0a0a14" }} />}
                    <div style={{ fontSize: 18 }}>{hall.emoji}</div>
                    <div style={{ fontSize: 10, fontWeight: sel ? 800 : 600, color: sel ? hall.color : "rgba(255,255,255,0.4)", marginTop: 3, whiteSpace: "nowrap" }}>{hall.name}</div>
                    <div style={{ fontSize: 9, color: hall.isOpen ? "#4ECB71" : "rgba(255,255,255,0.25)", fontWeight: 600, marginTop: 1 }}>{hall.isOpen ? "Open" : "Closed"}</div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 18 }}>{currentHall ? currentHall.emoji : ""}</span>
                <span style={{ fontWeight: 900, fontSize: 16, marginLeft: 8, color: "#fff" }}>{currentHall ? currentHall.name : ""}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginLeft: 8 }}>· {currentHall ? currentHall.hours : ""}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[["top", "🔥"], ["new", "✨"], ["best", "⭐"]].map(function(item) {
                  return <button key={item[0]} onClick={function() { setSortBy(item[0]); }} style={{ padding: "5px 10px", borderRadius: 99, border: "1px solid", borderColor: sortBy === item[0] ? "#4ECB71" : "rgba(255,255,255,0.1)", background: sortBy === item[0] ? "rgba(78,203,113,0.15)" : "transparent", color: sortBy === item[0] ? "#4ECB71" : "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif" }}>{item[1]} {item[0]}</button>;
                })}
              </div>
            </div>

            {sorted.map(function(item, i) {
              return <FoodCard key={item.id} item={item} onRate={setRatingItem} onReviews={setReviewsItem} index={i} />;
            })}
          </div>
        )}

        {tab === "activity" && (
          <div style={{ padding: "16px 16px 100px" }}>
            <div style={{ fontWeight: 900, fontSize: 20, color: "#fff", marginBottom: 6 }}>Live Activity</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 18 }}>What Wildcats are rating right now</div>
            {activity.map(function(evt, i) {
              return (
                <div key={evt.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "14px 16px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 12, alignItems: "flex-start", animation: "fadeUp 0.3s ease " + Math.min(i, 5) * 0.07 + "s both" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: evt.vote === "up" ? "rgba(78,203,113,0.15)" : "rgba(255,107,107,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {evt.vote === "up" ? "👍" : "👎"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 800, color: "#fff" }}>@{evt.user}</span>{" "}
                      <span style={{ color: evt.vote === "up" ? "#4ECB71" : "#FF6B6B", fontWeight: 700 }}>{evt.vote === "up" ? "loved" : "didn't like"}</span>{" "}
                      <span style={{ fontWeight: 800, color: "#4A9EFF" }}>{evt.item}</span>{" "}
                      at <span style={{ fontWeight: 600 }}>{evt.hall}</span>
                    </div>
                    {evt.tag && (
                      <span style={{ display: "inline-block", marginTop: 5, fontSize: 11, padding: "3px 10px", borderRadius: 99, background: POS_TAGS.includes(evt.tag) ? "rgba(78,203,113,0.15)" : "rgba(255,107,107,0.15)", color: POS_TAGS.includes(evt.tag) ? "#4ECB71" : "#FF6B6B", fontWeight: 700, border: "1px solid " + (POS_TAGS.includes(evt.tag) ? "rgba(78,203,113,0.2)" : "rgba(255,107,107,0.2)") }}>
                        {evt.tag}
                      </span>
                    )}
                    {evt.review && (
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "6px 0 0", lineHeight: 1.5, fontStyle: "italic" }}>"{evt.review}"</p>
                    )}
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 5 }}>{evt.time} ago</div>
                  </div>
                </div>
              );
            })}
            <div style={{ textAlign: "center", padding: "24px 0", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>All caught up · Check back at meal time 🍽️</div>
          </div>
        )}

        {tab === "analytics" && (
          <div style={{ padding: "16px 0 0" }}>
            <AnalyticsDashboard menu={menu} />
          </div>
        )}
      </div>

      <div style={{ position: "sticky", bottom: 0, width: "100%", background: "rgba(10,10,20,0.96)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "10px 20px 24px", display: "flex", justifyContent: "space-around", zIndex: 50 }}>
        {[["feed", "🍽️", "Menu"], ["activity", "⚡", "Live"], ["analytics", "📊", "Insights"]].map(function(item) {
          return (
            <button key={item[0]} onClick={function() { setTab(item[0]); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", color: tab === item[0] ? "#4ECB71" : "rgba(255,255,255,0.3)", fontFamily: "Syne, sans-serif", transition: "color 0.2s" }}>
              <span style={{ fontSize: 22 }}>{item[1]}</span>
              <span style={{ fontSize: 10, fontWeight: tab === item[0] ? 800 : 600 }}>{item[2]}</span>
            </button>
          );
        })}
      </div>

      {liveReviewsItem && !ratingItem && (
        <ReviewsSheet
          item={liveReviewsItem}
          hall={selectedHall}
          onClose={function() { setReviewsItem(null); }}
          onStartRating={function() { setRatingItem(liveReviewsItem); setReviewsItem(null); }}
          onHelpful={handleHelpful}
        />
      )}

      {ratingItem && (
        <RatingSheet
          item={ratingItem}
          hall={selectedHall}
          onClose={function() { setRatingItem(null); }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
    </PhoneFrame>
  );
}
