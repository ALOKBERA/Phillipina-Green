export const PRODUCTS = [
  // --- Dish Wash ---
  { id: "dw1", gu: "ડીશ વોશ - ૧", en: "Dish Wash - 1", pouch: 30, bottle: 40, category: "Dish Wash" },
  { id: "dw3", gu: "ડીશ વોશ - ૩", en: "Dish Wash - 3", pouch: 70, bottle: 90, category: "Dish Wash" },
  { id: "dw5", gu: "ડીશ વોશ - ૫", en: "Dish Wash - 5", pouch: 95, bottle: 115, category: "Dish Wash" }, // Corrected pouch: 95
  { id: "dwm1", gu: "ડીશ વોશર મશીન - ૧", en: "Dish Washer Machine - 1", pouch: null, bottle: 50, category: "Dish Wash" },
  { id: "dwm5", gu: "ડીશ વોશર મશીન - ૫", en: "Dish Washer Machine - 5", pouch: null, bottle: 180, category: "Dish Wash" },
  // --- Cloth Wash ---
  { id: "cw1", gu: "કલોથ વોશ - ૧", en: "Cloth Wash - 1", pouch: 70, bottle: 80, category: "Cloth Wash" },
  { id: "cw3", gu: "કલોથ વોશ - ૩", en: "Cloth Wash - 3", pouch: 180, bottle: 220, category: "Cloth Wash" },
  { id: "cw5", gu: "કલોથ વોશ - ૫", en: "Cloth Wash - 5", pouch: 275, bottle: 315, category: "Cloth Wash" }, // Corrected bottle: 315
  { id: "ccw1", gu: "ક્લો ક્લીન કલોથ વોશ - ૧", en: "Klo Clean Cloth Wash - 1", pouch: null, bottle: 115, category: "Cloth Wash" },
  { id: "ccw5", gu: "ક્લો ક્લીન કલોથ વોશ - ૫", en: "Klo Clean Cloth Wash - 5", pouch: null, bottle: 480, category: "Cloth Wash" },
  // --- Bathroom Cleaner ---
  { id: "bc1", gu: "બાથરૂમ ક્લીનર - ૧", en: "Bathroom Cleaner - 1", pouch: 40, bottle: 50, category: "Bathroom & Floor" }, // Corrected bottle: 50
  { id: "bc3", gu: "બાથરૂમ ક્લીનર - ૩", en: "Bathroom Cleaner - 3", pouch: 105, bottle: 120, category: "Bathroom & Floor" },
  { id: "bc5", gu: "બાથરૂમ ક્લીનર - ૫", en: "Bathroom Cleaner - 5", pouch: 150, bottle: 175, category: "Bathroom & Floor" }, // Corrected pouch: 150
  // --- Floor Cleaner ---
  {
    id: "fc1",
    gu: "ફ્લોર ક્લીનર - ૧",
    en: "Floor Cleaner - 1",
    pouch: 40,
    bottle: 50,
    category: "Bathroom & Floor",
    flavours: [
      { id: "rose", gu: "રોઝ", en: "Rose" },
      { id: "lavender", gu: "લેવેન્ડર", en: "Lavender" }
    ]
  },
  {
    id: "fc3",
    gu: "ફ્લોર ક્લીનર - ૩",
    en: "Floor Cleaner - 3",
    pouch: 105,
    bottle: 120,
    category: "Bathroom & Floor",
    flavours: [
      { id: "rose", gu: "રોઝ", en: "Rose" },
      { id: "lavender", gu: "લેવેન્ડર", en: "Lavender" }
    ]
  },
  {
    id: "fc5",
    gu: "ફ્લોર ક્લીનર - ૫",
    en: "Floor Cleaner - 5",
    pouch: 150,
    bottle: 175,
    category: "Bathroom & Floor",
    flavours: [
      { id: "rose", gu: "રોઝ", en: "Rose" },
      { id: "lavender", gu: "લેવેન્ડર", en: "Lavender" }
    ]
  },
  // --- Combo Kit ---
  { id: "combo", gu: "કોમ્બો કીટ", en: "Combo Kit", pouch: 105, bottle: null, category: "Other" },
  // --- Toilet Cleaner ---
  { id: "tc500", gu: "ટોઇલેટ ક્લીનર - ૫૦૦", en: "Toilet Cleaner - 500ml", pouch: null, bottle: 35, category: "Toilet & Glass" },
  { id: "tc1", gu: "ટોઇલેટ ક્લીનર - ૧", en: "Toilet Cleaner - 1", pouch: null, bottle: 50, category: "Toilet & Glass" }, // Corrected bottle: 50
  { id: "tc3", gu: "ટોઇલેટ ક્લીનર - ૩", en: "Toilet Cleaner - 3", pouch: null, bottle: 125, category: "Toilet & Glass" },
  { id: "tc5", gu: "ટોઇલેટ ક્લીનર - ૫", en: "Toilet Cleaner - 5", pouch: null, bottle: 180, category: "Toilet & Glass" },
  // --- Glass Cleaner ---
  { id: "gc500", gu: "ગ્લાસ ક્લીનર - ૫૦૦", en: "Glass Cleaner - 500ml", pouch: 40, bottle: null, note: "પંપ સાથે", category: "Toilet & Glass" },
  { id: "gc1", gu: "ગ્લાસ ક્લીનર - ૧", en: "Glass Cleaner - 1", pouch: 30, bottle: 40, category: "Toilet & Glass" },
  { id: "gc3", gu: "ગ્લાસ ક્લીનર - ૩", en: "Glass Cleaner - 3", pouch: 80, bottle: 105, category: "Toilet & Glass" },
  { id: "gc5", gu: "ગ્લાસ ક્લીનર - ૫", en: "Glass Cleaner - 5", pouch: 125, bottle: 150, category: "Toilet & Glass" },
  // --- Surface Cleaner ---
  { id: "sc1", gu: "સરફેસ ક્લીનર - ૧", en: "Surface Cleaner - 1", pouch: null, bottle: 80, category: "Surface & Detergent" },
  { id: "sc3", gu: "સરફેસ ક્લીનર - ૩", en: "Surface Cleaner - 3", pouch: null, bottle: 210, category: "Surface & Detergent" }, // Corrected bottle: 210
  { id: "sc5", gu: "સરફેસ ક્લીનર - ૫", en: "Surface Cleaner - 5", pouch: null, bottle: 300, category: "Surface & Detergent" },
  // --- Detergent Powder ---
  { id: "dp1", gu: "ડીટરજન્ટ પાઉડર - ૧", en: "Detergent Powder - 1", pouch: null, bottle: 75, category: "Surface & Detergent" }, // Corrected bottle: 75
  { id: "dp3", gu: "ડીટરજન્ટ પાઉડર - ૩", en: "Detergent Powder - 3", pouch: null, bottle: 210, category: "Surface & Detergent" }, // Corrected bottle: 210
  { id: "dp5", gu: "ડીટરજન્ટ પાઉડર - ૫", en: "Detergent Powder - 5", pouch: null, bottle: 330, category: "Surface & Detergent" },
  // --- Liquid Soap ---
  {
    id: "ls250",
    gu: "લીકવીડ શોપ - ૨૫૦",
    en: "Liquid Soap - 250ml",
    pouch: null,
    bottle: 40,
    category: "Other",
    flavours: [
      { id: "orange", gu: "ઓરેંજ", en: "Orange" },
      { id: "dplus", gu: "D+", en: "D+" },
      { id: "green_apple", gu: "ગ્રીન એપલ", en: "Green Apple" }
    ]
  },
  {
    id: "ls1",
    gu: "લીકવીડ શોપ - ૧",
    en: "Liquid Soap - 1",
    pouch: null,
    bottle: 70,
    category: "Other",
    flavours: [
      { id: "orange", gu: "ઓરેંજ", en: "Orange" },
      { id: "dplus", gu: "D+", en: "D+" },
      { id: "green_apple", gu: "ગ્રીન એપલ", en: "Green Apple" }
    ]
  },
  {
    id: "ls3",
    gu: "લીકવીડ શોપ - ૩",
    en: "Liquid Soap - 3",
    pouch: null,
    bottle: 180,
    category: "Other",
    flavours: [
      { id: "orange", gu: "ઓરેંજ", en: "Orange" },
      { id: "dplus", gu: "D+", en: "D+" },
      { id: "green_apple", gu: "ગ્રીન એપલ", en: "Green Apple" }
    ]
  },
  {
    id: "ls5",
    gu: "લીકવીડ શોપ - ૫",
    en: "Liquid Soap - 5",
    pouch: null,
    bottle: 255,
    category: "Other",
    flavours: [
      { id: "orange", gu: "ઓરેંજ", en: "Orange" },
      { id: "dplus", gu: "D+", en: "D+" },
      { id: "green_apple", gu: "ગ્રીન એપલ", en: "Green Apple" }
    ]
  },
  // --- Soap (Ayurvedic/Neem/Kismis) ---
  { id: "soap", gu: "શોપ (આયુર્વેદ, નિમ, ક્રીમી)", en: "Soap (Ayurvedic/Neem/Creamy)", pouch: null, bottle: 30, category: "Other" },
  // --- Fresh Cleaner ---
  { id: "fresh", gu: "ફેસ ક્લીનર - ૧૦૦ ml", en: "Face Cleaner - 100ml", pouch: null, bottle: 25, category: "Other" }, // Corrected bottle: 25
  // --- White Cleaner ---
  { id: "wc1", gu: "વ્હાઇટ ક્લીનર - ૧", en: "White Cleaner - 1", pouch: null, bottle: 18, category: "Other" }, // Corrected bottle: 18
  { id: "wc5", gu: "વ્હાઇટ ક્લીનર - ૫", en: "White Cleaner - 5", pouch: null, bottle: 80, category: "Other" },
  // --- Scrubber ---
  { id: "scrp", gu: "સ્ક્રબર પૅડ", en: "Scrubber Pad", pouch: null, bottle: 10, category: "Other" },
  { id: "scrs", gu: "સ્ટીલ સ્ક્રબર", en: "Steel Scrubber", pouch: null, bottle: 10, category: "Other" },
  // --- Detergent Cake ---
  { id: "dcake", gu: "ડીટરજન્ટ કેક - ૫ નંગ", en: "Detergent Cake - 5 pcs", pouch: null, bottle: 50, category: "Other" }, // Corrected bottle: 50
  // --- Bleach ---
  { id: "bl1", gu: "બ્લીચ - ૧", en: "Bleach - 1", pouch: null, bottle: 40, category: "Other" },
  { id: "bl5", gu: "બ્લીચ - ૫", en: "Bleach - 5", pouch: null, bottle: 175, category: "Other" },
  // --- Bath Liquid Soap ---
  { id: "bls500", gu: "બાથ લીક્વિડ શોપ - ૫૦૦", en: "Bath Liquid Soap - 500ml", pouch: null, bottle: null, category: "Other" },
  { id: "bls1", gu: "બાથ લીક્વિડ શોપ - ૧", en: "Bath Liquid Soap - 1", pouch: null, bottle: null, category: "Other" },
];

export const SECTIONS = [
  { label: "🍽️ ડીશ વોશ / Dish Wash", ids: ["dw1", "dw3", "dw5", "dwm1", "dwm5"] },
  { label: "👕 કલોથ વોશ / Cloth Wash", ids: ["cw1", "cw3", "cw5", "ccw1", "ccw5"] },
  { label: "🚿 બાથ + ફ્લોર / Bath & Floor", ids: ["bc1", "bc3", "bc5", "fc1", "fc3", "fc5"] },
  { label: "🚽 ટોઇલેટ + ગ્લાસ / Toilet & Glass", ids: ["tc500", "tc1", "tc3", "tc5", "gc500", "gc1", "gc3", "gc5"] },
  { label: "🧪 સરફેસ + ડીટ. પાઉડર / Surface & Powder", ids: ["sc1", "sc3", "sc5", "dp1", "dp3", "dp5"] },
  { label: "🧴 અન્ય ઉત્પાદનો / Other Products", ids: ["ls250", "ls1", "ls3", "ls5", "soap", "fresh", "wc1", "wc5", "scrp", "scrs", "dcake", "bl1", "bl5", "combo", "bls500", "bls1"] },
];
