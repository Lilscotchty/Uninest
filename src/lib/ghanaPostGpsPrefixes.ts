export interface GhanaPostDistrict {
  name: string;
  prefix: string;
}

export interface GhanaPostRegion {
  name: string;
  districts: GhanaPostDistrict[];
}

export const ghanaPostRegions: GhanaPostRegion[] = [
  {
    "name": "WESTERN NORTH REGION",
    "districts": [
      { "name": "Aowin", "prefix": "YA" },
      { "name": "Bibiani Anhwiaso Bekwai", "prefix": "YB" },
      { "name": "Bodi", "prefix": "YD" },
      { "name": "Bia East", "prefix": "YE" },
      { "name": "Juaboso", "prefix": "YJ" },
      { "name": "Sefwi Akontombra", "prefix": "YK" },
      { "name": "Sefwi Wiawso", "prefix": "YS" },
      { "name": "Suaman", "prefix": "YU" },
      { "name": "Bia West", "prefix": "YW" }
    ]
  },
  {
    "name": "UPPER WEST REGION",
    "districts": [
      { "name": "Daffiama Bussie Issa", "prefix": "XD" },
      { "name": "Jirapa", "prefix": "XJ" },
      { "name": "Lambussie Karni", "prefix": "XK" },
      { "name": "Lawra", "prefix": "XL" },
      { "name": "Nandom", "prefix": "XN" },
      { "name": "Nadowli Kaleo", "prefix": "XO" },
      { "name": "Sissala East", "prefix": "XS" },
      { "name": "Sissala West", "prefix": "XT" },
      { "name": "Wa", "prefix": "XW" },
      { "name": "Wa East", "prefix": "XX" },
      { "name": "Wa West", "prefix": "XY" }
    ]
  },
  {
    "name": "WESTERN REGION",
    "districts": [
      { "name": "Ellembelle", "prefix": "WE" },
      { "name": "Ahanta West", "prefix": "WH" },
      { "name": "Jomoro", "prefix": "WJ" },
      { "name": "Effia Kwesimintim", "prefix": "WK" },
      { "name": "Mpohor", "prefix": "WM" },
      { "name": "Nzema East", "prefix": "WN" },
      { "name": "Prestea Huni Valley", "prefix": "WP" },
      { "name": "Shama", "prefix": "WR" },
      { "name": "SekondI-Takoradi", "prefix": "WS" },
      { "name": "Tarkwa Nsuaem", "prefix": "WT" },
      { "name": "Wassa Amenfi Central", "prefix": "WW" },
      { "name": "Wassa Amenfi East", "prefix": "WX" },
      { "name": "Wassa Amenfi West", "prefix": "WY" },
      { "name": "Wassa East", "prefix": "WZ" }
    ]
  },
  {
    "name": "VOLTA REGION",
    "districts": [
      { "name": "Adaklu", "prefix": "VA" },
      { "name": "Hohoe", "prefix": "VC" },
      { "name": "North Dayi", "prefix": "VD" },
      { "name": "South Dayi", "prefix": "VE" },
      { "name": "Afadjato South", "prefix": "VF" },
      { "name": "Agotime Ziope", "prefix": "VG" },
      { "name": "Ho", "prefix": "VH" },
      { "name": "Ho West", "prefix": "VI" },
      { "name": "Keta", "prefix": "VK" },
      { "name": "Anloga", "prefix": "VN" },
      { "name": "Kpando", "prefix": "VP" },
      { "name": "North Tongu", "prefix": "VT" },
      { "name": "South Tongu", "prefix": "VU" },
      { "name": "Central Tongu", "prefix": "VV" },
      { "name": "Akatsi North", "prefix": "VW" },
      { "name": "Akatsi South", "prefix": "VX" },
      { "name": "Ketu North", "prefix": "VY" },
      { "name": "Ketu South", "prefix": "VZ" }
    ]
  },
  {
    "name": "UPPER EAST REGION",
    "districts": [
      { "name": "Bawku", "prefix": "UA" },
      { "name": "Bolgatanga", "prefix": "UB" },
      { "name": "Bolgatanga East", "prefix": "UE" },
      { "name": "Garu", "prefix": "UG" },
      { "name": "Kassena Nankana East", "prefix": "UK" },
      { "name": "Kassena Nankana West", "prefix": "UL" },
      { "name": "Tempane", "prefix": "UM" },
      { "name": "Nabdam", "prefix": "UN" },
      { "name": "Bongo", "prefix": "UO" },
      { "name": "Pusiga", "prefix": "UP" },
      { "name": "Builsa North", "prefix": "UR" },
      { "name": "Builsa South", "prefix": "US" },
      { "name": "Talensi", "prefix": "UT" },
      { "name": "Binduri", "prefix": "UU" },
      { "name": "Bawku West", "prefix": "UW" }
    ]
  },
  {
    "name": "BONO EAST REGION",
    "districts": [
      { "name": "Atebubu-Amantin", "prefix": "TA" },
      { "name": "Sene East", "prefix": "TE" },
      { "name": "Kintampo North", "prefix": "TK" },
      { "name": "Kintampo South", "prefix": "TL" },
      { "name": "Nkoranza North", "prefix": "TN" },
      { "name": "Nkoranza South", "prefix": "TO" },
      { "name": "Pru East", "prefix": "TP" },
      { "name": "Sene West", "prefix": "TS" },
      { "name": "Techiman", "prefix": "TT" },
      { "name": "Pru West", "prefix": "TW" },
      { "name": "Techiman North", "prefix": "TX" }
    ]
  },
  {
    "name": "SAVANNAH REGION",
    "districts": [
      { "name": "BOLE", "prefix": "SB" },
      { "name": "EAST GONJA", "prefix": "SE" },
      { "name": "CENTRAL GONJA", "prefix": "SG" },
      { "name": "North East Gonja", "prefix": "SJ" },
      { "name": "NORTH GONJA", "prefix": "SN" },
      { "name": "Sawla Tuna Kalba", "prefix": "SS" },
      { "name": "WEST GONJA", "prefix": "SW" }
    ]
  },
  {
    "name": "OTI REGION",
    "districts": [
      { "name": "Biakoye", "prefix": "OB" },
      { "name": "Krachi East", "prefix": "OE" },
      { "name": "Guan", "prefix": "OG" },
      { "name": "Jasikan", "prefix": "OJ" },
      { "name": "Kadjebi", "prefix": "OK" },
      { "name": "Nkwanta North", "prefix": "ON" },
      { "name": "Krachi Nchumuru", "prefix": "OQ" },
      { "name": "Nkwanta South", "prefix": "OS" },
      { "name": "Krachi West", "prefix": "OW" }
    ]
  },
  {
    "name": "NORTHERN REGION",
    "districts": [
      { "name": "Kpandai", "prefix": "NA" },
      { "name": "Tatale Sangule", "prefix": "NF" },
      { "name": "Gushiegu", "prefix": "NG" },
      { "name": "Mion", "prefix": "NI" },
      { "name": "Kumbungu", "prefix": "NK" },
      { "name": "Tolon", "prefix": "NL" },
      { "name": "Nanumba North", "prefix": "NN" },
      { "name": "Nanumba South", "prefix": "NO" },
      { "name": "Karaga", "prefix": "NR" },
      { "name": "Sagnerigu", "prefix": "NS" },
      { "name": "Tamale", "prefix": "NT" },
      { "name": "Nanton", "prefix": "NU" },
      { "name": "Savelugu", "prefix": "NV" },
      { "name": "Saboba", "prefix": "NX" },
      { "name": "Yendi", "prefix": "NY" },
      { "name": "Zabzugu", "prefix": "NZ" }
    ]
  },
  {
    "name": "NORTH EAST REGION",
    "districts": [
      { "name": "Chereponi", "prefix": "MC" },
      { "name": "East Mamprusi", "prefix": "ME" },
      { "name": "Mamprugu Moaduri", "prefix": "MM" },
      { "name": "Bunkpurugu Nakpanduri", "prefix": "MP" },
      { "name": "West Mamprusi", "prefix": "MW" },
      { "name": "Yunyoo Nasuan", "prefix": "MY" }
    ]
  },
  {
    "name": "AHAFO REGION",
    "districts": [
      { "name": "Asunafo North", "prefix": "HA" },
      { "name": "Asunafo South", "prefix": "HB" },
      { "name": "Asutifi North", "prefix": "HQ" },
      { "name": "Asutifi South", "prefix": "HR" },
      { "name": "Tano South", "prefix": "HS" },
      { "name": "Tano North", "prefix": "HT" }
    ]
  },
  {
    "name": "GREATER ACCRA REGION",
    "districts": [
      { "name": "Ayawaso Central", "prefix": "G2" },
      { "name": "Ayawaso North", "prefix": "G3" },
      { "name": "Ayawaso West", "prefix": "G4" },
      { "name": "Krowor", "prefix": "G6" },
      { "name": "Ablekuma Central", "prefix": "G7" },
      { "name": "Accra", "prefix": "GA" },
      { "name": "Ashaiman", "prefix": "GB" },
      { "name": "Ga Central", "prefix": "GC" },
      { "name": "Adentan", "prefix": "GD" },
      { "name": "Ga East", "prefix": "GE" },
      { "name": "Ablekuma North", "prefix": "GF" },
      { "name": "Ga North", "prefix": "GG" },
      { "name": "Okaikwei North", "prefix": "GI" },
      { "name": "Weija Gbawe", "prefix": "GJ" },
      { "name": "Kpone Katamanso", "prefix": "GK" },
      { "name": "La Dade Kotopon", "prefix": "GL" },
      { "name": "La Nkwantanang Madina", "prefix": "GM" },
      { "name": "Ningo Prampram", "prefix": "GN" },
      { "name": "ShaI-Osudoku", "prefix": "GO" },
      { "name": "Tema West", "prefix": "GQ" },
      { "name": "Korle Klottey", "prefix": "GR" },
      { "name": "Ga South", "prefix": "GS" },
      { "name": "Tema", "prefix": "GT" },
      { "name": "Ablekuma West", "prefix": "GU" },
      { "name": "Ayawaso East", "prefix": "GV" },
      { "name": "Ga West", "prefix": "GW" },
      { "name": "Ada West", "prefix": "GX" },
      { "name": "Ada East", "prefix": "GY" },
      { "name": "Ledzokuku", "prefix": "GZ" }
    ]
  },
  {
    "name": "EASTERN REGION",
    "districts": [
      { "name": "Akuapem North", "prefix": "E2" },
      { "name": "Akuapem South", "prefix": "E3" },
      { "name": "Abuakwa North", "prefix": "E4" },
      { "name": "Abuakwa South", "prefix": "E5" },
      { "name": "Fanteakwa South", "prefix": "E6" },
      { "name": "New Juaben North", "prefix": "E7" },
      { "name": "Asene Manso Akroso", "prefix": "E8" },
      { "name": "Atiwa East", "prefix": "E9" },
      { "name": "Asuogyaman", "prefix": "EA" },
      { "name": "Birim Central", "prefix": "EB" },
      { "name": "Achiase", "prefix": "EC" },
      { "name": "Denkyembour", "prefix": "ED" },
      { "name": "Fanteakwa North", "prefix": "EF" },
      { "name": "Nsawam Adoagyiri", "prefix": "EG" },
      { "name": "Kwahu East", "prefix": "EH" },
      { "name": "Kwahu South", "prefix": "EI" },
      { "name": "Kwahu West", "prefix": "EJ" },
      { "name": "Kwaebibirem", "prefix": "EK" },
      { "name": "Lower Manya Krobo", "prefix": "EL" },
      { "name": "Akyemansa", "prefix": "EM" },
      { "name": "New Juaben South", "prefix": "EN" },
      { "name": "Ayensuano", "prefix": "EO" },
      { "name": "Kwahu Afram Plains North", "prefix": "EP" },
      { "name": "Kwahu Afram Plains South", "prefix": "EQ" },
      { "name": "Okere", "prefix": "ER" },
      { "name": "Suhum", "prefix": "ES" },
      { "name": "Atiwa West", "prefix": "ET" },
      { "name": "Upper Manya Krobo", "prefix": "EU" },
      { "name": "Upper West Akim", "prefix": "EV" },
      { "name": "West Akim", "prefix": "EW" },
      { "name": "Birim North", "prefix": "EX" },
      { "name": "Yilo Krobo", "prefix": "EY" },
      { "name": "Birim South", "prefix": "EZ" }
    ]
  },
  {
    "name": "CENTRAL REGION",
    "districts": [
      { "name": "Abura Asebu Kwamankese", "prefix": "CA" },
      { "name": "Asikuma / Odoben / Brakwa", "prefix": "CB" },
      { "name": "Cape Coast", "prefix": "CC" },
      { "name": "Effutu", "prefix": "CE" },
      { "name": "Ekumfi", "prefix": "CF" },
      { "name": "Gomoa East", "prefix": "CG" },
      { "name": "Hemang Lower Denkyira", "prefix": "CH" },
      { "name": "Gomoa West", "prefix": "CI" },
      { "name": "Ajumako Enyan Esiam", "prefix": "CJ" },
      { "name": "Komenda Edina Eguafo", "prefix": "CK" },
      { "name": "Gomoa Central", "prefix": "CL" },
      { "name": "Mfantseman", "prefix": "CM" },
      { "name": "Assin Central", "prefix": "CN" },
      { "name": "Agona West", "prefix": "CO" },
      { "name": "Agona East", "prefix": "CP" },
      { "name": "Assin North", "prefix": "CR" },
      { "name": "Assin South", "prefix": "CS" },
      { "name": "Twifo Ati-Morkwa", "prefix": "CT" },
      { "name": "Upper Denkyira East", "prefix": "CU" },
      { "name": "Upper Denkyira West", "prefix": "CV" },
      { "name": "Awutu Senya West", "prefix": "CW" },
      { "name": "Awutu Senya East", "prefix": "CX" }
    ]
  },
  {
    "name": "BONO REGION",
    "districts": [
      { "name": "Banda", "prefix": "BA" },
      { "name": "Berekum East", "prefix": "BB" },
      { "name": "Berekum West", "prefix": "BC" },
      { "name": "Dormaa Central", "prefix": "BD" },
      { "name": "Dormaa East", "prefix": "BE" },
      { "name": "Dormaa West", "prefix": "BF" },
      { "name": "Jaman South", "prefix": "BI" },
      { "name": "Jaman North", "prefix": "BJ" },
      { "name": "Sunyani", "prefix": "BS" },
      { "name": "Wenchi", "prefix": "BW" },
      { "name": "Sunyani West", "prefix": "BY" },
      { "name": "Tain", "prefix": "BZ" }
    ]
  },
  {
    "name": "ASHANTI REGION",
    "districts": [
      { "name": "Adansi North", "prefix": "A2" },
      { "name": "Adansi South", "prefix": "A3" },
      { "name": "Bosome Freho", "prefix": "A4" },
      { "name": "Adansi Asokwa", "prefix": "A5" },
      { "name": "Offinso North", "prefix": "A6" },
      { "name": "Offinso South", "prefix": "A7" },
      { "name": "Ahafo Ano South East", "prefix": "A8" },
      { "name": "Asante Akim South", "prefix": "AA" },
      { "name": "Akrofuom", "prefix": "AAF" },
      { "name": "Afigya Kwabre North", "prefix": "AAK" },
      { "name": "Amansie South", "prefix": "AAM" },
      { "name": "Asokwa", "prefix": "AAS" },
      { "name": "Atwima Nwabiagya North", "prefix": "AAT" },
      { "name": "Bekwai", "prefix": "AB" },
      { "name": "Asante Akim Central", "prefix": "AC" },
      { "name": "Kwabre East", "prefix": "AD" },
      { "name": "Ejisu", "prefix": "AE" },
      { "name": "Afigya Kwabre", "prefix": "AF" },
      { "name": "Atwima Kwanwoma", "prefix": "AG" },
      { "name": "Atwima Nwabiagya", "prefix": "AH" },
      { "name": "Atwima Mponua", "prefix": "AI" },
      { "name": "Ejura-Sekyedumase", "prefix": "AJ" },
      { "name": "Kumasi", "prefix": "AK" },
      { "name": "Kwadaso", "prefix": "AKW" },
      { "name": "Juaben", "prefix": "AL" },
      { "name": "Mampong", "prefix": "AM" },
      { "name": "Asante Akim North", "prefix": "AN" },
      { "name": "Obuasi", "prefix": "AO" },
      { "name": "Obuasi East", "prefix": "AOE" },
      { "name": "Oforikrom", "prefix": "AOK" },
      { "name": "Old Tafo", "prefix": "AOT" },
      { "name": "Sekyere Afram Plains", "prefix": "AP" },
      { "name": "Sekyere Central", "prefix": "AQ" },
      { "name": "Sekyere East", "prefix": "AR" },
      { "name": "Asokore Mampong", "prefix": "AS" },
      { "name": "Suame", "prefix": "ASU" },
      { "name": "BOSOMTWE", "prefix": "AT" },
      { "name": "Sekyere Kumawu", "prefix": "AU" },
      { "name": "Amansie Central", "prefix": "AV" },
      { "name": "Amansie West", "prefix": "AW" },
      { "name": "Ahafo Ano North", "prefix": "AX" },
      { "name": "Ahafo Ano South West", "prefix": "AY" },
      { "name": "Sekyere South", "prefix": "AZ" }
    ]
  }
];

export const allGhanaPostPrefixes = ghanaPostRegions.flatMap(r => r.districts.map(d => d.prefix));
export const prefixToDistrictMap = ghanaPostRegions.reduce((acc, region) => {
  region.districts.forEach(district => {
    acc[district.prefix] = { region: region.name, district: district.name };
  });
  return acc;
}, {} as Record<string, { region: string; district: string }>);
