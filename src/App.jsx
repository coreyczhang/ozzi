import { useState, useEffect, useCallback, useRef } from "react";

const DINING_HALLS = [
 { id: "allison", name: "Allison", subtitle: "South Campus", emoji: "", lat: 42.0510, lng: -87.6737, hours: "7am – 9pm", isOpen: true, radius: 120, color: "#FF6B6B" },
 { id: "sargent", name: "Sargent", subtitle: "North Campus", emoji: "", lat: 42.0573, lng: -87.6751, hours: "7:30am – 8pm", isOpen: true, radius: 120, color: "#4ECB71" },
 { id: "elder", name: "Elder", subtitle: "North Campus", emoji: "", lat: 42.0589, lng: -87.6748, hours: "7am – 10pm", isOpen: true, radius: 100, color: "#4A9EFF" },
 { id: "plexeast", name: "Plex East", subtitle: "Mid Campus", emoji: "", lat: 42.0547, lng: -87.6756, hours: "7am – 10pm", isOpen: true, radius: 100, color: "#FF9500" },
 { id: "plexwest", name: "Plex West", subtitle: "Mid Campus", emoji: "", lat: 42.0545, lng: -87.6759, hours: "7am – 9pm", isOpen: true, radius: 100, color: "#BF5AF2" },
];

const ALL_TAGS = ["Amazing", "Huge Portion", "Healthy", "Too Salty", "Too Spicy", "Bland", "Too Sweet", "Overcooked", "Undercooked", "Small Portion"];
const POS_TAGS = ["Amazing", "Huge Portion", "Healthy"];

const SEED_MENU = {
 allison: [
 { id: 1, name: "Truffle Mac & Cheese", station: "Comfort", emoji: "", upvotes: 142, downvotes: 12, tags: { "Amazing": 89, "Huge Portion": 44, "Too Salty": 8 }, reviews: [
 { id: "r1", user: "wildcat_2027", avatar: "W", vote: "up", tags: ["Amazing"], text: "Honestly the best thing in Allison. Truffle flavor is subtle but so good. Get it while it's hot!", time: "2h ago", helpful: 14 },
 { id: "r2", user: "lakefill_lurker", avatar: "L", vote: "up", tags: ["Huge Portion", "Too Salty"], text: "Portions are massive — could barely finish. A tiny bit salty for me but overall a total banger.", time: "5h ago", helpful: 8 },
 ]},
 { id: 2, name: "Korean BBQ Bowl", station: "Global", emoji: "", upvotes: 98, downvotes: 6, tags: { "Amazing": 61, "Healthy": 29, "Too Spicy": 4 }, reviews: [
 { id: "r3", user: "nugrad_cs", avatar: "N", vote: "up", tags: ["Amazing"], text: "Legitimately surprised how good this was. Rice was perfectly cooked and the sauce slaps.", time: "1h ago", helpful: 22 },
 ]},
 { id: 3, name: "Spinach Omelette", station: "Breakfast", emoji: "", upvotes: 44, downvotes: 19, tags: { "Bland": 18, "Healthy": 22 }, reviews: [] },
 { id: 4, name: "Chicken Tikka Masala", station: "Global", emoji: "", upvotes: 87, downvotes: 14, tags: { "Too Spicy": 23, "Amazing": 51 }, reviews: [
 { id: "r4", user: "sheridan_rd", avatar: "S", vote: "down", tags: ["Too Spicy"], text: "Too spicy for me personally, but if you like heat you'd love it. The sauce base tastes great.", time: "3h ago", helpful: 5 },
 ]},
 { id: 5, name: "Caesar Salad", station: "Salad Bar", emoji: "", upvotes: 35, downvotes: 8, tags: { "Bland": 6, "Healthy": 25 }, reviews: [] },
 { id: 6, name: "Banana Foster Pancakes", station: "Breakfast", emoji: "", upvotes: 71, downvotes: 3, tags: { "Amazing": 58, "Too Sweet": 10 }, reviews: [
 { id: "r5", user: "dillo_fan", avatar: "D", vote: "up", tags: ["Amazing"], text: "These are DANGEROUS. I showed up at 8am just for these. The caramelized banana topping is elite.", time: "6h ago", helpful: 31 },
 ]},
 ],
 elder: [
 { id: 7, name: "Pepperoni Pizza", station: "Pizza", emoji: "", upvotes: 201, downvotes: 18, tags: { "Amazing": 130, "Too Salty": 15 }, reviews: [
 { id: "r6", user: "tech_wildcat", avatar: "T", vote: "up", tags: ["Amazing"], text: "Elder pizza hits different at 11pm. Crispy crust, generous toppings. A NU institution.", time: "30m ago", helpful: 44 },
 ]},
 { id: 8, name: "Vegan Burger", station: "Grill", emoji: "", upvotes: 56, downvotes: 31, tags: { "Bland": 28, "Healthy": 19 }, reviews: [
 { id: "r7", user: "wildcat_2027", avatar: "W", vote: "down", tags: ["Bland"], text: "I really wanted to like this but it needs serious seasoning. Texture is fine but zero flavor.", time: "4h ago", helpful: 17 },
 ]},
 { id: 9, name: "Sweet Potato Soup", station: "Soup", emoji: "", upvotes: 73, downvotes: 4, tags: { "Amazing": 40, "Healthy": 30 }, reviews: [] },
 { id: 10, name: "BBQ Ribs", station: "Grill", emoji: "", upvotes: 115, downvotes: 9, tags: { "Amazing": 88, "Huge Portion": 22 }, reviews: [] },
 ],
 plex: [
 { id: 11, name: "Beef Tacos", station: "Mexican", emoji: "", upvotes: 119, downvotes: 9, tags: { "Amazing": 80, "Too Spicy": 12 }, reviews: [] },
 { id: 12, name: "Pasta Primavera", station: "Pasta", emoji: "", upvotes: 48, downvotes: 21, tags: { "Bland": 19, "Overcooked": 8 }, reviews: [] },
 { id: 13, name: "Miso Ramen", station: "Asian", emoji: "", upvotes: 134, downvotes: 7, tags: { "Amazing": 99, "Too Salty": 11 }, reviews: [
 { id: "r8", user: "nugrad_cs", avatar: "N", vote: "up", tags: ["Amazing"], text: "Best thing at Plex by miles. Broth is rich, noodles al dente. I come here just for this.", time: "1h ago", helpful: 29 },
 ]},
 ],
 sargent: [
 { id: 14, name: "Rotisserie Chicken", station: "Homestyle", emoji: "", upvotes: 134, downvotes: 8, tags: { "Amazing": 90, "Huge Portion": 38 }, reviews: [
 { id: "r9", user: "sarge_regular", avatar: "S", vote: "up", tags: ["Amazing"], text: "Sarge rotisserie chicken is undefeated. Perfectly seasoned every time.", time: "1h ago", helpful: 27 },
 ]},
 { id: 15, name: "S'mores Bar", station: "Dessert", emoji: "", upvotes: 201, downvotes: 4, tags: { "Amazing": 175, "Too Sweet": 18 }, reviews: [
 { id: "r10", user: "dillo_fan", avatar: "D", vote: "up", tags: ["Amazing"], text: "These are dangerous. The graham cracker base is perfect. Don't skip dessert at Sarge.", time: "45m ago", helpful: 52 },
 ]},
 { id: 16, name: "Made-to-Order Omelette", station: "Breakfast", emoji: "", upvotes: 88, downvotes: 6, tags: { "Amazing": 55, "Healthy": 28 }, reviews: [] },
 { id: 17, name: "Avocado Toast", station: "Breakfast", emoji: "", upvotes: 71, downvotes: 14, tags: { "Healthy": 50, "Small Portion": 22 }, reviews: [] },
 ],
 plexeast: [
 { id: 18, name: "Build-Your-Own Stir Fry", station: "Pure Eats", emoji: "", upvotes: 156, downvotes: 9, tags: { "Amazing": 110, "Healthy": 42 }, reviews: [
 { id: "r11", user: "allergy_wildcat", avatar: "A", vote: "up", tags: ["Amazing", "Healthy"], text: "As someone with allergies, Plex East is a lifesaver. The stir fry is genuinely delicious, not just 'safe'.", time: "2h ago", helpful: 38 },
 ]},
 { id: 19, name: "Tacos", station: "Pure Eats", emoji: "", upvotes: 122, downvotes: 11, tags: { "Amazing": 88, "Too Spicy": 14 }, reviews: [] },
 { id: 20, name: "Kosher Station", station: "Kosher", emoji: "", upvotes: 67, downvotes: 5, tags: { "Amazing": 45, "Healthy": 18 }, reviews: [] },
 ],
 plexwest: [
 { id: 21, name: "Grilled Salmon", station: "Grill", emoji: "", upvotes: 92, downvotes: 7, tags: { "Amazing": 60, "Healthy": 28 }, reviews: [] },
 { id: 22, name: "Pasta Bar", station: "Pasta", emoji: "", upvotes: 74, downvotes: 18, tags: { "Huge Portion": 40, "Bland": 22 }, reviews: [] },
 { id: 23, name: "Chocolate Lava Cake", station: "Dessert", emoji: "", upvotes: 188, downvotes: 5, tags: { "Amazing": 160, "Huge Portion": 20 }, reviews: [] },
 ],
};

const SEED_ACTIVITY = [
 { id: "a1", user: "wildcat_2027", avatar: "W", item: "Truffle Mac & Cheese", hall: "Allison", vote: "up", tag: "Amazing", review: "Honestly the best thing in Allison.", time: "2m" },
 { id: "a2", user: "nugrad_cs", avatar: "N", item: "Korean BBQ Bowl", hall: "Allison", vote: "up", tag: null, review: null, time: "5m" },
 { id: "a3", user: "dillo_fan", avatar: "D", item: "Pepperoni Pizza", hall: "Elder", vote: "up", tag: "Huge Portion", review: null, time: "8m" },
 { id: "a4", user: "lakefill_lurker", avatar: "L", item: "Vegan Burger", hall: "Elder", vote: "down", tag: "Bland", review: "Zero flavor, needs seasoning badly.", time: "11m" },
 { id: "a5", user: "tech_wildcat", avatar: "T", item: "Rotisserie Chicken", hall: "Sargent", vote: "up", tag: "Amazing", review: null, time: "14m" },
 { id: "a6", user: "sheridan_rd", avatar: "S", item: "Miso Ramen", hall: "Plex", vote: "up", tag: "Amazing", review: "Best thing at Plex by miles.", time: "19m" },
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
 <div style={{ height: "100%", width: pct + "%", background: color, borderRadius: 99, transition: "width 0.5s ease" }} /></div>
 <span style={{ fontSize: 11, fontWeight: 800, color, fontFamily: "monospace", minWidth: 28 }}>{pct}%</span></div>
 );
}

function Avatar({ letter, size, color }) {
 const s = size || 32;
 const c = color || "#4A9EFF";
 return (
 <div style={{ width: s, height: s, borderRadius: Math.round(s / 3), background: c + "22", border: "1.5px solid " + c + "44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: s * 0.42, fontWeight: 900, color: c, flexShrink: 0, fontFamily: "Inter, sans-serif" }}>
 {letter}
 </div>
 );
}

function ReviewCard({ review, onHelpful }) {
 const [helped, setHelped] = useState(false);
 const isPos = review.vote === "up";
 const col = isPos ? "#4ECB71" : "#FF6B6B";
 return (
 <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "12px 14px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.07)", animation: "fadeUp 0.3s ease both" }}>
 <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
 <Avatar letter={review.avatar} size={32} color={col} />
 <div style={{ flex: 1 }}>
 <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
 <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>@{review.user}</span>
 <span style={{ fontSize: 15 }}>{isPos ? "👍" : "👎"}</span></div>
 <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>{review.time}</div></div></div>
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
 style={{ background: helped ? "rgba(74,158,255,0.12)" : "transparent", border: "1px solid " + (helped ? "rgba(74,158,255,0.3)" : "rgba(255,255,255,0.1)"), borderRadius: 99, padding: "5px 12px", cursor: helped ? "default" : "pointer", display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s", fontFamily: "Inter, sans-serif" }}
 >
 <span style={{ fontSize: 12 }}></span>
 <span style={{ fontSize: 11, fontWeight: 700, color: helped ? "#4A9EFF" : "rgba(255,255,255,0.3)" }}>Helpful · {review.helpful + (helped ? 1 : 0)}</span></button></div>
 );
}

// ── REDDIT-STYLE FOOD CARD with inline vote + expandable reviews ──────────────

function ReviewRow({ review, onHelpful }) {
 const [helped, setHelped] = useState(false);
 const isPos = review.vote === "up";
 const col = isPos ? "#4ECB71" : "#FF6B6B";
 return (
 <div style={{ paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
 <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
 {/* Vote badge */}
 <div style={{ width: 28, height: 28, borderRadius: 8, background: col + "18", border: "1px solid " + col + "30", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginTop: 1 }}>
 {isPos ? "👍" : "👎"}
 </div>
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
 <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.55)" }}>@{review.user}</span>
 {review.tags && review.tags.slice(0,2).map(function(t) {
 const ip = POS_TAGS.includes(t);
 return <span key={t} style={{ fontSize: 10, padding: "1px 7px", borderRadius: 99, background: ip ? "rgba(78,203,113,0.12)" : "rgba(255,107,107,0.12)", color: ip ? "#4ECB71" : "#FF6B6B", fontWeight: 700 }}>{t}</span>;
 })}
 <span style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", marginLeft: "auto" }}>{review.time}</span></div>
 {review.text && (
 <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.55, margin: "0 0 6px", fontStyle: "italic", maxWidth: 260 }}>"{review.text}"</p>
 )}
 <button
 onClick={function() { if (!helped) { setHelped(true); onHelpful(review.id); } }}
 style={{ background: "none", border: "none", cursor: helped ? "default" : "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0, fontFamily: "Inter, sans-serif" }}
 >
 <span style={{ fontSize: 11, color: helped ? "#4A9EFF" : "rgba(255,255,255,0.2)", fontWeight: 700 }}>Helpful · {review.helpful + (helped ? 1 : 0)}</span></button></div></div></div>
 );
}

function FoodCard({ item, hall, onSubmit, onHelpful, index }) {
 const [myVote, setMyVote] = useState(null); // null | "up" | "down"
 const [showReviews, setShowReviews] = useState(false);
 const [showWriteReview, setShowWriteReview] = useState(false);
 const [reviewText, setReviewText] = useState("");
 const [selectedTags, setSelectedTags] = useState([]);
 const [submitted, setSubmitted] = useState(false);
 const MAX_CHARS = 240;
 const textRef = useRef(null);

 const hallObj = DINING_HALLS.find(function(h) { return h.id === hall; });
 const hallColor = hallObj ? hallObj.color : "#4ECB71";

 const topTag = Object.entries(item.tags).sort(function(a, b) { return b[1] - a[1]; })[0];
 const isPos = topTag && POS_TAGS.includes(topTag[0]);
 const total = item.upvotes + item.downvotes + (myVote ? 1 : 0);
 const upvotes = item.upvotes + (myVote === "up" ? 1 : 0);
 const downvotes = item.downvotes + (myVote === "down" ? 1 : 0);
 const pct = total === 0 ? 50 : Math.round((upvotes / total) * 100);
 const pctColor = pct >= 80 ? "#4ECB71" : pct >= 55 ? "#FFD60A" : "#FF6B6B";
 const reviewCount = item.reviews ? item.reviews.length : 0;

 function castVote(v) {
 setMyVote(v);
 onSubmit(item.id, v, [], ""); // instant, no tags/review
 }

 function toggleTag(t) { setSelectedTags(function(p) { return p.includes(t) ? p.filter(function(x) { return x !== t; }) : [...p, t]; }); }

 function postReview() {
 if (!reviewText.trim()) return;
 onSubmit(item.id, myVote || "up", selectedTags, reviewText.trim());
 setSubmitted(true);
 setShowWriteReview(false);
 setReviewText("");
 setSelectedTags([]);
 setTimeout(function() { setSubmitted(false); }, 2000);
 }

 useEffect(function() {
 if (showWriteReview && textRef.current) setTimeout(function() { if (textRef.current) textRef.current.focus(); }, 80);
 }, [showWriteReview]);

 return (
 <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "12px 14px", marginBottom: 10, animation: "fadeUp 0.4s ease " + (index * 0.05) + "s both", transition: "border-color 0.15s" }}>

 {/* ── TOP ROW: emoji + name + VOTE BUTTONS ── */}
 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
 {/* Food emoji */}
 <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}></div>

 {/* Name + station */}
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ fontWeight: 900, fontSize: 14, color: "#fff", fontFamily: "Inter, sans-serif", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>{item.name}</div>
 <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{item.station}</div></div>

 {/* ── VOTE BUTTONS — Reddit style ── */}
 <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
 <button
 onClick={function() { castVote("up"); }}
 style={{ width: 36, height: 36, borderRadius: 10, border: "1.5px solid " + (myVote === "up" ? "#4ECB71" : "rgba(255,255,255,0.1)"), background: myVote === "up" ? "rgba(78,203,113,0.18)" : "rgba(255,255,255,0.04)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all 0.15s", transform: myVote === "up" ? "scale(1.1)" : "" }}
 >👍</button>
 <div style={{ fontSize: 13, fontWeight: 900, color: pctColor, fontFamily: "Inter, sans-serif", minWidth: 28, textAlign: "center" }}>{pct}%</div>
 <button
 onClick={function() { castVote("down"); }}
 style={{ width: 36, height: 36, borderRadius: 10, border: "1.5px solid " + (myVote === "down" ? "#FF6B6B" : "rgba(255,255,255,0.1)"), background: myVote === "down" ? "rgba(255,107,107,0.18)" : "rgba(255,255,255,0.04)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all 0.15s", transform: myVote === "down" ? "scale(1.1)" : "" }}
 >👎</button></div></div>

 {/* ── TOP TAG + SCORE BAR ── */}
 <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
 {topTag && (
 <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: isPos ? "rgba(78,203,113,0.12)" : "rgba(255,107,107,0.12)", color: isPos ? "#4ECB71" : "#FF6B6B", fontWeight: 700, border: "1px solid " + (isPos ? "rgba(78,203,113,0.2)" : "rgba(255,107,107,0.2)"), whiteSpace: "nowrap" }}>
 {topTag[0]} · {topTag[1]}
 </span>
 )}
 <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
 <div style={{ height: "100%", width: pct + "%", background: pctColor, borderRadius: 99, transition: "width 0.4s ease" }} /></div>
 <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>{total} votes</span></div>

 {/* ── BOTTOM ACTION ROW ── */}
 <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
 {/* Vote confirmed badge */}
 
 {submitted && <span style={{ fontSize: 11, color: "#4ECB71", fontWeight: 700 }}> Review posted!</span>}

 <div style={{ flex: 1 }} />

 {/* Reviews toggle */}
 <button
 onClick={function() { setShowReviews(function(p) { return !p; }); setShowWriteReview(false); }}
 style={{ display: "flex", alignItems: "center", gap: 5, background: showReviews ? "rgba(74,158,255,0.12)" : "transparent", border: "1px solid " + (showReviews ? "rgba(74,158,255,0.25)" : "rgba(255,255,255,0.08)"), borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.15s" }}
 >
 <span style={{ fontSize: 12 }}></span>
 <span style={{ fontSize: 11, fontWeight: 700, color: showReviews ? "#4A9EFF" : "rgba(255,255,255,0.4)" }}>
 {reviewCount > 0 ? reviewCount + " review" + (reviewCount !== 1 ? "s" : "") : "Reviews"}
 </span>
 <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{showReviews ? "^" : "v"}</span></button>

 {/* Write review */}
 <button
 onClick={function() { setShowWriteReview(function(p) { return !p; }); setShowReviews(false); }}
 style={{ display: "flex", alignItems: "center", gap: 5, background: showWriteReview ? hallColor + "18" : "transparent", border: "1px solid " + (showWriteReview ? hallColor + "40" : "rgba(255,255,255,0.08)"), borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.15s" }}
 >
 <span style={{ fontSize: 11 }}></span>
 <span style={{ fontSize: 11, fontWeight: 700, color: showWriteReview ? hallColor : "rgba(255,255,255,0.4)" }}>Review</span></button></div>

 {/* ── INLINE REVIEWS ── */}
 {showReviews && (
 <div style={{ marginTop: 12, animation: "fadeUp 0.2s ease" }}>
 {(!item.reviews || item.reviews.length === 0) ? (
 <div style={{ textAlign: "center", padding: "16px 0", color: "rgba(255,255,255,0.2)", fontSize: 12 }}>No reviews yet — be the first </div>
 ) : (
 <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
 {item.reviews.map(function(r) { return <ReviewRow key={r.id} review={r} onHelpful={onHelpful} />; })}
 </div>
 )}
 </div>
 )}

 {/* ── INLINE WRITE REVIEW ── */}
 {showWriteReview && (
 <div style={{ marginTop: 12, animation: "fadeUp 0.2s ease" }}>
 <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 12 }} />
 {/* Quick vote if not voted yet */}
 {!myVote && (
 <div style={{ marginBottom: 10 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: 0.5, marginBottom: 6 }}>YOUR VOTE</div>
 <div style={{ display: "flex", gap: 6 }}>
 {[["up","^ Good","#4ECB71"],["down","v Bad","#FF6B6B"]].map(function(arr) {
 const v=arr[0],label=arr[1],col=arr[2];
 const sel = myVote === v;
 return (
 <button key={v} onClick={function(){ setMyVote(v); }}
 style={{ flex:1, padding:"8px 6px", borderRadius:10, border:"1.5px solid "+(sel?col:"rgba(255,255,255,0.1)"), background:sel?col+"18":"rgba(255,255,255,0.03)", cursor:"pointer", fontSize:12, fontWeight:800, color:sel?col:"rgba(255,255,255,0.5)", fontFamily:"Inter, sans-serif" }}>
 {label}
 </button>
 );
 })}
 </div></div>
 )}
 {/* Tags */}
 <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: 0.5, marginBottom: 6 }}>TAGS <span style={{ color:"rgba(255,255,255,0.13)" }}>optional</span></div>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
 {ALL_TAGS.map(function(tag) {
 const sel = selectedTags.includes(tag);
 const ip = POS_TAGS.includes(tag);
 return (
 <button key={tag} onClick={function(){ toggleTag(tag); }}
 style={{ padding:"4px 9px", borderRadius:99, border:"1px solid "+(sel?(ip?"#4ECB71":"#FF6B6B"):"rgba(255,255,255,0.09)"), background:sel?(ip?"rgba(78,203,113,0.12)":"rgba(255,107,107,0.12)"):"rgba(255,255,255,0.03)", color:sel?(ip?"#4ECB71":"#FF6B6B"):"rgba(255,255,255,0.4)", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"Inter, sans-serif" }}>
 {tag}
 </button>
 );
 })}
 </div>
 {/* Text */}
 <div style={{ position:"relative", marginBottom:8 }}>
 <textarea ref={textRef} value={reviewText}
 onChange={function(e){ if(e.target.value.length<=MAX_CHARS) setReviewText(e.target.value); }}
 placeholder="What did you think?"
 rows={3}
 style={{ width:"100%", padding:"10px 10px 26px", background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#fff", fontSize:13, lineHeight:1.55, resize:"none", outline:"none", fontFamily:"Inter, sans-serif", boxSizing:"border-box", transition:"border-color 0.2s" }}
 onFocus={function(e){ e.target.style.borderColor=hallColor; }}
 onBlur={function(e){ e.target.style.borderColor="rgba(255,255,255,0.1)"; }}
 />
 <div style={{ position:"absolute", bottom:8, right:10, fontSize:10, fontFamily:"monospace", fontWeight:700, color:reviewText.length>MAX_CHARS*0.85?"#FFD60A":"rgba(255,255,255,0.2)" }}>{reviewText.length}/{MAX_CHARS}</div></div>
 <div style={{ display:"flex", gap:8 }}>
 <button onClick={function(){ setShowWriteReview(false); setReviewText(""); setSelectedTags([]); }}
 style={{ padding:"9px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(255,255,255,0.3)", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Inter, sans-serif" }}>
 Cancel
 </button>
 <button onClick={postReview} disabled={!reviewText.trim()}
 style={{ flex:1, padding:"9px 0", borderRadius:10, border:"none", background:reviewText.trim()?"linear-gradient(135deg,#4ECB71,#1fa84a)":"rgba(255,255,255,0.07)", color:reviewText.trim()?"#fff":"rgba(255,255,255,0.2)", fontWeight:900, fontSize:13, cursor:reviewText.trim()?"pointer":"not-allowed", fontFamily:"Inter, sans-serif", transition:"all 0.2s" }}>
 Post Review
 </button></div></div>
 )}
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
 <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "Inter, sans-serif" }}> You're near {hall.name}!</div>
 <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 }}>{hall.distance}m away · {hall.isOpen ? "Open now" : "Currently closed"}</div></div></div>
 <div style={{ display: "flex", gap: 8 }}>
 <button onClick={onAccept} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "none", background: hall.color, color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 14px " + hall.color + "55" }}>View {hall.name} Menu →</button>
 <button onClick={onDismiss} style={{ padding: "11px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>Dismiss</button></div></div></div>
 );
}

function AnalyticsDashboard({ menu, authUser }) {
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
 <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", fontFamily: "Inter, sans-serif" }}>Analytics Dashboard</div></div>
 <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
 {[[String(totalRatings), "Ratings", "↑ 23% this week"], [String(totalReviews), "Reviews", "With written text"], ["5", "Halls", "All tracked"]].map(function(item) {
 return (
 <div key={item[1]} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "14px 12px", flex: 1, border: "1px solid rgba(255,255,255,0.08)" }}>
 <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: "Inter, sans-serif" }}>{item[0]}</div>
 <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{item[1]}</div>
 <div style={{ fontSize: 10, color: "#4ECB71", marginTop: 4, fontWeight: 700 }}>{item[2]}</div></div>
 );
 })}
 </div>
 <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "18px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
 <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 16, fontFamily: "Inter, sans-serif" }}>Hall Approval Ratings</div>
 {hallStats.map(function(h) {
 const col = h.score >= 80 ? "#4ECB71" : h.score >= 55 ? "#FFD60A" : "#FF6B6B";
 return (
 <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}>
 <span style={{ fontSize: 16, width: 22, textAlign: "center" }}></span>
 <div style={{ flex: 1 }}>
 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
 <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{h.name}</span>
 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
 <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}> {h.reviewCount}</span>
 <span style={{ fontSize: 12, fontWeight: 900, color: col, fontFamily: "Inter, sans-serif" }}>{h.score}%</span></div></div>
 <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
 <div style={{ height: "100%", width: h.score + "%", background: col, borderRadius: 99 }} /></div>
 <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 3 }}>{h.ratingCount} ratings</div></div></div>
 );
 })}
 </div>
 <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "18px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
 <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 14, fontFamily: "Inter, sans-serif" }}> Most Loved Items</div>
 {topItems.map(function(item, i) {
 const hall = DINING_HALLS.find(function(h) { return h.id === item.hallId; });
 const revCount = item.reviews ? item.reviews.filter(function(r) { return r.text; }).length : 0;
 return (
 <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < topItems.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
 <span style={{ fontSize: 14, width: 22 }}>{["","",""][i] || "#" + (i+1)}</span>
 <span></span>
 <div style={{ flex: 1 }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{item.name}</div>
 <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{hall ? hall.name : ""} · {revCount} reviews</div></div>
 <div style={{ fontWeight: 900, fontSize: 13, color: "#4ECB71", fontFamily: "Inter, sans-serif" }}> {item.upvotes}</div></div>
 );
 })}
 </div>
 {recentReviews.length > 0 && (
 <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "18px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
 <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 14, fontFamily: "Inter, sans-serif" }}> Latest Student Reviews</div>
 {recentReviews.map(function(r, i) {
 return (
 <div key={r.id} style={{ padding: "10px 0", borderBottom: i < recentReviews.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
 <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
 <span style={{ fontSize: 15 }}>{r.itemEmoji}</span>
 <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{r.itemName}</span>
 <span style={{ fontSize: 14 }}>{r.vote === "up" ? "👍" : "👎"}</span></div>
 <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "0 0 4px", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", fontStyle: "italic" }}>"{r.text}"</p>
 <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>@{r.user} · {r.time}</div></div>
 );
 })}
 </div>
 )}
 <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "18px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
 <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 14, fontFamily: "Inter, sans-serif" }}> Top Feedback Tags</div>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
 {topTags.map(function(entry) {
 const tag = entry[0]; const count = entry[1]; const ip = POS_TAGS.includes(tag);
 return <span key={tag} style={{ padding: "6px 12px", borderRadius: 99, background: ip ? "rgba(78,203,113,0.15)" : "rgba(255,107,107,0.15)", color: ip ? "#4ECB71" : "#FF6B6B", fontSize: 12, fontWeight: 700, border: "1px solid " + (ip ? "rgba(78,203,113,0.25)" : "rgba(255,107,107,0.25)") }}>{tag} <span style={{ opacity: 0.6 }}>{count}</span></span>;
 })}
 </div></div>
 <div style={{ background: "linear-gradient(135deg, rgba(78,203,113,0.1), rgba(74,158,255,0.1))", borderRadius: 20, padding: "18px", border: "1px solid rgba(78,203,113,0.2)" }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: "#4ECB71", letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" }}> Waste Reduction Insight</div>
 <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>Items tagged <strong style={{ color: "#fff" }}>"Bland"</strong> have written reviews confirming flavor issues — students say Vegan Burger <em style={{ color: "rgba(255,255,255,0.8)" }}>"needs serious seasoning."</em> Recommend recipe adjustment before next service. Chocolate Lava Cake (98% approval) should be replicated at lower-rated halls.</div></div></div>
 );
}


// ── AI ANALYTICS PANEL ───────────────────────────────────────────────────────
function AIAnalyticsPanel({ menu }) {
  const [aiOutput, setAiOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function buildPrompt() {
    var allItems = Object.entries(menu).flatMap(function(entry) {
      return entry[1].map(function(i) { return Object.assign({}, i, { hall: entry[0] }); });
    });
    var summary = allItems.map(function(i) {
      var total = i.upvotes + i.downvotes;
      var pct = total === 0 ? 50 : Math.round((i.upvotes / total) * 100);
      var topTags = Object.entries(i.tags).sort(function(a,b){return b[1]-a[1];}).slice(0,3).map(function(e){return e[0];}).join(", ");
      var reviews = (i.reviews||[]).filter(function(r){return r.text;}).map(function(r){return r.text;}).join(" | ");
      return i.name + " (" + i.hall + "): " + pct + "% approval, tags: " + topTags + (reviews ? ", reviews: " + reviews : "");
    }).join("\n");

    return "You are a food service analytics AI for Northwestern University dining halls. Analyze the following menu item ratings and student feedback, then provide:\n1. Top 3 most popular ingredients or flavor profiles students love\n2. Top 2 cuisine types students want more of\n3. Three specific, feasible new menu item recommendations with a one-sentence rationale each\n4. One item to remove or fix with a brief reason\n\nKeep your entire response under 280 words. Be specific and data-driven. Format with clear numbered sections.\n\nMenu data:\n" + summary;
  }

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    setAiOutput(null);
    try {
      var res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          messages: [{ role: "user", content: buildPrompt() }]
        })
      });
      var data = await res.json();
      if (data.content && data.content[0]) {
        setAiOutput(data.content[0].text);
      } else {
        setError("No response from AI.");
      }
    } catch(e) {
      setError("Failed to reach AI. Check connection.");
    }
    setLoading(false);
  }

  return (
    <div style={{ margin: "14px 0 0", background: "linear-gradient(135deg, rgba(74,158,255,0.08), rgba(191,90,242,0.08))", borderRadius: 20, padding: "18px", border: "1px solid rgba(74,158,255,0.2)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#4A9EFF", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 2 }}>✦ AI Menu Intelligence</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Powered by Claude · Analyzes live ratings</div>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading}
          style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: loading ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #4A9EFF, #BF5AF2)", color: loading ? "rgba(255,255,255,0.3)" : "#fff", fontWeight: 800, fontSize: 12, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}
        >
          {loading ? "Analyzing..." : aiOutput ? "Re-analyze" : "Run Analysis"}
        </button>
      </div>

      {!aiOutput && !loading && !error && (
        <div style={{ padding: "20px 0", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
          Click Run Analysis to get AI-powered menu recommendations based on current ratings and student feedback.
        </div>
      )}

      {loading && (
        <div style={{ padding: "20px 0", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#4A9EFF", fontWeight: 600, marginBottom: 6 }}>Analyzing {Object.values(menu).flat().length} menu items...</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Reading ratings, tags, and reviews</div>
        </div>
      )}

      {error && (
        <div style={{ fontSize: 13, color: "#FF6B6B", padding: "8px 0" }}>{error}</div>
      )}

      {aiOutput && (
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
          {aiOutput}
        </div>
      )}
    </div>
  );
}


// ── SUGGESTION TAB ────────────────────────────────────────────────────────────
function SuggestionTab({ authUser, onSubmitted }) {
  const [category, setCategory] = useState("cuisine");
  const [text, setText] = useState("");
  const [hall, setHall] = useState("any");
  const [submitted, setSubmitted] = useState(false);
  const [submissions, setSubmissions] = useState([
    { id: "s1", user: "wildcat_2027", category: "dish", hall: "Allison", text: "Please bring back the bulgogi rice bowl — it was 🔥 last semester!", time: "1h ago" },
    { id: "s2", user: "nugrad_cs", category: "cuisine", hall: "any", text: "Would love to see more Vietnamese options — pho, banh mi, anything!", time: "3h ago" },
    { id: "s3", user: "dillo_fan", category: "diet", hall: "Sargent", text: "More high-protein options that aren't just plain chicken breast please", time: "5h ago" },
  ]);

  function submit() {
    if (!text.trim()) return;
    var newSub = { id: "s" + Date.now(), user: authUser ? authUser.name : "you", category: category, hall: hall, text: text.trim(), time: "just now" };
    setSubmissions(function(p) { return [newSub, ...p]; });
    setText("");
    setSubmitted(true);
    setTimeout(function() { setSubmitted(false); }, 2500);
    if (onSubmitted) onSubmitted(newSub);
  }

  var cats = [["cuisine", "🌍", "Cuisine type"], ["dish", "🍽️", "Specific dish"], ["diet", "🥗", "Dietary need"], ["other", "💬", "Other"]];
  var halls = ["any", ...DINING_HALLS.map(function(h) { return h.name; })];

  return (
    <div style={{ padding: "16px 16px 120px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 900, fontSize: 20, color: "#fff", marginBottom: 4 }}>Suggest to Dining</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Your suggestions go directly to Levi dining staff.</div>
      </div>

      {/* Category selector */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 8 }}>SUGGESTION TYPE</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {cats.map(function(c) {
            var sel = category === c[0];
            return (
              <button key={c[0]} onClick={function() { setCategory(c[0]); }}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 99, border: "1.5px solid " + (sel ? "#4ECB71" : "rgba(255,255,255,0.1)"), background: sel ? "rgba(78,203,113,0.12)" : "transparent", color: sel ? "#4ECB71" : "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.15s" }}>
                <span>{c[1]}</span><span>{c[2]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hall selector */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 8 }}>FOR WHICH HALL?</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {halls.map(function(h) {
            var sel = hall === h;
            var hallObj = DINING_HALLS.find(function(x) { return x.name === h; });
            var col = hallObj ? hallObj.color : "#4ECB71";
            return (
              <button key={h} onClick={function() { setHall(h); }}
                style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 99, border: "1.5px solid " + (sel ? col : "rgba(255,255,255,0.1)"), background: sel ? col + "18" : "transparent", color: sel ? col : "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.15s" }}>
                {h === "any" ? "Any hall" : h}
              </button>
            );
          })}
        </div>
      </div>

      {/* Text input */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 8 }}>YOUR SUGGESTION</div>
        <textarea
          value={text}
          onChange={function(e) { setText(e.target.value); }}
          placeholder={
            category === "cuisine" ? "e.g. More Korean food, Ethiopian injera, Vietnamese pho..." :
            category === "dish" ? "e.g. Bring back the bulgogi bowl, add shakshuka to breakfast..." :
            category === "diet" ? "e.g. More high-protein vegan options, gluten-free pasta..." :
            "Any feedback for dining staff..."
          }
          maxLength={300}
          rows={4}
          style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#fff", fontSize: 13, fontFamily: "Inter, sans-serif", resize: "none", outline: "none", lineHeight: 1.6, boxSizing: "border-box", transition: "border-color 0.2s" }}
          onFocus={function(e) { e.target.style.borderColor = "#4ECB71"; }}
          onBlur={function(e) { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
        />
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "right", marginTop: 4 }}>{text.length}/300</div>
      </div>

      <button
        onClick={submit}
        disabled={!text.trim()}
        style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: text.trim() ? "linear-gradient(135deg, #4ECB71, #1fa84a)" : "rgba(255,255,255,0.07)", color: text.trim() ? "#fff" : "rgba(255,255,255,0.2)", fontWeight: 800, fontSize: 14, cursor: text.trim() ? "pointer" : "not-allowed", fontFamily: "Inter, sans-serif", transition: "all 0.2s", marginBottom: 24 }}
      >
        {submitted ? "✓ Sent to dining staff!" : "Send Suggestion"}
      </button>

      {/* Recent submissions */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 12 }}>RECENT FROM WILDCATS</div>
      {submissions.map(function(s) {
        var catLabel = { cuisine: "🌍 Cuisine", dish: "🍽️ Dish", diet: "🥗 Diet", other: "💬 Other" }[s.category] || s.category;
        return (
          <div key={s.id} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "12px 14px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "rgba(78,203,113,0.1)", color: "#4ECB71", fontWeight: 700 }}>{catLabel}</span>
              {s.hall !== "any" && <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "rgba(74,158,255,0.1)", color: "#4A9EFF", fontWeight: 700 }}>{s.hall}</span>}
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginLeft: "auto" }}>{s.time}</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.55 }}>{s.text}</p>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 6 }}>@{s.user}</div>
          </div>
        );
      })}
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
 </div></div>
 );
}


// ── AUTH ─────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { email: "student@u.northwestern.edu", password: "wildcat", role: "student", name: "Corey Z." },
  { email: "admin@northwestern.edu",     password: "admin123", role: "admin",   name: "Dining Admin" },
];

const MEAL_TIMES = ["Breakfast", "Lunch", "Dinner", "Late Night"];

// ── LOGIN SCREEN ──────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function submit() {
    setError("");
    setLoading(true);
    setTimeout(function() {
      var user = MOCK_USERS.find(function(u) { return u.email === email.trim().toLowerCase() && u.password === password; });
      if (user) { onLogin(user); }
      else { setError("Invalid email or password."); setLoading(false); }
    }, 600);
  }

  var inp = { width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box", transition: "border-color 0.2s" };

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px 40px" }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", fontFamily: "Inter, sans-serif", letterSpacing: -1 }}>Ozzi</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginTop: 6 }}>Northwestern Dining · Rated by students</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email" placeholder="Northwestern email" value={email}
          onChange={function(e) { setEmail(e.target.value); }}
          onKeyDown={function(e) { if (e.key === "Enter") submit(); }}
          style={inp}
          onFocus={function(e) { e.target.style.borderColor = "#4ECB71"; }}
          onBlur={function(e) { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={function(e) { setPassword(e.target.value); }}
          onKeyDown={function(e) { if (e.key === "Enter") submit(); }}
          style={inp}
          onFocus={function(e) { e.target.style.borderColor = "#4ECB71"; }}
          onBlur={function(e) { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
        />
        {error && <div style={{ fontSize: 12, color: "#FF6B6B", fontWeight: 600 }}>{error}</div>}
        <button
          onClick={submit}
          disabled={loading || !email || !password}
          style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: email && password ? "linear-gradient(135deg, #4ECB71, #1fa84a)" : "rgba(255,255,255,0.08)", color: email && password ? "#fff" : "rgba(255,255,255,0.25)", fontWeight: 800, fontSize: 14, cursor: email && password ? "pointer" : "not-allowed", fontFamily: "Inter, sans-serif", transition: "all 0.2s", marginTop: 4 }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>

      <div style={{ marginTop: 24, padding: "14px 16px", background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.25)", marginBottom: 8, letterSpacing: 0.5 }}>DEMO ACCOUNTS</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
          <div>student@u.northwestern.edu · wildcat</div>
          <div>admin@northwestern.edu · admin123</div>
        </div>
      </div>
    </div>
  );
}

// ── ONBOARDING SCREEN ─────────────────────────────────────────────────────
function OnboardingScreen({ user, onComplete }) {
  const [step, setStep] = useState(0);
  const [homeDiningHalls, setHomeDiningHalls] = useState([]);
  const [mealPrefs, setMealPrefs] = useState([]);
  const [notifPref, setNotifPref] = useState(null); // "exit" | "meal" | "both" | "none"
  const [mealTimes, setMealTimes] = useState({}); // { Breakfast: "07:30", Lunch: "12:00", ... }

  function toggleHall(id) { setHomeDiningHalls(function(p) { return p.includes(id) ? p.filter(function(x) { return x !== id; }) : [...p, id]; }); }
  function toggleMeal(m) { setMealPrefs(function(p) { return p.includes(m) ? p.filter(function(x) { return x !== m; }) : [...p, m]; }); }

  var hallObj_color = { allison: "#FF6B6B", sargent: "#4ECB71", elder: "#4A9EFF", plexeast: "#FF9500", plexwest: "#BF5AF2" };

  var steps = [
    // STEP 0 — welcome
    <div key="welcome" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 12 }}>WELCOME</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", fontFamily: "Inter, sans-serif", lineHeight: 1.2, marginBottom: 12 }}>Hey {user.name.split(" ")[0]}.</div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
          Ozzi helps you know what's worth eating — and helps dining teams serve what students actually want.
        </div>
        <div style={{ marginTop: 24, fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
          Takes 30 seconds to set up. You can change everything later in Settings.
        </div>
      </div>
      <div style={{ padding: "0 28px 40px" }}>
        <button onClick={function() { setStep(1); }} style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#4ECB71,#1fa84a)", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
          Get Started
        </button>
      </div>
    </div>,

    // STEP 1 — home dining hall
    <div key="halls" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, padding: "0 28px", overflowY: "auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 8, paddingTop: 8 }}>STEP 1 OF 3</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "Inter, sans-serif", marginBottom: 6 }}>Your dining halls</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Select all the halls you eat at. We'll show their menus first.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DINING_HALLS.map(function(h) {
            var sel = homeDiningHalls.includes(h.id);
            return (
              <button key={h.id} onClick={function() { toggleHall(h.id); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, border: "1.5px solid " + (sel ? h.color : "rgba(255,255,255,0.08)"), background: sel ? h.color + "14" : "rgba(255,255,255,0.03)", cursor: "pointer", textAlign: "left", transition: "all 0.15s", fontFamily: "Inter, sans-serif" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: sel ? h.color : "rgba(255,255,255,0.15)", border: "2px solid " + (sel ? h.color : "rgba(255,255,255,0.2)"), flexShrink: 0, transition: "all 0.15s" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: sel ? "#fff" : "rgba(255,255,255,0.7)" }}>{h.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{h.subtitle} · {h.hours}</div>
                </div>
                {sel && <div style={{ fontSize: 12, fontWeight: 800, color: h.color }}>✓</div>}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "16px 28px 40px", display: "flex", gap: 10 }}>
        <button onClick={function() { setStep(0); }} style={{ padding: "13px 20px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>Back</button>
        <button onClick={function() { setStep(2); }} style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "none", background: homeDiningHalls.length > 0 ? "linear-gradient(135deg,#4ECB71,#1fa84a)" : "rgba(255,255,255,0.08)", color: homeDiningHalls.length > 0 ? "#fff" : "rgba(255,255,255,0.25)", fontWeight: 800, fontSize: 14, cursor: homeDiningHalls.length > 0 ? "pointer" : "not-allowed", fontFamily: "Inter, sans-serif" }}>
          {homeDiningHalls.length === 0 ? "Select at least one" : "Continue →"}
        </button>
      </div>
    </div>,

    // STEP 2 — meal time preferences with time picker
    <div key="meals" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, padding: "0 28px", overflowY: "auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 8, paddingTop: 8 }}>STEP 2 OF 3</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "Inter, sans-serif", marginBottom: 6 }}>Your meal times</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Toggle meals you eat and set the time you usually go. We'll send you the menu right before.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["Breakfast", "🌅", "07:30"],
            ["Lunch",     "☀️", "12:00"],
            ["Dinner",    "🌆", "18:00"],
            ["Late Night","🌙", "21:30"],
          ].map(function(arr) {
            var m = arr[0], icon = arr[1], defaultTime = arr[2];
            var sel = mealPrefs.includes(m);
            var currentTime = mealTimes[m] || defaultTime;
            return (
              <div key={m} style={{ borderRadius: 14, border: "1.5px solid " + (sel ? "#4ECB71" : "rgba(255,255,255,0.08)"), background: sel ? "rgba(78,203,113,0.07)" : "rgba(255,255,255,0.03)", transition: "all 0.15s", overflow: "hidden" }}>
                <button onClick={function() { toggleMeal(m); if (!mealTimes[m]) { setMealTimes(function(p) { var n = Object.assign({}, p); n[m] = defaultTime; return n; }); } }}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "Inter, sans-serif" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: sel ? "#4ECB71" : "rgba(255,255,255,0.15)", border: "2px solid " + (sel ? "#4ECB71" : "rgba(255,255,255,0.2)"), flexShrink: 0, transition: "all 0.15s" }} />
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: sel ? "#fff" : "rgba(255,255,255,0.7)" }}>{m}</div>
                  </div>
                  {sel && <div style={{ fontSize: 12, fontWeight: 800, color: "#4ECB71" }}>✓</div>}
                </button>
                {sel && (
                  <div style={{ padding: "0 16px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 600, flexShrink: 0 }}>Notify me at</span>
                    <input
                      type="time"
                      value={currentTime}
                      onChange={function(e) { var v = e.target.value; setMealTimes(function(p) { var n = Object.assign({}, p); n[m] = v; return n; }); }}
                      style={{ flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "Inter, sans-serif", outline: "none", colorScheme: "dark" }}
                    />
                    <span style={{ fontSize: 12, color: "#4ECB71", fontWeight: 700 }}>
                      {(function() {
                        var h = parseInt(currentTime.split(":")[0]);
                        var min = currentTime.split(":")[1];
                        var ampm = h >= 12 ? "pm" : "am";
                        var h12 = h % 12 || 12;
                        return h12 + ":" + min + " " + ampm;
                      })()}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "16px 28px 40px", display: "flex", gap: 10 }}>
        <button onClick={function() { setStep(1); }} style={{ padding: "13px 20px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>Back</button>
        <button onClick={function() { setStep(3); }} style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "none", background: mealPrefs.length > 0 ? "linear-gradient(135deg,#4ECB71,#1fa84a)" : "rgba(255,255,255,0.08)", color: mealPrefs.length > 0 ? "#fff" : "rgba(255,255,255,0.25)", fontWeight: 800, fontSize: 14, cursor: mealPrefs.length > 0 ? "pointer" : "not-allowed", fontFamily: "Inter, sans-serif" }}>
          {mealPrefs.length === 0 ? "Select at least one" : "Continue →"}
        </button>
      </div>
    </div>,

    // STEP 3 — notification preferences
    <div key="notifs" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, padding: "0 28px", overflowY: "auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 8, paddingTop: 8 }}>STEP 3 OF 3</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "Inter, sans-serif", marginBottom: 6 }}>Push notifications</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>When do you want to be reminded to rate?</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["exit",  "When I leave a dining hall",    "Triggered by your location — most accurate"],
            ["meal",  "At my preferred meal times",    "Daily reminders at the times you selected"],
            ["both",  "Both",                          "Location + scheduled reminders"],
            ["none",  "No notifications",              "You can change this later in settings"],
          ].map(function(arr) {
            var val=arr[0], label=arr[1], desc=arr[2];
            var sel = notifPref === val;
            return (
              <button key={val} onClick={function() { setNotifPref(val); }}
                style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: 14, border: "1.5px solid " + (sel ? "#4ECB71" : "rgba(255,255,255,0.08)"), background: sel ? "rgba(78,203,113,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", textAlign: "left", transition: "all 0.15s", fontFamily: "Inter, sans-serif" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: sel ? "#4ECB71" : "rgba(255,255,255,0.15)", border: "2px solid " + (sel ? "#4ECB71" : "rgba(255,255,255,0.2)"), flexShrink: 0, marginTop: 3 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: sel ? "#fff" : "rgba(255,255,255,0.7)" }}>{label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
                </div>
                {sel && <div style={{ fontSize: 12, fontWeight: 800, color: "#4ECB71" }}>✓</div>}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "16px 28px 40px", display: "flex", gap: 10 }}>
        <button onClick={function() { setStep(2); }} style={{ padding: "13px 20px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>Back</button>
        <button
          onClick={function() {
            if (!notifPref) return;
            if ((notifPref === "exit" || notifPref === "both") && "Notification" in window && Notification.permission === "default") {
              Notification.requestPermission();
            }
            onComplete({ homeDiningHalls: homeDiningHalls, mealPrefs: mealPrefs, mealTimes: mealTimes, notifPref: notifPref });
          }}
          style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "none", background: notifPref ? "linear-gradient(135deg,#4ECB71,#1fa84a)" : "rgba(255,255,255,0.08)", color: notifPref ? "#fff" : "rgba(255,255,255,0.25)", fontWeight: 800, fontSize: 14, cursor: notifPref ? "pointer" : "not-allowed", fontFamily: "Inter, sans-serif" }}>
          Start using Ozzi →
        </button>
      </div>
    </div>,
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Progress bar */}
      <div style={{ display: "flex", gap: 4, padding: "16px 28px 0" }}>
        {[0,1,2,3].map(function(i) {
          return <div key={i} style={{ flex: 1, height: 2, borderRadius: 99, background: i <= step ? "#4ECB71" : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />;
        })}
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        {steps[step]}
      </div>
    </div>
  );
}

export default function App() {
 const [authUser, setAuthUser] = useState(null);
 const [prefs, setPrefs] = useState(null); // { homeDiningHalls, mealPrefs, notifPref }
 const [screen, setScreen] = useState("login"); // "login" | "onboard" | "app"
 const [tab, setTab] = useState("feed");
 const [selectedHall, setSelectedHall] = useState("allison");
 const [menu, setMenu] = useState(SEED_MENU);
 const [activity, setActivity] = useState(SEED_ACTIVITY);
 const [sortBy, setSortBy] = useState("top");
 const [toast, setToast] = useState(null);
 const [geoState, setGeoState] = useState("idle");
 const [nearbyHall, setNearbyHall] = useState(null);
 const [geoPrompt, setGeoPrompt] = useState(null);
 const [dismissedPrompt, setDismissedPrompt] = useState(null);
 const watchRef = useRef(null);
 const insideHallRef = useRef(null); // tracks which hall user is currently inside
 const exitTimerRef = useRef(null); // debounce so brief GPS drift doesn't fire

 const showToast = useCallback(function(msg) { setToast(msg); setTimeout(function() { setToast(null); }, 2400); }, []);

 function requestNotificationPermission(hallName, hallId) {
 if (!("Notification" in window)) return;
 if (Notification.permission === "granted") {
 fireRatingNotification(hallName, hallId);
 } else if (Notification.permission !== "denied") {
 Notification.requestPermission().then(function(perm) {
 if (perm === "granted") fireRatingNotification(hallName, hallId);
 });
 }
 }

 function fireRatingNotification(hallName, hallId) {
 try {
 var n = new Notification("How was " + hallName + "?", {
 body: "Rate today's dishes before you forget — takes 2 seconds.",
 icon: "/favicon.ico",
 tag: "ozzi-rating-" + hallId,
 renotify: false,
 });
 n.onclick = function() { window.focus(); setTab("feed"); setSelectedHall(hallId); };
 } catch(e) {}
 }

 function handleGeoSuccess(pos) {
 var lat = pos.coords.latitude; var lng = pos.coords.longitude;
 setGeoState("granted");
 var halls = getNearbyHalls(lat, lng);
 var closest = halls[0];
 var nowInside = closest.distance <= closest.radius ? closest : null;
 var prevHallId = insideHallRef.current ? insideHallRef.current.id : null;
 var nowHallId = nowInside ? nowInside.id : null;

 if (nowInside) {
 // Entered or still inside a hall
 if (exitTimerRef.current) { clearTimeout(exitTimerRef.current); exitTimerRef.current = null; }
 insideHallRef.current = nowInside;
 setNearbyHall(nowInside);
 if (nowInside.id !== dismissedPrompt) setGeoPrompt(nowInside);
 } else {
 // Outside all halls — if we WERE inside one, start exit timer
 setNearbyHall(null);
 setGeoPrompt(null);
 if (prevHallId && !exitTimerRef.current) {
 var leftHall = insideHallRef.current;
 exitTimerRef.current = setTimeout(function() {
 // Confirm still outside after 45s (avoid GPS jitter triggering it)
 insideHallRef.current = null;
 exitTimerRef.current = null;
 requestNotificationPermission(leftHall.name, leftHall.id);
 showToast("Left " + leftHall.name + " — how was it?");
 setSelectedHall(leftHall.id);
 setTab("feed");
 }, 45000); // 45 second debounce — confirmed exit
 }
 }
 }

 function requestGeo() {
 if (!navigator.geolocation) return showToast("Geolocation not supported");
 setGeoState("requesting");
 // Pre-request notification permission so the prompt comes before they leave
 if ("Notification" in window && Notification.permission === "default") {
 Notification.requestPermission();
 }
 navigator.geolocation.getCurrentPosition(handleGeoSuccess, function() { setGeoState("denied"); showToast("Location denied — browse from anywhere!"); }, { enableHighAccuracy: true, timeout: 8000 });
 if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
 watchRef.current = navigator.geolocation.watchPosition(handleGeoSuccess, function() {}, { maximumAge: 30000 });
 }

 function simulateLocation(hallId) {
 var hall = DINING_HALLS.find(function(h) { return h.id === hallId; });
 handleGeoSuccess({ coords: { latitude: hall.lat + 0.0001, longitude: hall.lng + 0.0001 } });
 showToast("Simulating near " + hall.name);
 }

 useEffect(function() {
 return function() {
 if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
 if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
 };
 }, []);

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
 showToast(hasReview ? "Review posted!" : vote === "up" ? "Upvoted!" : "Feedback noted!");
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

  // ── AUTH GATE ──
  if (screen === "login") {
    return (
      <PhoneFrame>
        <div style={{ fontFamily: "Inter, sans-serif", width: "100%", minHeight: "100vh", background: "#0a0a14", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <LoginScreen onLogin={function(user) { setAuthUser(user); if (user.role === "admin") { setScreen("app"); setTab("analytics"); } else { setScreen("onboard"); } }} />
        </div>
      </PhoneFrame>
    );
  }
  if (screen === "onboard") {
    return (
      <PhoneFrame>
        <div style={{ fontFamily: "Inter, sans-serif", width: "100%", minHeight: "100vh", background: "#0a0a14", color: "#fff" }}>
          <OnboardingScreen user={authUser} onComplete={function(p) { setPrefs(p); setSelectedHall(p.homeDiningHalls[0] || "allison"); setScreen("app"); }} />
        </div>
      </PhoneFrame>
    );
  }

 var hallItems = menu[selectedHall] || [];
 var sorted = hallItems.slice().sort(function(a, b) {
 if (sortBy === "top") return b.upvotes - a.upvotes;
 if (sortBy === "new") return b.id - a.id;
 return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
 });
 var currentHall = DINING_HALLS.find(function(h) { return h.id === selectedHall; });

 return (
 <PhoneFrame>
 <div style={{ fontFamily: "Inter, sans-serif", width: "100%", minHeight: "100vh", background: "#0a0a14", position: "relative", display: "flex", flexDirection: "column", color: "#fff" }}>
 <style>{`
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
 * { box-sizing: border-box; margin: 0; padding: 0; }
 html, body, #root { background: #050509; min-height: 100vh; }
 ::-webkit-scrollbar { display: none; }
 @keyframes slideUp { from { transform: translateY(100%); opacity:0 } to { transform: translateY(0); opacity:1 } }
 @keyframes slideDown { from { transform: translateY(-100%); opacity:0 } to { transform: translateY(0); opacity:1 } }
 @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
 @keyframes pop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
 @keyframes fadeIn { from{opacity:0} to{opacity:1} }
 @keyframes popIn { from{opacity:0; transform:scale(0.92)} to{opacity:1; transform:scale(1)} }
 @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
 textarea::placeholder { color: rgba(255,255,255,0.2); }
 textarea { caret-color: #4ECB71; }
 `}</style>

 {geoPrompt && (
 <GeoPromptBanner
 hall={geoPrompt}
 onAccept={function() { setSelectedHall(geoPrompt.id); setTab("feed"); setGeoPrompt(null); showToast("Switched to " + geoPrompt.name + " "); }}
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
 <div style={{ width: 34, height: 34, borderRadius: 11, background: "linear-gradient(135deg, #4ECB71, #4A9EFF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}></div>
 <div>
 <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: "-0.5px", lineHeight: 1 }}>Ozzi</div>
 <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: 0.5 }}>NORTHWESTERN · DINING</div></div>
 <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
   {authUser && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>{authUser.name}</span>}
   <button onClick={function() { setScreen("login"); setAuthUser(null); setPrefs(null); setTab("feed"); }} style={{ padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>Sign out</button>
 </div></div>
 {geoState === "requesting" && <div style={{ width: 8, height: 8, borderRadius: 99, background: "#FFD60A", animation: "pulse 1s infinite" }} />}
 {geoState === "granted" && nearbyHall && (
 <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(78,203,113,0.08)", border: "1px solid rgba(78,203,113,0.22)", borderRadius: 99, padding: "4px 10px" }}>
 <div style={{ width: 6, height: 6, borderRadius: 99, background: "#4ECB71" }} />
 <span style={{ fontSize: 11, color: "#4ECB71", fontWeight: 700 }}>Near {nearbyHall.name}</span></div>
 )}
 </div>
 <div style={{ display: "flex" }}>
 {(authUser && authUser.role === "admin" ? [["analytics", "Insights"]] : [["feed", "Menu"], ["activity", "Live"], ["suggest", "Suggest"]]).map(function(item) {
 return (
 <button key={item[0]} onClick={function() { setTab(item[0]); }} style={{ flex: 1, padding: "10px 0", border: "none", background: "none", cursor: "pointer", fontSize: 12, fontWeight: tab === item[0] ? 800 : 600, color: tab === item[0] ? "#4ECB71" : "rgba(255,255,255,0.3)", borderBottom: "2px solid " + (tab === item[0] ? "#4ECB71" : "transparent"), transition: "all 0.2s", fontFamily: "Inter, sans-serif" }}>
 {item[1]}
 </button>
 );
 })}
 </div></div>

 <div style={{ flex: 1, overflowY: "auto" }}>
 {tab === "feed" && (
 <div style={{ padding: "16px 16px 120px" }}>
 <button
 onClick={requestGeo}
 style={{ width: "100%", padding: "10px 14px", background: geoState === "granted" ? "rgba(78,203,113,0.07)" : "rgba(255,255,255,0.03)", border: "1px solid " + (geoState === "granted" ? "rgba(78,203,113,0.22)" : "rgba(255,255,255,0.07)"), borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontFamily: "Inter, sans-serif", transition: "all 0.15s" }}
 >
 <span style={{ fontSize: 14 }}>{geoState === "granted" ? "●" : geoState === "denied" ? "✕" : "◎"}</span>
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
 return <button key={h.id} onClick={function() { simulateLocation(h.id); }} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 99, border: "1px solid " + h.color + "40", background: h.color + "15", color: h.color, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>{h.name}</button>;
 })}
 </div></div>
 )}

 <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14, paddingBottom: 4 }}>
 {DINING_HALLS.map(function(hall) {
 var sel = selectedHall === hall.id;
 var isNearby = nearbyHall && nearbyHall.id === hall.id;
 return (
 <button key={hall.id} onClick={function() { setSelectedHall(hall.id); }} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 14, border: "1.5px solid " + (sel ? hall.color : "rgba(255,255,255,0.1)"), background: sel ? hall.color + "18" : "rgba(255,255,255,0.04)", cursor: "pointer", transition: "all 0.15s", fontFamily: "Inter, sans-serif", position: "relative" }}>
 {isNearby && <div style={{ position: "absolute", top: -4, right: -4, width: 10, height: 10, borderRadius: 99, background: "#4ECB71", border: "2px solid #0a0a14" }} />}
 <div style={{ fontSize: 18 }}>{hall.emoji}</div>
 <div style={{ fontSize: 10, fontWeight: sel ? 800 : 600, color: sel ? hall.color : "rgba(255,255,255,0.4)", marginTop: 3, whiteSpace: "nowrap" }}>{hall.name}</div>
 <div style={{ fontSize: 9, color: hall.isOpen ? "#4ECB71" : "rgba(255,255,255,0.25)", fontWeight: 600, marginTop: 1 }}>{hall.isOpen ? "Open" : "Closed"}</div></button>
 );
 })}
 </div>

 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
 <div>
 <span style={{ fontSize: 18 }}>{currentHall ? currentHall.emoji : ""}</span>
 <span style={{ fontWeight: 900, fontSize: 16, marginLeft: 8, color: "#fff" }}>{currentHall ? currentHall.name : ""}</span>
 <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginLeft: 8 }}>· {currentHall ? currentHall.hours : ""}</span></div>
 <div style={{ display: "flex", gap: 6 }}>
 {[["top", ""], ["new", ""], ["best", ""]].map(function(item) {
 return <button key={item[0]} onClick={function() { setSortBy(item[0]); }} style={{ padding: "5px 10px", borderRadius: 99, border: "1px solid", borderColor: sortBy === item[0] ? "#4ECB71" : "rgba(255,255,255,0.1)", background: sortBy === item[0] ? "rgba(78,203,113,0.15)" : "transparent", color: sortBy === item[0] ? "#4ECB71" : "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>{item[1]} {item[0]}</button>;
 })}
 </div></div>

 {sorted.map(function(item, i) {
 return <FoodCard key={item.id} item={item} hall={selectedHall} onSubmit={handleSubmit} onHelpful={handleHelpful} index={i} />;
 })}
 </div>
 )}

 {tab === "activity" && (
 <div style={{ padding: "16px 16px 100px" }}>
 <div style={{ fontWeight: 900, fontSize: 20, color: "#fff", marginBottom: 6 }}>Live Activity</div>
 <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 18 }}>What Wildcats are rating right now</div>
 {activity.map(function(evt, i) {
 return (
 <div key={evt.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "12px 14px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 12, alignItems: "flex-start", animation: "fadeUp 0.3s ease " + Math.min(i, 5) * 0.07 + "s both" }}>
 <div style={{ width: 38, height: 38, borderRadius: 12, background: evt.vote === "up" ? "rgba(78,203,113,0.15)" : "rgba(255,107,107,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
 {evt.vote === "up" ? "👍" : "👎"}
 </div>
 <div style={{ flex: 1 }}>
 <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
 <span style={{ fontWeight: 800, color: "#fff" }}>@{evt.user}</span>{" "}
 <span style={{ color: evt.vote === "up" ? "#4ECB71" : "#FF6B6B", fontWeight: 700 }}>{evt.vote === "up" ? "loved" : "didn't like"}</span>{" "}
 <span style={{ fontWeight: 800, color: "#4A9EFF" }}>{evt.item}</span>{" "}
 at <span style={{ fontWeight: 600 }}>{evt.hall}</span></div>
 {evt.tag && (
 <span style={{ display: "inline-block", marginTop: 5, fontSize: 11, padding: "3px 10px", borderRadius: 99, background: POS_TAGS.includes(evt.tag) ? "rgba(78,203,113,0.15)" : "rgba(255,107,107,0.15)", color: POS_TAGS.includes(evt.tag) ? "#4ECB71" : "#FF6B6B", fontWeight: 700, border: "1px solid " + (POS_TAGS.includes(evt.tag) ? "rgba(78,203,113,0.2)" : "rgba(255,107,107,0.2)") }}>
 {evt.tag}
 </span>
 )}
 {evt.review && (
 <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "6px 0 0", lineHeight: 1.5, fontStyle: "italic" }}>"{evt.review}"</p>
 )}
 <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 5 }}>{evt.time} ago</div></div></div>
 );
 })}
 <div style={{ textAlign: "center", padding: "24px 0", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>All caught up · Check back at meal time </div></div>
 )}

 {tab === "analytics" && (
 <div style={{ padding: "16px 0 0" }}>
 <AnalyticsDashboard menu={menu} authUser={authUser} /></div>
 )}

 {tab === "suggest" && (
 <SuggestionTab authUser={authUser} onSubmitted={function(s) { showToast("Suggestion sent!"); }} />
 )}
 </div>

 <div style={{ position: "sticky", bottom: 0, width: "100%", background: "rgba(10,10,20,0.96)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "10px 20px 24px", display: "flex", justifyContent: "space-around", zIndex: 50 }}>
 {(authUser && authUser.role === "admin" ? [["analytics", "Insights"]] : [["feed", "Menu"], ["activity", "Live"], ["analytics", "Insights"]]).map(function(item) {
 return (
 <button key={item[0]} onClick={function() { setTab(item[0]); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", color: tab === item[0] ? "#4ECB71" : "rgba(255,255,255,0.3)", fontFamily: "Inter, sans-serif", transition: "color 0.2s" }}>
 <span style={{ fontSize: 22 }}>{item[1]}</span>
 <span style={{ fontSize: 10, fontWeight: tab === item[0] ? 800 : 600 }}>{item[2]}</span></button>
 );
 })}
 </div></div></PhoneFrame>
 );
}
