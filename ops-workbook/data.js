window.OPS_DATA = {
  "meta": {
    "as_of": "2026-10-15",
    "brand": "Northfield Nutrition (fictional)",
    "currency": "USD"
  },
  "kpis": {
    "skus": 12,
    "below_reorder": 4,
    "open_pos": 5,
    "overdue_pos": 2,
    "expiring_30": 3,
    "expiring_60": 2,
    "expiring_90": 3,
    "exceptions": 11,
    "open_tasks": 9
  },
  "stock": [
    {
      "sku": "WPI-CHO-2LB",
      "name": "Whey Protein Isolate, Chocolate, 2 lb",
      "opening": 1240,
      "receipts": 1500,
      "shipments": 2305,
      "adjustments": -6,
      "recorded": 429,
      "reserved": 120,
      "available": 309,
      "reorder_point": 600,
      "reorder_qty": 1500,
      "status": "Below reorder"
    },
    {
      "sku": "WPI-VAN-2LB",
      "name": "Whey Protein Isolate, Vanilla, 2 lb",
      "opening": 846,
      "receipts": 600,
      "shipments": 638,
      "adjustments": 0,
      "recorded": 808,
      "reserved": 0,
      "available": 208,
      "reorder_point": 450,
      "reorder_qty": 1200,
      "status": "Below reorder"
    },
    {
      "sku": "WPI-CHO-5LB",
      "name": "Whey Protein Isolate, Chocolate, 5 lb",
      "opening": 467,
      "receipts": 0,
      "shipments": 203,
      "adjustments": 0,
      "recorded": 264,
      "reserved": 0,
      "available": 264,
      "reorder_point": 150,
      "reorder_qty": 400,
      "status": "OK"
    },
    {
      "sku": "PLT-CHO-2LB",
      "name": "Plant Protein, Chocolate, 2 lb",
      "opening": 850,
      "receipts": 0,
      "shipments": 451,
      "adjustments": -3,
      "recorded": 396,
      "reserved": 0,
      "available": 396,
      "reorder_point": 250,
      "reorder_qty": 600,
      "status": "OK"
    },
    {
      "sku": "PLT-VAN-2LB",
      "name": "Plant Protein, Vanilla, 2 lb",
      "opening": 407,
      "receipts": 0,
      "shipments": 274,
      "adjustments": 0,
      "recorded": 133,
      "reserved": 0,
      "available": 133,
      "reorder_point": 200,
      "reorder_qty": 500,
      "status": "Below reorder"
    },
    {
      "sku": "BAR-PBC-12",
      "name": "Protein Bar, Peanut Butter Chocolate, 12-pack",
      "opening": 2288,
      "receipts": 2400,
      "shipments": 1944,
      "adjustments": 0,
      "recorded": 2744,
      "reserved": 200,
      "available": 2544,
      "reorder_point": 900,
      "reorder_qty": 2400,
      "status": "OK"
    },
    {
      "sku": "BAR-CKD-12",
      "name": "Protein Bar, Cookie Dough, 12-pack",
      "opening": 1889,
      "receipts": 1500,
      "shipments": 1581,
      "adjustments": -60,
      "recorded": 1748,
      "reserved": 150,
      "available": 1562,
      "reorder_point": 700,
      "reorder_qty": 1500,
      "status": "OK"
    },
    {
      "sku": "CRE-UNF-300G",
      "name": "Creatine Monohydrate, Unflavoured, 300 g",
      "opening": 980,
      "receipts": 1000,
      "shipments": 865,
      "adjustments": 4,
      "recorded": 1119,
      "reserved": 0,
      "available": 1119,
      "reorder_point": 400,
      "reorder_qty": 1000,
      "status": "OK"
    },
    {
      "sku": "CRE-UNF-500G",
      "name": "Creatine Monohydrate, Unflavoured, 500 g",
      "opening": 640,
      "receipts": 0,
      "shipments": 350,
      "adjustments": 0,
      "recorded": 290,
      "reserved": 80,
      "available": 210,
      "reorder_point": 250,
      "reorder_qty": 700,
      "status": "Below reorder"
    },
    {
      "sku": "PRE-BRZ-30",
      "name": "Pre-Workout, Blue Raspberry, 30 servings",
      "opening": 746,
      "receipts": 800,
      "shipments": 671,
      "adjustments": 0,
      "recorded": 875,
      "reserved": 0,
      "available": 875,
      "reorder_point": 300,
      "reorder_qty": 800,
      "status": "OK"
    },
    {
      "sku": "PRE-WTM-30",
      "name": "Pre-Workout, Watermelon, 30 servings",
      "opening": 626,
      "receipts": 0,
      "shipments": 374,
      "adjustments": -24,
      "recorded": 228,
      "reserved": 0,
      "available": 228,
      "reorder_point": 200,
      "reorder_qty": 600,
      "status": "OK"
    },
    {
      "sku": "CAS-CHO-2LB",
      "name": "Micellar Casein, Chocolate, 2 lb",
      "opening": 423,
      "receipts": 0,
      "shipments": 223,
      "adjustments": 0,
      "recorded": 200,
      "reserved": 0,
      "available": 200,
      "reorder_point": 200,
      "reorder_qty": 360,
      "status": "OK"
    }
  ],
  "reconciliation": {
    "sku": "WPI-CHO-2LB",
    "name": "Whey Protein Isolate, Chocolate, 2 lb",
    "opening": 1240,
    "rows": [
      {
        "date": "2026-07-18",
        "type": "Adjustment",
        "qty": -6,
        "ref": "CC-0718",
        "batch": "WCH2502A",
        "note": "Damaged in warehouse: Six tubs crushed on a pallet"
      },
      {
        "date": "2026-07-24",
        "type": "Receipt",
        "qty": 1500,
        "ref": "PO-2026-018",
        "batch": "WCH2607A",
        "note": "Received against PO-2026-018"
      },
      {
        "date": "2026-07-31",
        "type": "Shipment",
        "qty": -534,
        "ref": "OB-2607",
        "batch": "WCH2502A",
        "note": "July outbound summary (FEFO)"
      },
      {
        "date": "2026-07-31",
        "type": "Shipment",
        "qty": -224,
        "ref": "OB-2607",
        "batch": "WCH2504A",
        "note": "July outbound summary (FEFO)"
      },
      {
        "date": "2026-08-31",
        "type": "Shipment",
        "qty": -476,
        "ref": "OB-2608",
        "batch": "WCH2504A",
        "note": "August outbound summary (FEFO)"
      },
      {
        "date": "2026-08-31",
        "type": "Shipment",
        "qty": -182,
        "ref": "OB-2608",
        "batch": "WCH2607A",
        "note": "August outbound summary (FEFO)"
      },
      {
        "date": "2026-09-30",
        "type": "Shipment",
        "qty": -697,
        "ref": "OB-2609",
        "batch": "WCH2607A",
        "note": "September outbound summary (FEFO)"
      },
      {
        "date": "2026-10-08",
        "type": "Shipment",
        "qty": -192,
        "ref": "OB-2610",
        "batch": "WCH2607A",
        "note": "October 1-8 outbound summary (FEFO)"
      }
    ],
    "recorded": 429
  },
  "pos": [
    {
      "po": "PO-2026-018",
      "supplier": "Alder Creek Dairy Proteins",
      "sku": "WPI-CHO-2LB",
      "qty": 1500,
      "ordered": "2026-06-12",
      "expected": "2026-07-22",
      "status": "Received",
      "overdue": false,
      "days_late": 0
    },
    {
      "po": "PO-2026-021",
      "supplier": "Bramwell Bar Works",
      "sku": "BAR-PBC-12",
      "qty": 2400,
      "ordered": "2026-07-08",
      "expected": "2026-08-10",
      "status": "Received",
      "overdue": false,
      "days_late": 0
    },
    {
      "po": "PO-2026-022",
      "supplier": "Dunmore Powder Labs",
      "sku": "CRE-UNF-300G",
      "qty": 1000,
      "ordered": "2026-07-20",
      "expected": "2026-08-27",
      "status": "Received",
      "overdue": false,
      "days_late": 0
    },
    {
      "po": "PO-2026-024",
      "supplier": "Bramwell Bar Works",
      "sku": "BAR-CKD-12",
      "qty": 1500,
      "ordered": "2026-08-05",
      "expected": "2026-09-08",
      "status": "Received",
      "overdue": false,
      "days_late": 0
    },
    {
      "po": "PO-2026-025",
      "supplier": "Dunmore Powder Labs",
      "sku": "PRE-BRZ-30",
      "qty": 800,
      "ordered": "2026-08-14",
      "expected": "2026-09-15",
      "status": "Received",
      "overdue": false,
      "days_late": 0
    },
    {
      "po": "PO-2026-029",
      "supplier": "Corliss Plant Proteins",
      "sku": "PLT-VAN-2LB",
      "qty": 500,
      "ordered": "2026-09-01",
      "expected": "2026-10-06",
      "status": "Confirmed",
      "overdue": true,
      "days_late": 9
    },
    {
      "po": "PO-2026-028",
      "supplier": "Corliss Plant Proteins",
      "sku": "PLT-CHO-2LB",
      "qty": 600,
      "ordered": "2026-08-28",
      "expected": "2026-10-09",
      "status": "Cancelled",
      "overdue": false,
      "days_late": 0
    },
    {
      "po": "PO-2026-031",
      "supplier": "Dunmore Powder Labs",
      "sku": "PRE-WTM-30",
      "qty": 600,
      "ordered": "2026-09-04",
      "expected": "2026-10-10",
      "status": "In transit",
      "overdue": true,
      "days_late": 5
    },
    {
      "po": "PO-2026-030",
      "supplier": "Alder Creek Dairy Proteins",
      "sku": "WPI-CHO-2LB",
      "qty": 1500,
      "ordered": "2026-09-15",
      "expected": "2026-10-20",
      "status": "In transit",
      "overdue": false,
      "days_late": 0
    },
    {
      "po": "PO-2026-027",
      "supplier": "Alder Creek Dairy Proteins",
      "sku": "WPI-VAN-2LB",
      "qty": 1200,
      "ordered": "2026-09-02",
      "expected": "2026-10-29",
      "status": "Partially received",
      "overdue": false,
      "days_late": 0
    },
    {
      "po": "PO-2026-032",
      "supplier": "Elmstead Co-Packing",
      "sku": "CAS-CHO-2LB",
      "qty": 360,
      "ordered": "2026-10-05",
      "expected": "2026-11-19",
      "status": "Ordered",
      "overdue": false,
      "days_late": 0
    },
    {
      "po": "PO-2026-034",
      "supplier": "Dunmore Powder Labs",
      "sku": "CRE-UNF-500G",
      "qty": 700,
      "ordered": "2026-10-14",
      "expected": "2026-11-25",
      "status": "Draft",
      "overdue": false,
      "days_late": 0
    }
  ],
  "batches": [
    {
      "lot": "CKD2510A",
      "sku": "BAR-CKD-12",
      "name": "Protein Bar, Cookie Dough, 12-pack",
      "qty": 36,
      "expiry": "2026-10-02",
      "days_left": -13,
      "window": "Expired"
    },
    {
      "lot": "PBC2511A",
      "sku": "BAR-PBC-12",
      "name": "Protein Bar, Peanut Butter Chocolate, 12-pack",
      "qty": 344,
      "expiry": "2026-10-31",
      "days_left": 16,
      "window": "<=30"
    },
    {
      "lot": "CKD2511A",
      "sku": "BAR-CKD-12",
      "name": "Protein Bar, Cookie Dough, 12-pack",
      "qty": 212,
      "expiry": "2026-11-08",
      "days_left": 24,
      "window": "<=30"
    },
    {
      "lot": "PVA2411A",
      "sku": "PLT-VAN-2LB",
      "name": "Plant Protein, Vanilla, 2 lb",
      "qty": 53,
      "expiry": "2026-11-14",
      "days_left": 30,
      "window": "<=30"
    },
    {
      "lot": "WVA2411A",
      "sku": "WPI-VAN-2LB",
      "name": "Whey Protein Isolate, Vanilla, 2 lb",
      "qty": 48,
      "expiry": "2026-11-27",
      "days_left": 43,
      "window": "31-60"
    },
    {
      "lot": "CCA2412A",
      "sku": "CAS-CHO-2LB",
      "name": "Micellar Casein, Chocolate, 2 lb",
      "qty": 80,
      "expiry": "2026-12-10",
      "days_left": 56,
      "window": "31-60"
    },
    {
      "lot": "PCH2412A",
      "sku": "PLT-CHO-2LB",
      "name": "Plant Protein, Chocolate, 2 lb",
      "qty": 136,
      "expiry": "2026-12-22",
      "days_left": 68,
      "window": "61-90"
    },
    {
      "lot": "PBZ2501A",
      "sku": "PRE-BRZ-30",
      "name": "Pre-Workout, Blue Raspberry, 30 servings",
      "qty": 75,
      "expiry": "2027-01-05",
      "days_left": 82,
      "window": "61-90"
    },
    {
      "lot": "W5C2501A",
      "sku": "WPI-CHO-5LB",
      "name": "Whey Protein Isolate, Chocolate, 5 lb",
      "qty": 104,
      "expiry": "2027-01-12",
      "days_left": 89,
      "window": "61-90"
    },
    {
      "lot": "WVA2503A",
      "sku": "WPI-VAN-2LB",
      "name": "Whey Protein Isolate, Vanilla, 2 lb",
      "qty": 160,
      "expiry": "2027-03-05",
      "days_left": 141,
      "window": ">90"
    },
    {
      "lot": "PWM2504A",
      "sku": "PRE-WTM-30",
      "name": "Pre-Workout, Watermelon, 30 servings",
      "qty": 228,
      "expiry": "2027-04-15",
      "days_left": 182,
      "window": ">90"
    },
    {
      "lot": "CCA2505A",
      "sku": "CAS-CHO-2LB",
      "name": "Micellar Casein, Chocolate, 2 lb",
      "qty": 120,
      "expiry": "2027-05-06",
      "days_left": 203,
      "window": ">90"
    },
    {
      "lot": "PVA2505A",
      "sku": "PLT-VAN-2LB",
      "name": "Plant Protein, Vanilla, 2 lb",
      "qty": 80,
      "expiry": "2027-05-12",
      "days_left": 209,
      "window": ">90"
    },
    {
      "lot": "W5C2505A",
      "sku": "WPI-CHO-5LB",
      "name": "Whey Protein Isolate, Chocolate, 5 lb",
      "qty": 160,
      "expiry": "2027-05-20",
      "days_left": 217,
      "window": ">90"
    },
    {
      "lot": "PCH2506A",
      "sku": "PLT-CHO-2LB",
      "name": "Plant Protein, Chocolate, 2 lb",
      "qty": 260,
      "expiry": "2027-06-18",
      "days_left": 246,
      "window": ">90"
    },
    {
      "lot": "PBC2607A",
      "sku": "BAR-PBC-12",
      "name": "Protein Bar, Peanut Butter Chocolate, 12-pack",
      "qty": 2400,
      "expiry": "2027-07-27",
      "days_left": 285,
      "window": ">90"
    },
    {
      "lot": "CKD2608A",
      "sku": "BAR-CKD-12",
      "name": "Protein Bar, Cookie Dough, 12-pack",
      "qty": 1500,
      "expiry": "2027-08-24",
      "days_left": 313,
      "window": ">90"
    },
    {
      "lot": "CRL2504A",
      "sku": "CRE-UNF-500G",
      "name": "Creatine Monohydrate, Unflavoured, 500 g",
      "qty": 290,
      "expiry": "2028-04-21",
      "days_left": 554,
      "window": ">90"
    },
    {
      "lot": "CRT2505A",
      "sku": "CRE-UNF-300G",
      "name": "Creatine Monohydrate, Unflavoured, 300 g",
      "qty": 119,
      "expiry": "2028-05-13",
      "days_left": 576,
      "window": ">90"
    },
    {
      "lot": "WCH2607A",
      "sku": "WPI-CHO-2LB",
      "name": "Whey Protein Isolate, Chocolate, 2 lb",
      "qty": 429,
      "expiry": "2028-07-09",
      "days_left": 633,
      "window": ">90"
    },
    {
      "lot": "PBZ2609A",
      "sku": "PRE-BRZ-30",
      "name": "Pre-Workout, Blue Raspberry, 30 servings",
      "qty": 800,
      "expiry": "2028-09-01",
      "days_left": 687,
      "window": ">90"
    },
    {
      "lot": "WVA2609A",
      "sku": "WPI-VAN-2LB",
      "name": "Whey Protein Isolate, Vanilla, 2 lb",
      "qty": 600,
      "expiry": "2028-09-24",
      "days_left": 710,
      "window": ">90"
    },
    {
      "lot": "CRT2608A",
      "sku": "CRE-UNF-300G",
      "name": "Creatine Monohydrate, Unflavoured, 300 g",
      "qty": 1000,
      "expiry": "2029-08-11",
      "days_left": 1031,
      "window": ">90"
    }
  ],
  "import_check": {
    "file": "warehouse-movements-2026-10-14.csv",
    "columns": [
      "movement_id",
      "date",
      "type",
      "sku",
      "supplier_id",
      "lot",
      "expiry",
      "qty",
      "lot_status",
      "reason",
      "reference",
      "source_link"
    ],
    "rows": [
      {
        "row": 2,
        "values": {
          "movement_id": "MV-2610-014",
          "date": "2026-10-09",
          "type": "Shipment",
          "sku": "WPI-CHO-2LB",
          "supplier_id": "",
          "lot": "WCH2607A",
          "expiry": "",
          "qty": "64",
          "lot_status": "",
          "reason": "",
          "reference": "OB-1009",
          "source_link": "https://example.com/3pl/movements/MV-2610-014"
        }
      },
      {
        "row": 3,
        "values": {
          "movement_id": "MV-2610-015",
          "date": "2026-10-10",
          "type": "Shipment",
          "sku": "BAR-PBC-12",
          "supplier_id": "",
          "lot": "PBC2511A",
          "expiry": "",
          "qty": "120",
          "lot_status": "",
          "reason": "",
          "reference": "OB-1010",
          "source_link": "https://example.com/3pl/movements/MV-2610-015"
        }
      },
      {
        "row": 4,
        "values": {
          "movement_id": "MV-2610-016",
          "date": "2026-10-12",
          "type": "Shipment",
          "sku": "CRE-UNF-300G",
          "supplier_id": "",
          "lot": "CRT2505A",
          "expiry": "",
          "qty": "75",
          "lot_status": "",
          "reason": "",
          "reference": "OB-1012",
          "source_link": "https://example.com/3pl/movements/MV-2610-016"
        }
      },
      {
        "row": 5,
        "values": {
          "movement_id": "MV-2610-017",
          "date": "2026-10-13",
          "type": "Receipt",
          "sku": "PRE-WTM-30",
          "supplier_id": "SUP-04",
          "lot": "PWM2609A",
          "expiry": "2028-09-28",
          "qty": "600",
          "lot_status": "Quarantine",
          "reason": "",
          "reference": "PO-2026-031",
          "source_link": "https://example.com/3pl/movements/MV-2610-017"
        }
      },
      {
        "row": 6,
        "values": {
          "movement_id": "MV-2610-017",
          "date": "2026-10-13",
          "type": "Shipment",
          "sku": "PRE-BRZ-30",
          "supplier_id": "",
          "lot": "PBZ2501A",
          "expiry": "",
          "qty": "40",
          "lot_status": "",
          "reason": "",
          "reference": "OB-1013",
          "source_link": "https://example.com/3pl/movements/MV-2610-017-b"
        }
      },
      {
        "row": 7,
        "values": {
          "movement_id": "MV-2610-004",
          "date": "2026-10-08",
          "type": "Shipment",
          "sku": "WPI-CHO-5LB",
          "supplier_id": "",
          "lot": "W5C2501A",
          "expiry": "",
          "qty": "16",
          "lot_status": "",
          "reason": "",
          "reference": "OB-2610",
          "source_link": "https://example.com/3pl/outbound/2026-10"
        }
      },
      {
        "row": 8,
        "values": {
          "movement_id": "MV-2610-018",
          "date": "2026-10-13",
          "type": "Shipment",
          "sku": "WPI-STR-2LB",
          "supplier_id": "",
          "lot": "WST2608A",
          "expiry": "",
          "qty": "30",
          "lot_status": "",
          "reason": "",
          "reference": "OB-1013",
          "source_link": "https://example.com/3pl/movements/MV-2610-018"
        }
      },
      {
        "row": 9,
        "values": {
          "movement_id": "MV-2610-019",
          "date": "2026-10-14",
          "type": "Receipt",
          "sku": "CAS-CHO-2LB",
          "supplier_id": "SUP-09",
          "lot": "CCA2610A",
          "expiry": "2028-02-30",
          "qty": "360",
          "lot_status": "Released",
          "reason": "",
          "reference": "PO-2026-032",
          "source_link": "https://example.com/3pl/movements/MV-2610-019"
        }
      },
      {
        "row": 10,
        "values": {
          "movement_id": "MV-2610-020",
          "date": "2026-09-31",
          "type": "Shipment",
          "sku": "PLT-VAN-2LB",
          "supplier_id": "",
          "lot": "PVA2411A",
          "expiry": "",
          "qty": "25",
          "lot_status": "",
          "reason": "",
          "reference": "OB-0931",
          "source_link": "https://example.com/3pl/movements/MV-2610-020"
        }
      },
      {
        "row": 11,
        "values": {
          "movement_id": "MV-2610-021",
          "date": "2026-10-14",
          "type": "Adjustment",
          "sku": "CRE-UNF-500G",
          "supplier_id": "",
          "lot": "CRL2504A",
          "expiry": "",
          "qty": "-900",
          "lot_status": "",
          "reason": "Cycle count",
          "reference": "CC-1014",
          "source_link": "https://example.com/3pl/movements/MV-2610-021"
        }
      },
      {
        "row": 12,
        "values": {
          "movement_id": "MV-2610-022",
          "date": "2026-10-14",
          "type": "Receipt",
          "sku": "PLT-VAN-2LB",
          "supplier_id": "SUP-03",
          "lot": "PVA2609A",
          "expiry": "2028-09-17",
          "qty": "500",
          "lot_status": "Approved",
          "reason": "",
          "reference": "PO-2026-029",
          "source_link": "https://example.com/3pl/movements/MV-2610-022"
        }
      },
      {
        "row": 13,
        "values": {
          "movement_id": "MV-2610-023",
          "date": "2026-10-14",
          "type": "Shipment",
          "sku": "PRE-BRZ-30",
          "supplier_id": "",
          "lot": "PBZ2501A",
          "expiry": "",
          "qty": "55",
          "lot_status": "",
          "reason": "",
          "reference": "OB-1014",
          "source_link": ""
        }
      },
      {
        "row": 14,
        "values": {
          "movement_id": "MV-2610-024",
          "date": "2026-10-14",
          "type": "Shipment",
          "sku": "PLT-CHO-2LB",
          "supplier_id": "",
          "lot": "",
          "expiry": "",
          "qty": "30",
          "lot_status": "",
          "reason": "",
          "reference": "OB-1014",
          "source_link": "https://example.com/3pl/movements/MV-2610-024"
        }
      },
      {
        "row": 15,
        "values": {
          "movement_id": "MV-2610-025",
          "date": "2026-10-14",
          "type": "Shipment",
          "sku": "BAR-CKD-12",
          "supplier_id": "",
          "lot": "CKD2511A",
          "expiry": "",
          "qty": "96",
          "lot_status": "",
          "reason": "",
          "reference": "OB-1014",
          "source_link": "https://example.com/3pl/movements/MV-2610-025"
        }
      },
      {
        "row": 16,
        "values": {
          "movement_id": "MV-2610-026",
          "date": "2026-10-14",
          "type": "Adjustment",
          "sku": "WPI-CHO-5LB",
          "supplier_id": "",
          "lot": "W5C2501A",
          "expiry": "",
          "qty": "-3",
          "lot_status": "",
          "reason": "Damaged in warehouse",
          "reference": "CC-1014",
          "source_link": "https://example.com/3pl/movements/MV-2610-026"
        }
      },
      {
        "row": 17,
        "values": {
          "movement_id": "MV-2610-027",
          "date": "2026-10-14",
          "type": "Shipment",
          "sku": "CAS-CHO-2LB",
          "supplier_id": "",
          "lot": "CCA2412A",
          "expiry": "",
          "qty": "18",
          "lot_status": "",
          "reason": "",
          "reference": "OB-1014",
          "source_link": "https://example.com/3pl/movements/MV-2610-027"
        }
      },
      {
        "row": 18,
        "values": {
          "movement_id": "MV-2610-028",
          "date": "2026-10-14",
          "type": "Shipment",
          "sku": "PLT-VAN-2LB",
          "supplier_id": "",
          "lot": "PVA2411A",
          "expiry": "",
          "qty": "12 cs",
          "lot_status": "",
          "reason": "",
          "reference": "OB-1014",
          "source_link": "https://example.com/3pl/movements/MV-2610-028"
        }
      },
      {
        "row": 19,
        "values": {
          "movement_id": "MV-2610-029",
          "date": "2026-10-14",
          "type": "Shipment",
          "sku": "WPI-VAN-2LB",
          "supplier_id": "",
          "lot": "WVA2411A",
          "expiry": "",
          "qty": "40",
          "lot_status": "",
          "reason": "",
          "reference": "OB-1014",
          "source_link": "https://example.com/3pl/movements/MV-2610-029"
        }
      }
    ],
    "exceptions": [
      {
        "row": 6,
        "field": "movement_id",
        "issue": "Duplicate ID",
        "message": "movement_id MV-2610-017 appears earlier in this file (row 5). Only the first row can be posted."
      },
      {
        "row": 7,
        "field": "movement_id",
        "issue": "Duplicate ID",
        "message": "movement_id MV-2610-004 is already in Inventory_Ledger. The ledger row was not changed."
      },
      {
        "row": 8,
        "field": "sku",
        "issue": "Unknown product",
        "message": "SKU WPI-STR-2LB is not in Products."
      },
      {
        "row": 9,
        "field": "supplier_id",
        "issue": "Unknown supplier",
        "message": "Supplier SUP-09 is not in Suppliers."
      },
      {
        "row": 9,
        "field": "expiry",
        "issue": "Invalid date",
        "message": "expiry \"2028-02-30\" is not a real date in yyyy-mm-dd format."
      },
      {
        "row": 10,
        "field": "date",
        "issue": "Invalid date",
        "message": "date \"2026-09-31\" is not a real date in yyyy-mm-dd format."
      },
      {
        "row": 11,
        "field": "qty",
        "issue": "Negative inventory",
        "message": "This row would take recorded stock of CRE-UNF-500G from 290 to -610."
      },
      {
        "row": 12,
        "field": "lot_status",
        "issue": "Unsupported status",
        "message": "lot_status \"Approved\" is not a lot status allowed on receipt (Config)."
      },
      {
        "row": 13,
        "field": "source_link",
        "issue": "Missing source link",
        "message": "source_link is empty; every movement needs a link to its source document."
      },
      {
        "row": 14,
        "field": "lot",
        "issue": "Missing required field",
        "message": "lot is empty; every movement needs its lot code."
      },
      {
        "row": 18,
        "field": "qty",
        "issue": "Invalid quantity",
        "message": "qty \"12 cs\" is not a valid quantity for a shipment."
      }
    ],
    "accepted": 8,
    "rejected": 10
  },
  "campaigns": [
    {
      "id": "CMP-2026-01",
      "name": "Summer Shred Bundle",
      "objective": "Grow bundle sales of whey isolate with creatine",
      "products": [
        "WPI-CHO-2LB",
        "CRE-UNF-300G"
      ],
      "channel": "Paid social",
      "owner": "Maya Torres",
      "launch": "2026-07-08",
      "status": "Completed",
      "planned_spend": 12000,
      "actual_spend": 11460,
      "attributed_revenue": 38900,
      "company_sales": 412300
    },
    {
      "id": "CMP-2026-02",
      "name": "Back-to-Gym Creatine",
      "objective": "Win new creatine customers before autumn",
      "products": [
        "CRE-UNF-300G",
        "CRE-UNF-500G"
      ],
      "channel": "Short-form video",
      "owner": "Hannah Becker",
      "launch": "2026-08-18",
      "status": "Completed",
      "planned_spend": 8000,
      "actual_spend": 8450,
      "attributed_revenue": 19700,
      "company_sales": null
    },
    {
      "id": "CMP-2026-03",
      "name": "Plant Protein Relaunch",
      "objective": "Relaunch plant protein with the new label",
      "products": [
        "PLT-CHO-2LB",
        "PLT-VAN-2LB"
      ],
      "channel": "Email",
      "owner": "Maya Torres",
      "launch": "2026-09-03",
      "status": "Completed",
      "planned_spend": 3500,
      "actual_spend": 3120,
      "attributed_revenue": 9840,
      "company_sales": 398700
    },
    {
      "id": "CMP-2026-04",
      "name": "Cookie Dough Bar Creator Push",
      "objective": "Drive trial of the cookie dough bar",
      "products": [
        "BAR-CKD-12"
      ],
      "channel": "Influencer",
      "owner": "Maya Torres",
      "launch": "2026-10-06",
      "status": "Live",
      "planned_spend": 15000,
      "actual_spend": 9800,
      "attributed_revenue": null,
      "company_sales": null
    },
    {
      "id": "CMP-2026-05",
      "name": "Fall Marketplace Deals",
      "objective": "Clear bar stock through marketplace deals",
      "products": [
        "BAR-PBC-12",
        "BAR-CKD-12"
      ],
      "channel": "Marketplace ads",
      "owner": "Hannah Becker",
      "launch": "2026-10-07",
      "status": "Completed",
      "planned_spend": 6500,
      "actual_spend": 6210,
      "attributed_revenue": 24300,
      "company_sales": null
    },
    {
      "id": "CMP-2026-06",
      "name": "Watermelon Flavour Drop",
      "objective": "Launch the refreshed watermelon pre-workout",
      "products": [
        "PRE-WTM-30"
      ],
      "channel": "Short-form video",
      "owner": "Maya Torres",
      "launch": "2026-11-03",
      "status": "Approved",
      "planned_spend": 6000,
      "actual_spend": null,
      "attributed_revenue": null,
      "company_sales": null
    },
    {
      "id": "CMP-2026-07",
      "name": "Holiday Gift Bundles",
      "objective": "Sell whey and bar gift bundles for the holidays",
      "products": [
        "WPI-CHO-2LB",
        "WPI-VAN-2LB",
        "BAR-PBC-12"
      ],
      "channel": "Paid social",
      "owner": "Maya Torres",
      "launch": "2026-11-20",
      "status": "In review",
      "planned_spend": 18000,
      "actual_spend": null,
      "attributed_revenue": null,
      "company_sales": null
    },
    {
      "id": "CMP-2026-08",
      "name": "New Year Reset",
      "objective": "Bring back lapsed customers in January",
      "products": [
        "WPI-CHO-2LB",
        "PLT-CHO-2LB",
        "CRE-UNF-300G"
      ],
      "channel": "Search ads",
      "owner": "Hannah Becker",
      "launch": "2027-01-02",
      "status": "Draft",
      "planned_spend": 10000,
      "actual_spend": null,
      "attributed_revenue": null,
      "company_sales": null
    }
  ],
  "metric_definitions": [
    {
      "metric": "Opening balance",
      "definition": "Units on hand for a SKU on the opening balance date set on Config. It equals the sum of the lot opening quantities in Batches."
    },
    {
      "metric": "Receipts",
      "definition": "Sum of Inventory_Ledger quantities with type Receipt for the SKU."
    },
    {
      "metric": "Shipments",
      "definition": "Sum of Inventory_Ledger quantities with type Shipment for the SKU, entered as positive numbers."
    },
    {
      "metric": "Adjustments",
      "definition": "Sum of signed Inventory_Ledger quantities with type Adjustment (counts, damage, write-offs, samples)."
    },
    {
      "metric": "Recorded stock",
      "definition": "Opening balance + receipts - shipments + adjustments."
    },
    {
      "metric": "Reserved",
      "definition": "Sum of Reservations whose status holds stock on Config, whose start date is on or before the as-of date and whose release date is empty or on or after the as-of date."
    },
    {
      "metric": "Held in lots",
      "definition": "Units in lots whose status holds stock on Config (Quarantine, On hold), plus units in expired lots when Config says expired lots are held."
    },
    {
      "metric": "Available",
      "definition": "Recorded stock - reserved - held in lots. It can go below zero when reservations exceed stock."
    },
    {
      "metric": "Below reorder",
      "definition": "Yes when the stock chosen on Config (Available or Recorded) is below the SKU's reorder point."
    },
    {
      "metric": "On order",
      "definition": "Outstanding quantity on open purchase orders for the SKU."
    },
    {
      "metric": "Open PO",
      "definition": "A PO whose status counts as open on Config and whose ordered quantity is not fully received in the ledger."
    },
    {
      "metric": "Overdue PO",
      "definition": "An open PO whose expected date is before the as-of date. Days late = as-of date - expected date."
    },
    {
      "metric": "Received qty (PO)",
      "definition": "Sum of ledger receipts whose reference is the PO ID and whose SKU matches the PO line."
    },
    {
      "metric": "Days left (lot)",
      "definition": "Company-supplied expiry date - as-of date. The workbook tracks dates; it does not judge product safety."
    },
    {
      "metric": "Expiry window",
      "definition": "Expired (days left below 0), then the three windows set on Config (default 0-30, 31-60, 61-90 days), then beyond."
    },
    {
      "metric": "Import exception",
      "definition": "One failed check on one staged row. A row with any exception is Rejected and must not be posted."
    },
    {
      "metric": "Record issue",
      "definition": "A row whose Record check column is not OK (missing required field, duplicate ID, unknown reference or inconsistent values)."
    },
    {
      "metric": "Open task",
      "definition": "A task whose status counts as open on Config. Overdue when the due date is before the as-of date."
    },
    {
      "metric": "Planned spend",
      "definition": "Budget approved for the campaign, in USD."
    },
    {
      "metric": "Actual spend",
      "definition": "Spend reported by the channel or finance, in USD."
    },
    {
      "metric": "Spend variance",
      "definition": "Actual spend - planned spend."
    },
    {
      "metric": "Platform-attributed revenue",
      "definition": "Revenue the ad or email platform credits to the campaign under its own attribution rules. It is not company revenue and is never added to company sales."
    },
    {
      "metric": "Company sales (campaign period)",
      "definition": "Total company sales for the campaign period from finance, all channels. Shown next to platform revenue for context only, never summed across campaigns because periods can overlap."
    },
    {
      "metric": "Platform ROAS",
      "definition": "Platform-attributed revenue / actual spend."
    }
  ],
  "timeline": [
    {
      "date": "2026-09-03",
      "kind": "Campaign",
      "ref": "CMP-2026-03",
      "name": "Plant Protein Relaunch",
      "milestone": "Launch: plant protein relaunch emails",
      "owner": "Maya Torres",
      "status": "Done",
      "link": "https://example.com/#plan/MS-001"
    },
    {
      "date": "2026-09-15",
      "kind": "Product",
      "ref": "PRE-BRZ-30",
      "name": "Pre-Workout, Blue Raspberry, 30 servings",
      "milestone": "Restock received (PO-2026-025)",
      "owner": "Luis Romero",
      "status": "Done",
      "link": "https://example.com/#plan/MS-002"
    },
    {
      "date": "2026-09-22",
      "kind": "Product",
      "ref": "PLT-VAN-2LB",
      "name": "Plant Protein, Vanilla, 2 lb",
      "milestone": "New supplement facts panel approved",
      "owner": "Priya Nair",
      "status": "Done",
      "link": "https://example.com/#plan/MS-003"
    },
    {
      "date": "2026-09-30",
      "kind": "Campaign",
      "ref": "CMP-2026-03",
      "name": "Plant Protein Relaunch",
      "milestone": "Results review",
      "owner": "Hannah Becker",
      "status": "Done",
      "link": "https://example.com/#plan/MS-004"
    },
    {
      "date": "2026-10-06",
      "kind": "Campaign",
      "ref": "CMP-2026-04",
      "name": "Cookie Dough Bar Creator Push",
      "milestone": "Launch: creator push",
      "owner": "Maya Torres",
      "status": "Done",
      "link": "https://example.com/#plan/MS-005"
    },
    {
      "date": "2026-10-06",
      "kind": "Product",
      "ref": "PLT-VAN-2LB",
      "name": "Plant Protein, Vanilla, 2 lb",
      "milestone": "Restock due (PO-2026-029)",
      "owner": "Luis Romero",
      "status": "Late",
      "link": "https://example.com/#plan/MS-006"
    },
    {
      "date": "2026-10-10",
      "kind": "Campaign",
      "ref": "CMP-2026-06",
      "name": "Watermelon Flavour Drop",
      "milestone": "Creative brief signed off",
      "owner": "Maya Torres",
      "status": "Done",
      "link": "https://example.com/#plan/MS-007"
    },
    {
      "date": "2026-10-10",
      "kind": "Product",
      "ref": "PRE-WTM-30",
      "name": "Pre-Workout, Watermelon, 30 servings",
      "milestone": "Restock due (PO-2026-031)",
      "owner": "Luis Romero",
      "status": "Late",
      "link": "https://example.com/#plan/MS-008"
    },
    {
      "date": "2026-10-17",
      "kind": "Product",
      "ref": "WPI-VAN-2LB",
      "name": "Whey Protein Isolate, Vanilla, 2 lb",
      "milestone": "Release decision for lot WVA2609A",
      "owner": "Priya Nair",
      "status": "On track",
      "link": "https://example.com/#plan/MS-009"
    },
    {
      "date": "2026-10-20",
      "kind": "Product",
      "ref": "WPI-CHO-2LB",
      "name": "Whey Protein Isolate, Chocolate, 2 lb",
      "milestone": "Restock arrives (PO-2026-030)",
      "owner": "Luis Romero",
      "status": "On track",
      "link": "https://example.com/#plan/MS-010"
    },
    {
      "date": "2026-10-24",
      "kind": "Campaign",
      "ref": "CMP-2026-06",
      "name": "Watermelon Flavour Drop",
      "milestone": "Creative due",
      "owner": "Maya Torres",
      "status": "On track",
      "link": "https://example.com/#plan/MS-011"
    },
    {
      "date": "2026-10-28",
      "kind": "Campaign",
      "ref": "CMP-2026-07",
      "name": "Holiday Gift Bundles",
      "milestone": "Budget approval",
      "owner": "Sam Whitfield",
      "status": "At risk",
      "link": "https://example.com/#plan/MS-012"
    },
    {
      "date": "2026-10-31",
      "kind": "Product",
      "ref": "BAR-PBC-12",
      "name": "Protein Bar, Peanut Butter Chocolate, 12-pack",
      "milestone": "Lot PBC2511A expires (clearance deadline)",
      "owner": "Maya Torres",
      "status": "At risk",
      "link": "https://example.com/#plan/MS-013"
    },
    {
      "date": "2026-11-03",
      "kind": "Campaign",
      "ref": "CMP-2026-06",
      "name": "Watermelon Flavour Drop",
      "milestone": "Launch: watermelon flavour drop",
      "owner": "Maya Torres",
      "status": "Planned",
      "link": "https://example.com/#plan/MS-014"
    },
    {
      "date": "2026-11-06",
      "kind": "Campaign",
      "ref": "CMP-2026-04",
      "name": "Cookie Dough Bar Creator Push",
      "milestone": "Final creator results report",
      "owner": "Hannah Becker",
      "status": "Planned",
      "link": "https://example.com/#plan/MS-015"
    },
    {
      "date": "2026-11-19",
      "kind": "Product",
      "ref": "CAS-CHO-2LB",
      "name": "Micellar Casein, Chocolate, 2 lb",
      "milestone": "Restock due (PO-2026-032)",
      "owner": "Luis Romero",
      "status": "Planned",
      "link": "https://example.com/#plan/MS-016"
    },
    {
      "date": "2026-11-20",
      "kind": "Campaign",
      "ref": "CMP-2026-07",
      "name": "Holiday Gift Bundles",
      "milestone": "Launch: holiday gift bundles",
      "owner": "Maya Torres",
      "status": "Planned",
      "link": "https://example.com/#plan/MS-017"
    },
    {
      "date": "2026-12-01",
      "kind": "Product",
      "ref": "PRE-WTM-30",
      "name": "Pre-Workout, Watermelon, 30 servings",
      "milestone": "New label design reaches stock",
      "owner": "Priya Nair",
      "status": "Planned",
      "link": "https://example.com/#plan/MS-018"
    },
    {
      "date": "2026-12-15",
      "kind": "Campaign",
      "ref": "CMP-2026-08",
      "name": "New Year Reset",
      "milestone": "Brief due: New Year Reset",
      "owner": "Hannah Becker",
      "status": "Planned",
      "link": "https://example.com/#plan/MS-019"
    },
    {
      "date": "2027-01-02",
      "kind": "Campaign",
      "ref": "CMP-2026-08",
      "name": "New Year Reset",
      "milestone": "Launch: New Year Reset",
      "owner": "Hannah Becker",
      "status": "Planned",
      "link": "https://example.com/#plan/MS-020"
    }
  ],
  "tasks": [
    {
      "id": "TSK-001",
      "task": "Chase Corliss Plant Proteins for the PO-2026-029 delivery date",
      "owner": "Luis Romero",
      "due": "2026-10-16",
      "status": "In progress"
    },
    {
      "id": "TSK-002",
      "task": "Review the certificate of analysis and release lot WVA2609A",
      "owner": "Priya Nair",
      "due": "2026-10-17",
      "status": "Not started"
    },
    {
      "id": "TSK-003",
      "task": "Approve destruction of expired lot CKD2510A and post the write-off",
      "owner": "Ben Okafor",
      "due": "2026-10-20",
      "status": "Not started"
    },
    {
      "id": "TSK-004",
      "task": "Plan a clearance offer for lot PBC2511A before it expires",
      "owner": "Maya Torres",
      "due": "2026-10-17",
      "status": "In progress"
    },
    {
      "id": "TSK-005",
      "task": "Sign off and send PO-2026-034 (creatine 500 g)",
      "owner": "Sam Whitfield",
      "due": "2026-10-16",
      "status": "Not started"
    },
    {
      "id": "TSK-006",
      "task": "Get a new arrival date for PO-2026-031 from the carrier",
      "owner": "Luis Romero",
      "due": "2026-10-13",
      "status": "Blocked"
    },
    {
      "id": "TSK-007",
      "task": "Write the creative brief for CMP-2026-06",
      "owner": "Maya Torres",
      "due": "2026-10-10",
      "status": "Done"
    },
    {
      "id": "TSK-008",
      "task": "Upload the new supplement facts panel for PLT-VAN-2LB",
      "owner": "Priya Nair",
      "due": "2026-09-30",
      "status": "Done"
    },
    {
      "id": "TSK-009",
      "task": "Approve the budget for CMP-2026-07",
      "owner": "Sam Whitfield",
      "due": "2026-10-21",
      "status": "Not started"
    },
    {
      "id": "TSK-010",
      "task": "Collect creator results for CMP-2026-04",
      "owner": "Hannah Becker",
      "due": "2026-10-24",
      "status": "Not started"
    },
    {
      "id": "TSK-011",
      "task": "Ask finance for the August company sales total",
      "owner": "Hannah Becker",
      "due": "2026-10-14",
      "status": "In progress"
    },
    {
      "id": "TSK-012",
      "task": "Quarterly cycle count, bars aisle",
      "owner": "Ben Okafor",
      "due": "2026-10-07",
      "status": "Done"
    }
  ],
  "workbook": {
    "file": "Ops-Workbook-demo.xlsx",
    "sheets": [
      {
        "name": "Start_Here",
        "purpose": "How the workbook works: adding records, colour key, rules, import steps, backup and recovery."
      },
      {
        "name": "Dashboard",
        "purpose": "Stock by SKU, reorder alerts, outstanding and overdue purchase orders, lots near expiry, open tasks, record checks, import status and a marketing summary. Formulas only."
      },
      {
        "name": "Config",
        "purpose": "As-of date, expiry windows, reorder and reservation rules, dropdown lists and the import check catalog."
      },
      {
        "name": "Products",
        "purpose": "Product catalog with opening balances and reorder rules. Stock columns calculate from the ledger, lots and reservations. Room for 100 rows."
      },
      {
        "name": "Suppliers",
        "purpose": "Supplier and manufacturing partner directory. Room for 50 rows."
      },
      {
        "name": "Purchase_Orders",
        "purpose": "Purchase orders and expected deliveries. Received quantities come from ledger receipts. Room for 300 rows."
      },
      {
        "name": "Inventory_Ledger",
        "purpose": "Every receipt, shipment and adjustment with lot, reference and source link. Room for 2,000 rows."
      },
      {
        "name": "Batches",
        "purpose": "Lots with company-supplied expiry dates. Lot balances, days left and expiry windows calculate. Room for 300 rows."
      },
      {
        "name": "Reservations",
        "purpose": "Stock set aside for orders or campaigns. Config decides which statuses count. Room for 200 rows."
      },
      {
        "name": "Marketing",
        "purpose": "Campaign tracker: products, channel, owner, deadlines, approval, assets, planned vs actual spend, platform-attributed revenue and company sales kept apart. Room for 100 rows."
      },
      {
        "name": "Metric_Definitions",
        "purpose": "What every number means and what a blank means."
      },
      {
        "name": "Milestones",
        "purpose": "Product and campaign milestones with date, owner, status and link; the source of the HTML timeline report, which lists them in date order. Room for 200 rows."
      },
      {
        "name": "Tasks",
        "purpose": "Action items with owners, due dates and status. Room for 300 rows."
      },
      {
        "name": "Documents",
        "purpose": "Register of specs, certificates, labels, agreements and SOPs with links and review dates. Room for 200 rows."
      },
      {
        "name": "Import_Staging",
        "purpose": "Paste a warehouse CSV here. Every row is checked by formulas before anything is posted. Room for 300 rows."
      },
      {
        "name": "Exceptions",
        "purpose": "Plain-language list of every problem found in Import_Staging, with what to do."
      },
      {
        "name": "Ready_To_Post",
        "purpose": "The Ready rows of Import_Staging laid out in the column order of Inventory_Ledger, and new lots from receipts in the column order of Batches, ready to paste as values."
      }
    ]
  },
  "extras": {
    "dashboard_tiles": [
      {
        "label": "SKUs tracked",
        "value": 12,
        "note": "rows in Products"
      },
      {
        "label": "Recorded units",
        "value": 9234,
        "note": "opening + receipts - shipments + adjustments"
      },
      {
        "label": "Available units",
        "value": 8048,
        "note": "recorded - reserved - held in lots"
      },
      {
        "label": "SKUs below reorder",
        "value": 4,
        "note": "test uses available stock"
      },
      {
        "label": "Open POs",
        "value": 5,
        "note": "3,560 units on order"
      },
      {
        "label": "Overdue POs",
        "value": 2,
        "note": "expected date has passed"
      },
      {
        "label": "Open tasks",
        "value": 9,
        "note": "2 overdue"
      },
      {
        "label": "Expired lots with stock",
        "value": 1,
        "note": "expiry date has passed"
      },
      {
        "label": "Lots expiring in 0-30 days",
        "value": 3,
        "note": "lots with stock on hand"
      },
      {
        "label": "Lots expiring in 31-60 days",
        "value": 2,
        "note": "lots with stock on hand"
      },
      {
        "label": "Lots expiring in 61-90 days",
        "value": 3,
        "note": "lots with stock on hand"
      },
      {
        "label": "Import rows ready",
        "value": 8,
        "note": "of 18 rows staged"
      },
      {
        "label": "Import exceptions",
        "value": 11,
        "note": "10 rows rejected"
      },
      {
        "label": "Record issues",
        "value": 0,
        "note": "missing or inconsistent rows"
      }
    ],
    "stock_check": [
      {
        "sku": "WPI-CHO-2LB",
        "held": 0,
        "lot_total": 429,
        "difference": 0,
        "on_order": 1500,
        "record_check": "OK"
      },
      {
        "sku": "WPI-VAN-2LB",
        "held": 600,
        "lot_total": 808,
        "difference": 0,
        "on_order": 600,
        "record_check": "OK"
      },
      {
        "sku": "WPI-CHO-5LB",
        "held": 0,
        "lot_total": 264,
        "difference": 0,
        "on_order": 0,
        "record_check": "OK"
      },
      {
        "sku": "PLT-CHO-2LB",
        "held": 0,
        "lot_total": 396,
        "difference": 0,
        "on_order": 0,
        "record_check": "OK"
      },
      {
        "sku": "PLT-VAN-2LB",
        "held": 0,
        "lot_total": 133,
        "difference": 0,
        "on_order": 500,
        "record_check": "OK"
      },
      {
        "sku": "BAR-PBC-12",
        "held": 0,
        "lot_total": 2744,
        "difference": 0,
        "on_order": 0,
        "record_check": "OK"
      },
      {
        "sku": "BAR-CKD-12",
        "held": 36,
        "lot_total": 1748,
        "difference": 0,
        "on_order": 0,
        "record_check": "OK"
      },
      {
        "sku": "CRE-UNF-300G",
        "held": 0,
        "lot_total": 1119,
        "difference": 0,
        "on_order": 0,
        "record_check": "OK"
      },
      {
        "sku": "CRE-UNF-500G",
        "held": 0,
        "lot_total": 290,
        "difference": 0,
        "on_order": 0,
        "record_check": "OK"
      },
      {
        "sku": "PRE-BRZ-30",
        "held": 0,
        "lot_total": 875,
        "difference": 0,
        "on_order": 0,
        "record_check": "OK"
      },
      {
        "sku": "PRE-WTM-30",
        "held": 0,
        "lot_total": 228,
        "difference": 0,
        "on_order": 600,
        "record_check": "OK"
      },
      {
        "sku": "CAS-CHO-2LB",
        "held": 0,
        "lot_total": 200,
        "difference": 0,
        "on_order": 360,
        "record_check": "OK"
      }
    ],
    "held_lots": [
      {
        "lot": "WVA2609A",
        "sku": "WPI-VAN-2LB",
        "status": "Quarantine",
        "expiry": "2028-09-24",
        "days_left": 710,
        "on_hand": 600,
        "held": 600,
        "status_holds_stock": true,
        "expired": false
      },
      {
        "lot": "CKD2510A",
        "sku": "BAR-CKD-12",
        "status": "On hold",
        "expiry": "2026-10-02",
        "days_left": -13,
        "on_hand": 36,
        "held": 36,
        "status_holds_stock": true,
        "expired": true
      }
    ],
    "reservations": [
      {
        "id": "RES-001",
        "sku": "CRE-UNF-500G",
        "qty": 80,
        "status": "Active",
        "start": "2026-10-09",
        "release": "2026-10-24",
        "counts": true,
        "counted": 80
      },
      {
        "id": "RES-002",
        "sku": "BAR-CKD-12",
        "qty": 150,
        "status": "Active",
        "start": "2026-10-01",
        "release": "2026-10-31",
        "counts": true,
        "counted": 150
      },
      {
        "id": "RES-003",
        "sku": "WPI-CHO-2LB",
        "qty": 120,
        "status": "Active",
        "start": "2026-10-05",
        "release": "2026-11-15",
        "counts": true,
        "counted": 120
      },
      {
        "id": "RES-004",
        "sku": "PRE-BRZ-30",
        "qty": 60,
        "status": "Released",
        "start": "2026-09-25",
        "release": "2026-10-05",
        "counts": false,
        "counted": 0
      },
      {
        "id": "RES-005",
        "sku": "PLT-CHO-2LB",
        "qty": 40,
        "status": "Pending",
        "start": "2026-10-12",
        "release": null,
        "counts": false,
        "counted": 0
      },
      {
        "id": "RES-006",
        "sku": "BAR-PBC-12",
        "qty": 200,
        "status": "Active",
        "start": "2026-10-10",
        "release": "2026-10-31",
        "counts": true,
        "counted": 200
      },
      {
        "id": "RES-007",
        "sku": "WPI-VAN-2LB",
        "qty": 60,
        "status": "Active",
        "start": "2026-10-20",
        "release": "2026-10-30",
        "counts": false,
        "counted": 0
      },
      {
        "id": "RES-008",
        "sku": "PRE-BRZ-30",
        "qty": 50,
        "status": "Active",
        "start": "2026-09-20",
        "release": "2026-10-10",
        "counts": false,
        "counted": 0
      }
    ],
    "recon_lots": {
      "sku": "WPI-CHO-2LB",
      "opening_date": "2026-07-01",
      "lots": [
        {
          "lot": "WCH2502A",
          "opening": 540,
          "on_hand": 0,
          "status": "Closed",
          "expiry": "2027-02-10"
        },
        {
          "lot": "WCH2504A",
          "opening": 700,
          "on_hand": 0,
          "status": "Closed",
          "expiry": "2027-04-08"
        },
        {
          "lot": "WCH2607A",
          "opening": 0,
          "on_hand": 429,
          "status": "Released",
          "expiry": "2028-07-09"
        }
      ]
    },
    "config": {
      "as_of": "2026-10-15",
      "opening_date": "2026-07-01",
      "expiry_windows": [
        30,
        60,
        90
      ],
      "reorder_basis": "Available",
      "expired_lots_held": "Yes",
      "status_rules": [
        {
          "list": "PO statuses",
          "columns": [
            "Counts as open"
          ],
          "rows": [
            [
              "Draft",
              "No"
            ],
            [
              "Ordered",
              "Yes"
            ],
            [
              "Confirmed",
              "Yes"
            ],
            [
              "In transit",
              "Yes"
            ],
            [
              "Partially received",
              "Yes"
            ],
            [
              "Received",
              "No"
            ],
            [
              "Cancelled",
              "No"
            ]
          ]
        },
        {
          "list": "Lot statuses",
          "columns": [
            "Holds stock",
            "Allowed on receipt"
          ],
          "rows": [
            [
              "Released",
              "No",
              "Yes"
            ],
            [
              "Quarantine",
              "Yes",
              "Yes"
            ],
            [
              "On hold",
              "Yes",
              "Yes"
            ],
            [
              "Closed",
              "No",
              "No"
            ]
          ]
        },
        {
          "list": "Reservation statuses",
          "columns": [
            "Holds stock"
          ],
          "rows": [
            [
              "Active",
              "Yes"
            ],
            [
              "Pending",
              "No"
            ],
            [
              "Released",
              "No"
            ],
            [
              "Cancelled",
              "No"
            ]
          ]
        },
        {
          "list": "Task statuses",
          "columns": [
            "Counts as open"
          ],
          "rows": [
            [
              "Not started",
              "Yes"
            ],
            [
              "In progress",
              "Yes"
            ],
            [
              "Blocked",
              "Yes"
            ],
            [
              "Done",
              "No"
            ],
            [
              "Cancelled",
              "No"
            ]
          ]
        }
      ],
      "lists": [
        {
          "name": "Movement types",
          "values": [
            "Receipt",
            "Shipment",
            "Adjustment"
          ]
        },
        {
          "name": "Adjustment reasons",
          "values": [
            "Cycle count",
            "Damaged in warehouse",
            "Expired write-off",
            "Marketing samples",
            "Customer return",
            "Other"
          ]
        },
        {
          "name": "Supplier types",
          "values": [
            "Manufacturer",
            "Co-packer",
            "Ingredient supplier",
            "3PL"
          ]
        },
        {
          "name": "Supplier statuses",
          "values": [
            "Active",
            "On hold",
            "Inactive"
          ]
        },
        {
          "name": "Product categories",
          "values": [
            "Whey protein",
            "Plant protein",
            "Casein",
            "Protein bars",
            "Creatine",
            "Pre-workout"
          ]
        },
        {
          "name": "Product statuses",
          "values": [
            "Active",
            "Discontinued"
          ]
        },
        {
          "name": "Campaign statuses",
          "values": [
            "Draft",
            "In review",
            "Approved",
            "Live",
            "Completed",
            "Cancelled"
          ]
        },
        {
          "name": "Channels",
          "values": [
            "Paid social",
            "Short-form video",
            "Email",
            "Influencer",
            "Marketplace ads",
            "Search ads",
            "Retail promotion",
            "Affiliate"
          ]
        },
        {
          "name": "Priorities",
          "values": [
            "High",
            "Medium",
            "Low"
          ]
        },
        {
          "name": "Document types",
          "values": [
            "Spec sheet",
            "Certificate of analysis",
            "Label artwork",
            "Agreement",
            "Allergen statement",
            "SOP",
            "Insurance certificate",
            "Campaign brief"
          ]
        },
        {
          "name": "Document statuses",
          "values": [
            "Current",
            "In review",
            "Superseded"
          ]
        },
        {
          "name": "Milestone kinds",
          "values": [
            "Product",
            "Campaign"
          ]
        },
        {
          "name": "Milestone statuses",
          "values": [
            "Planned",
            "On track",
            "At risk",
            "Late",
            "Done"
          ]
        },
        {
          "name": "Yes/No",
          "values": [
            "Yes",
            "No"
          ]
        },
        {
          "name": "Reorder basis",
          "values": [
            "Available",
            "Recorded"
          ]
        }
      ],
      "import_checks": [
        {
          "no": 1,
          "code": "ID_MISSING",
          "field": "movement_id",
          "issue": "Missing required field",
          "applies_to": "All rows",
          "action": "Add a unique movement_id."
        },
        {
          "no": 2,
          "code": "ID_DUP_FILE",
          "field": "movement_id",
          "issue": "Duplicate ID",
          "applies_to": "All rows",
          "action": "Give the row its own ID, or delete it if it repeats an earlier row."
        },
        {
          "no": 3,
          "code": "ID_DUP_LEDGER",
          "field": "movement_id",
          "issue": "Duplicate ID",
          "applies_to": "All rows",
          "action": "Delete the row if it was posted before; a new movement needs a new ID."
        },
        {
          "no": 4,
          "code": "DATE_MISSING",
          "field": "date",
          "issue": "Missing required field",
          "applies_to": "All rows",
          "action": "Add the movement date (yyyy-mm-dd)."
        },
        {
          "no": 5,
          "code": "DATE_INVALID",
          "field": "date",
          "issue": "Invalid date",
          "applies_to": "All rows",
          "action": "Fix the date (yyyy-mm-dd)."
        },
        {
          "no": 6,
          "code": "DATE_FUTURE",
          "field": "date",
          "issue": "Invalid date",
          "applies_to": "All rows",
          "action": "Check the date; a movement cannot be after the as-of date."
        },
        {
          "no": 7,
          "code": "TYPE_MISSING",
          "field": "type",
          "issue": "Missing required field",
          "applies_to": "All rows",
          "action": "Add the type: Receipt, Shipment or Adjustment."
        },
        {
          "no": 8,
          "code": "TYPE_UNSUPPORTED",
          "field": "type",
          "issue": "Unsupported type",
          "applies_to": "All rows",
          "action": "Use a movement type listed on Config."
        },
        {
          "no": 9,
          "code": "SKU_MISSING",
          "field": "sku",
          "issue": "Missing required field",
          "applies_to": "All rows",
          "action": "Add the SKU."
        },
        {
          "no": 10,
          "code": "SKU_UNKNOWN",
          "field": "sku",
          "issue": "Unknown product",
          "applies_to": "All rows",
          "action": "Add the product in Products first, or correct the SKU."
        },
        {
          "no": 11,
          "code": "SUP_MISSING",
          "field": "supplier_id",
          "issue": "Missing required field",
          "applies_to": "Receipts",
          "action": "Add the supplier ID."
        },
        {
          "no": 12,
          "code": "SUP_UNKNOWN",
          "field": "supplier_id",
          "issue": "Unknown supplier",
          "applies_to": "Rows with a supplier_id",
          "action": "Add the supplier in Suppliers first, or correct the ID."
        },
        {
          "no": 13,
          "code": "LOT_MISSING",
          "field": "lot",
          "issue": "Missing required field",
          "applies_to": "All rows",
          "action": "Add the lot code."
        },
        {
          "no": 14,
          "code": "LOT_UNKNOWN",
          "field": "lot",
          "issue": "Unknown lot",
          "applies_to": "Shipments and adjustments",
          "action": "Check the lot code; a shipped lot must exist in Batches for this SKU."
        },
        {
          "no": 15,
          "code": "EXP_MISSING",
          "field": "expiry",
          "issue": "Missing required field",
          "applies_to": "Receipts",
          "action": "Add the company-supplied expiry date."
        },
        {
          "no": 16,
          "code": "EXP_INVALID",
          "field": "expiry",
          "issue": "Invalid date",
          "applies_to": "Rows with an expiry",
          "action": "Fix the expiry date (yyyy-mm-dd)."
        },
        {
          "no": 17,
          "code": "QTY_MISSING",
          "field": "qty",
          "issue": "Missing required field",
          "applies_to": "All rows",
          "action": "Add the quantity."
        },
        {
          "no": 18,
          "code": "QTY_INVALID",
          "field": "qty",
          "issue": "Invalid quantity",
          "applies_to": "All rows",
          "action": "Use a whole number: above 0 for receipts and shipments, not 0 for adjustments."
        },
        {
          "no": 19,
          "code": "STATUS_MISSING",
          "field": "lot_status",
          "issue": "Missing required field",
          "applies_to": "Receipts",
          "action": "Add the lot status."
        },
        {
          "no": 20,
          "code": "STATUS_UNSUPPORTED",
          "field": "lot_status",
          "issue": "Unsupported status",
          "applies_to": "Rows with a lot_status",
          "action": "Use a lot status allowed on receipt (Config), or add it there first."
        },
        {
          "no": 21,
          "code": "REASON_MISSING",
          "field": "reason",
          "issue": "Missing required field",
          "applies_to": "Adjustments",
          "action": "Add the adjustment reason."
        },
        {
          "no": 22,
          "code": "LINK_MISSING",
          "field": "source_link",
          "issue": "Missing source link",
          "applies_to": "All rows",
          "action": "Add the link to the source document."
        },
        {
          "no": 23,
          "code": "NEG_STOCK",
          "field": "qty",
          "issue": "Negative inventory",
          "applies_to": "Rows that change stock",
          "action": "Check the quantity and sign against the warehouse count before posting."
        }
      ]
    },
    "record_checks": [
      {
        "sheet": "Products",
        "rows": 12,
        "issues": 0
      },
      {
        "sheet": "Suppliers",
        "rows": 5,
        "issues": 0
      },
      {
        "sheet": "Purchase_Orders",
        "rows": 12,
        "issues": 0
      },
      {
        "sheet": "Inventory_Ledger",
        "rows": 62,
        "issues": 0
      },
      {
        "sheet": "Batches",
        "rows": 27,
        "issues": 0
      },
      {
        "sheet": "Reservations",
        "rows": 8,
        "issues": 0
      },
      {
        "sheet": "Marketing",
        "rows": 8,
        "issues": 0
      },
      {
        "sheet": "Milestones",
        "rows": 20,
        "issues": 0
      },
      {
        "sheet": "Tasks",
        "rows": 12,
        "issues": 0
      },
      {
        "sheet": "Documents",
        "rows": 10,
        "issues": 0
      }
    ],
    "duplicate_kept": [
      {
        "row": 7,
        "id": "MV-2610-004",
        "ledger_row": 54,
        "kept": {
          "date": "2026-10-08",
          "type": "Shipment",
          "sku": "WPI-CHO-5LB",
          "lot": "W5C2501A",
          "qty": 16,
          "reference": "OB-2610",
          "source_link": "https://example.com/3pl/outbound/2026-10"
        }
      }
    ],
    "columns": [
      {
        "sheet": "Products",
        "id_column": "SKU",
        "example_id": "WPI-CHO-2LB",
        "records": 12,
        "capacity": 100,
        "input": [
          "SKU",
          "Product name",
          "Category",
          "Flavour",
          "Size",
          "Primary supplier ID",
          "Unit cost (USD)",
          "Opening balance",
          "Reorder point",
          "Reorder qty",
          "Shelf life (months)",
          "Status",
          "Notes"
        ],
        "required": [
          "SKU",
          "Product name",
          "Category",
          "Primary supplier ID",
          "Opening balance",
          "Reorder point",
          "Reorder qty",
          "Status"
        ],
        "calculated": [
          "Supplier name",
          "Receipts",
          "Shipments",
          "Adjustments",
          "Recorded stock",
          "Reserved",
          "Held in lots",
          "Available",
          "On order (open POs)",
          "Lot balances total",
          "Lot openings total",
          "Below reorder (1 = yes)",
          "Stock status",
          "Stock value (USD)",
          "Record check"
        ],
        "helper": 1,
        "other": []
      },
      {
        "sheet": "Suppliers",
        "id_column": "Supplier ID",
        "example_id": "SUP-01",
        "records": 5,
        "capacity": 50,
        "input": [
          "Supplier ID",
          "Name",
          "Type",
          "Supplies",
          "Contact",
          "Email",
          "Phone",
          "Lead time (days)",
          "Payment terms",
          "Location",
          "Status",
          "Agreement link",
          "Notes"
        ],
        "required": [
          "Supplier ID",
          "Name",
          "Type",
          "Status"
        ],
        "calculated": [
          "Products (primary)",
          "Open POs",
          "Record check"
        ],
        "helper": 0,
        "other": []
      },
      {
        "sheet": "Purchase_Orders",
        "id_column": "PO ID",
        "example_id": "PO-2026-018",
        "records": 12,
        "capacity": 300,
        "input": [
          "PO ID",
          "Supplier ID",
          "SKU",
          "Qty ordered",
          "Unit cost (USD)",
          "Order date",
          "Expected date",
          "Status",
          "Source link",
          "Notes"
        ],
        "required": [
          "PO ID",
          "Supplier ID",
          "SKU",
          "Qty ordered",
          "Order date",
          "Expected date",
          "Status",
          "Source link"
        ],
        "calculated": [
          "Supplier name",
          "Product name",
          "Received qty (ledger)",
          "Outstanding qty",
          "Open (1 = yes)",
          "Overdue (1 = yes)",
          "Days late",
          "PO value (USD)",
          "Record check"
        ],
        "helper": 1,
        "other": []
      },
      {
        "sheet": "Inventory_Ledger",
        "id_column": "Entry ID",
        "example_id": "ADJ-2607-001",
        "records": 62,
        "capacity": 2000,
        "input": [
          "Entry ID",
          "Date",
          "Type",
          "SKU",
          "Qty",
          "Lot",
          "Reason (adjustments)",
          "Reference",
          "Source link",
          "Entered by",
          "Import batch",
          "Notes"
        ],
        "required": [
          "Entry ID",
          "Date",
          "Type",
          "SKU",
          "Qty",
          "Lot",
          "Source link"
        ],
        "calculated": [
          "Signed qty",
          "Product name",
          "Lot belongs to",
          "Record check"
        ],
        "helper": 0,
        "other": []
      },
      {
        "sheet": "Batches",
        "id_column": "Lot",
        "example_id": "WCH2502A",
        "records": 27,
        "capacity": 300,
        "input": [
          "Lot",
          "SKU",
          "Supplier ID",
          "Manufacture date",
          "Expiry date",
          "Opening qty",
          "Status",
          "CoA link",
          "Notes"
        ],
        "required": [
          "Lot",
          "SKU",
          "Expiry date",
          "Status"
        ],
        "calculated": [
          "Product name",
          "Ledger movements",
          "On hand",
          "Days left",
          "Expiry window",
          "Held qty",
          "Record check"
        ],
        "helper": 3,
        "other": []
      },
      {
        "sheet": "Reservations",
        "id_column": "Reservation ID",
        "example_id": "RES-001",
        "records": 8,
        "capacity": 200,
        "input": [
          "Reservation ID",
          "SKU",
          "Qty",
          "Reserved for",
          "Status",
          "Start date",
          "Release date",
          "Owner",
          "Notes"
        ],
        "required": [
          "Reservation ID",
          "SKU",
          "Qty",
          "Reserved for",
          "Status",
          "Start date"
        ],
        "calculated": [
          "Product name",
          "Counts now (1 = yes)",
          "Counted qty",
          "Record check"
        ],
        "helper": 0,
        "other": []
      },
      {
        "sheet": "Marketing",
        "id_column": "Campaign ID",
        "example_id": "CMP-2026-01",
        "records": 8,
        "capacity": 100,
        "input": [
          "Campaign ID",
          "Campaign name",
          "Objective",
          "Product 1",
          "Product 2",
          "Product 3",
          "Channel",
          "Owner",
          "Launch date",
          "Brief due",
          "Creative due",
          "Approval status",
          "Asset link",
          "Planned spend (USD)",
          "Actual spend (USD)",
          "Platform-attributed revenue (USD)",
          "Company sales, campaign period (USD)",
          "Results note"
        ],
        "required": [
          "Campaign ID",
          "Campaign name",
          "Objective",
          "Product 1",
          "Channel",
          "Owner",
          "Launch date",
          "Approval status",
          "Planned spend (USD)"
        ],
        "calculated": [
          "Spend variance (USD)",
          "Platform ROAS",
          "Record check"
        ],
        "helper": 0,
        "other": []
      },
      {
        "sheet": "Milestones",
        "id_column": "Milestone ID",
        "example_id": "MS-001",
        "records": 20,
        "capacity": 200,
        "input": [
          "Milestone ID",
          "Date",
          "Kind",
          "Product or campaign ID",
          "Milestone",
          "Responsible person",
          "Status",
          "Link",
          "Notes"
        ],
        "required": [
          "Milestone ID",
          "Date",
          "Kind",
          "Product or campaign ID",
          "Milestone",
          "Responsible person",
          "Status"
        ],
        "calculated": [
          "Product or campaign name",
          "Record check"
        ],
        "helper": 0,
        "other": []
      },
      {
        "sheet": "Tasks",
        "id_column": "Task ID",
        "example_id": "TSK-001",
        "records": 12,
        "capacity": 300,
        "input": [
          "Task ID",
          "Task",
          "Related to",
          "Owner",
          "Due date",
          "Status",
          "Priority",
          "Notes"
        ],
        "required": [
          "Task ID",
          "Task",
          "Owner",
          "Due date",
          "Status"
        ],
        "calculated": [
          "Open (1 = yes)",
          "Overdue (1 = yes)",
          "Days overdue",
          "Record check"
        ],
        "helper": 1,
        "other": []
      },
      {
        "sheet": "Documents",
        "id_column": "Document ID",
        "example_id": "DOC-001",
        "records": 10,
        "capacity": 200,
        "input": [
          "Document ID",
          "Title",
          "Type",
          "Related to",
          "Version",
          "Owner",
          "Effective date",
          "Review due",
          "Status",
          "Link",
          "Notes"
        ],
        "required": [
          "Document ID",
          "Title",
          "Type",
          "Owner",
          "Status",
          "Link"
        ],
        "calculated": [
          "Review overdue",
          "Record check"
        ],
        "helper": 0,
        "other": []
      }
    ],
    "test_cases": [
      {
        "id": "TC-1",
        "title": "Recorded stock of BAR-CKD-12",
        "kind": "sum",
        "rule": "Recorded stock = opening balance + receipts − shipments + adjustments (Inventory_Ledger rows of the SKU).",
        "steps": [
          {
            "text": "Opening balance on Products",
            "value": 1889,
            "op": "+"
          },
          {
            "text": "Receipts: 1 ledger row (1,500)",
            "value": 1500,
            "op": "+"
          },
          {
            "text": "Shipments: 4 ledger rows (521 + 458 + 470 + 132)",
            "value": 1581,
            "op": "-"
          },
          {
            "text": "Adjustments: 1 ledger row (−60)",
            "value": -60,
            "op": "+"
          }
        ],
        "expected": 1748,
        "workbook": 1748,
        "cell": "Products!R8",
        "pass": true
      },
      {
        "id": "TC-2",
        "title": "Lot balances of BAR-CKD-12 add up to its recorded stock",
        "kind": "sum",
        "rule": "Each lot: lot opening + its ledger movements. The lot balances of a SKU must equal its recorded stock.",
        "steps": [
          {
            "text": "Lot CKD2510A: opening 557, 1 ledger row, balance 36",
            "value": 36,
            "op": "+"
          },
          {
            "text": "Lot CKD2511A: opening 1,332, 4 ledger rows, balance 212",
            "value": 212,
            "op": "+"
          },
          {
            "text": "Lot CKD2608A: opening 0, 1 ledger row, balance 1,500",
            "value": 1500,
            "op": "+"
          }
        ],
        "expected": 1748,
        "workbook": 1748,
        "cell": "Products!W8",
        "pass": true
      },
      {
        "id": "TC-3",
        "title": "Available stock of WPI-VAN-2LB, with a lot in quarantine",
        "kind": "sum",
        "rule": "Available = recorded stock − reserved − units held in lots (Config decides which reservation and lot statuses hold stock).",
        "steps": [
          {
            "text": "Recorded stock (846 + 600 − 638 + 0)",
            "value": 808,
            "op": "+"
          },
          {
            "text": "Reservation RES-007: 60 units, Active, but it starts 2026-10-20, after the as-of date, so it is not counted yet",
            "value": 0,
            "op": "-"
          },
          {
            "text": "Held: lot WVA2609A, 600 units on hand, status Quarantine holds stock (Config)",
            "value": 600,
            "op": "-"
          }
        ],
        "expected": 208,
        "workbook": 208,
        "cell": "Products!U3",
        "pass": true
      },
      {
        "id": "TC-4",
        "title": "Available stock of BAR-CKD-12, with an expired lot and a reservation",
        "kind": "sum",
        "rule": "Available = recorded stock − reserved − units held in lots (Config decides which reservation and lot statuses hold stock).",
        "steps": [
          {
            "text": "Recorded stock (1,889 + 1,500 − 1,581 − 60)",
            "value": 1748,
            "op": "+"
          },
          {
            "text": "Reservation RES-002: 150 units, Active from 2026-10-01 to 2026-10-31, so it counts",
            "value": 150,
            "op": "-"
          },
          {
            "text": "Held: lot CKD2510A, 36 units on hand, status On hold holds stock (Config) and expired 2026-10-02 and Config holds expired lots",
            "value": 36,
            "op": "-"
          }
        ],
        "expected": 1562,
        "workbook": 1562,
        "cell": "Products!U8",
        "pass": true
      },
      {
        "id": "TC-5",
        "title": "Reorder alert at the boundary: CAS-CHO-2LB",
        "kind": "compare",
        "rule": "Below reorder when available stock is below the reorder point (Config: reorder test uses Available).",
        "steps": [
          {
            "text": "Available stock",
            "value": 200,
            "op": ""
          },
          {
            "text": "Reorder point on Products",
            "value": 200,
            "op": ""
          },
          {
            "text": "200 is below 200? No: equal is not below",
            "value": null,
            "op": ""
          }
        ],
        "expected": "OK",
        "workbook": "OK",
        "cell": "Products!Z13",
        "pass": true
      },
      {
        "id": "TC-6",
        "title": "Expiry window at the boundary: lot PVA2411A",
        "kind": "compare",
        "rule": "Days left = company-supplied expiry date − as-of date. First window: 0 to 30 days, both ends included (Config).",
        "steps": [
          {
            "text": "Expiry date 2026-11-14 − as-of date 2026-10-15",
            "value": 30,
            "op": ""
          },
          {
            "text": "30 days is between 0 and 30? Yes",
            "value": null,
            "op": ""
          }
        ],
        "expected": "<=30",
        "workbook": "<=30",
        "cell": "Batches!N12",
        "pass": true
      }
    ]
  }
};
