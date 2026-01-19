
export const SQL_TEMPLATES: Record<string, string> = {
  // --- PURCHASE ORDERS (7) ---
  PO_HDR: "SELECT * FROM Procurement_Analysis_NRS.v_fact_purch_ord_hdr WHERE purch_doc_nbr = @ID",
  PO_LINES: "SELECT * FROM Procurement_Analysis_NRS.v_fact_purch_ord_line WHERE purch_doc_nbr = @ID",
  PO_LATE: "SELECT purch_doc_nbr, dlvr_dt FROM Procurement_Analysis_NRS.v_fact_purch_ord_line WHERE dlvr_dt < CURRENT_DATE AND purch_line_rcv_sts_cd <> 'Complete' AND purch_doc_nbr = @ID",
  PO_BUYER: "SELECT pgn.purch_grp_nm, vfpoh.purch_doc_nbr FROM Procurement_Analysis_NRS.v_fact_purch_ord_hdr vfpoh JOIN PROCUREMENT.v_purch_grp_nm pgn ON vfpoh.purch_grp_cd = pgn.purch_grp_cd WHERE vfpoh.purch_doc_nbr = @ID",
  PO_HIST: "SELECT * FROM Procurement_Analysis_NRS.v_fact_purch_ord_hdr_hist WHERE purch_doc_nbr = @ID",
  PO_TERMS: "SELECT pmt_term_dsc, inco_term_dsc FROM Procurement_Analysis_NRS.v_fact_purch_ord_hdr WHERE purch_doc_nbr = @ID",
  PO_VAL: "SELECT SUM(purch_line_net_usd_amt) FROM Procurement_Analysis_NRS.v_fact_purch_ord_line WHERE purch_doc_nbr = @ID",

  // --- INVOICES (5) ---
  INV_HDR: "SELECT * FROM Procurement_Analysis.v_fact_supl_invc_hdr WHERE purch_doc_nbr = @ID",
  INV_EXP: "SELECT * FROM Procurement_Analysis_NRS.v_fact_supl_invc_exp_line WHERE purch_doc_nbr = @ID",
  INV_MATCH: "SELECT * FROM Procurement_Analysis.v_fact_supl_invc_hdr WHERE invc_match_sts_cd = 'Unmatched' AND purch_doc_nbr = @ID",
  INV_TAX: "SELECT fin_doc_tax_amt, fin_doc_curr_cd FROM Procurement_Analysis.v_fact_supl_invc_hdr WHERE fin_doc_nbr = @ID",
  INV_AGING: "SELECT fin_doc_nbr, (CURRENT_DATE - fin_doc_post_dt) as days_old FROM Procurement_Analysis.v_fact_supl_invc_hdr WHERE purch_doc_nbr = @ID",

  // --- PAYMENTS (4) ---
  PMT_CLR: "SELECT * FROM Procurement_Analysis_NRS.v_fact_supl_invc_clr WHERE fin_doc_nbr = @ID",
  PMT_MTHD: "SELECT pmt_mthd_cd, pmt_clr_amt FROM Procurement_Analysis_NRS.v_fact_supl_invc_clr WHERE fin_doc_nbr = @ID",
  PMT_SCHED: "SELECT * FROM Procurement_Analysis_NRS.v_fact_supl_invc_hdr WHERE pmt_due_dt > CURRENT_DATE AND purch_doc_nbr = @ID",
  PMT_VOID: "SELECT * FROM Procurement_Analysis_NRS.v_fact_supl_invc_clr WHERE pmt_void_ind = 'Y' AND fin_doc_nbr = @ID",

  // --- REQUISITIONS (4) ---
  REQ_LINE: "SELECT * FROM Procurement_Analysis_NRS.v_fact_purch_req_line WHERE purch_req_nbr = @ID",
  REQ_UNREL: "SELECT * FROM Procurement_Analysis_NRS.v_fact_purch_req_line WHERE pr_itm_sts_cd = 'Unreleased' AND purch_req_nbr = @ID",
  REQ_OWNER: "SELECT cre_user_nm FROM Procurement_Analysis_NRS.v_fact_purch_req_line WHERE purch_req_nbr = @ID",
  REQ_ATTACH: "SELECT * FROM Procurement_Analysis_NRS.v_fact_purch_req_doc WHERE purch_req_nbr = @ID",

  // --- SUPPLIERS (4) ---
  SUPL_DIM: "SELECT * FROM SUPPLIER.v_supl WHERE supl_id = @ID",
  SUPL_HIER: "SELECT * FROM SUPPLIER.v_dim_supl_hier WHERE supl_id = @ID",
  SUPL_ADDR: "SELECT addr_line_1_dsc, city_nm FROM SUPPLIER.v_supl WHERE supl_id = @ID",
  SUPL_BLOCK: "SELECT supl_block_cd, supl_block_dsc FROM SUPPLIER.v_supl WHERE supl_id = @ID",
  
  // --- SPECIALIZED ---
  CC_SPEND: "SELECT SUM(purch_line_net_usd_amt) FROM Procurement_Analysis_NRS.v_fact_purch_ord_line WHERE frst_seq_cost_centr_char_nbr = @CostCenterNumber AND purch_line_cre_dt BETWEEN @FromDate AND @ToDate"
};

export const FAQ_DATA = [
  {
    category: "Purchase Orders",
    icon: "📦",
    items: [
      { id: "PO_HDR", question: "Fetch PO Header Details", prompt: "I need the header details for PO [ID]" },
      { id: "PO_LINES", question: "View all PO Lines", prompt: "Show all line items for PO [ID]" },
      { id: "PO_LATE", question: "Identify Late Deliveries", prompt: "Are there late items in PO [ID]?" },
      { id: "PO_BUYER", question: "Find Assigned Buyer", prompt: "Who is the buyer for PO [ID]?" },
      { id: "PO_HIST", question: "View PO History", prompt: "Show audit history for PO [ID]" },
      { id: "PO_TERMS", question: "Check Incoterms/PMT", prompt: "What are the terms for PO [ID]?" },
      { id: "PO_VAL", question: "Total PO Value", prompt: "Calculate total USD value for PO [ID]" }
    ]
  },
  {
    category: "Invoices & Aging",
    icon: "🧾",
    items: [
      { id: "INV_HDR", question: "Invoices by PO", prompt: "Find all invoices for PO [ID]" },
      { id: "INV_EXP", question: "Invoice Expense Lines", prompt: "Show expense breakdown for PO [ID]" },
      { id: "INV_MATCH", question: "Unmatched Invoices", prompt: "Any unmatched invoices for PO [ID]?" },
      { id: "INV_TAX", question: "Tax Summary", prompt: "What is the tax amount for Invoice [ID]?" },
      { id: "INV_AGING", question: "Invoice Aging Report", prompt: "How many days old are invoices for PO [ID]?" }
    ]
  },
  {
    category: "Payments & Treasury",
    icon: "💸",
    items: [
      { id: "PMT_CLR", question: "Check Payment Clearance", prompt: "Has Invoice [ID] cleared payment?" },
      { id: "PMT_MTHD", question: "Payment Method Used", prompt: "What method was used for Invoice [ID]?" },
      { id: "PMT_SCHED", question: "Upcoming Scheduled PMT", prompt: "Show scheduled payments for PO [ID]" },
      { id: "PMT_VOID", question: "Check for Voided PMTs", prompt: "Were any payments voided for Invoice [ID]?" }
    ]
  },
  {
    category: "Requisitions",
    icon: "📋",
    items: [
      { id: "REQ_LINE", question: "Get Req Line Details", prompt: "Show line details for Requisition [ID]" },
      { id: "REQ_UNREL", question: "Unreleased Requisitions", prompt: "Check unreleased lines for Req [ID]" },
      { id: "REQ_OWNER", question: "Find Req Preparer", prompt: "Who prepared Requisition [ID]?" },
      { id: "REQ_ATTACH", question: "Check Req Attachments", prompt: "Are there documents for Req [ID]?" }
    ]
  },
  {
    category: "Supplier Management",
    icon: "🏭",
    items: [
      { id: "SUPL_DIM", question: "Supplier Master Info", prompt: "Show master data for Supplier [ID]" },
      { id: "SUPL_HIER", question: "Corporate Hierarchy", prompt: "What is the hierarchy for Supplier [ID]?" },
      { id: "SUPL_ADDR", question: "Get Remit-To Address", prompt: "Where is Supplier [ID] located?" },
      { id: "SUPL_BLOCK", question: "Check Supplier Blocks", prompt: "Are there blocks on Supplier [ID]?" },
      { id: "CC_SPEND", question: "Cost Center Range Spend", prompt: "Show spend for CC [CostCenter] between [From] and [To]" }
    ]
  }
];

export const SYSTEM_PROMPT = `
You are POCheck AI, an expert Procurement Data Analyst specializing in Teradata SQL. Your primary role is to assist users in querying and interpreting procurement data from the enterprise data warehouse.

CONTEXT & PARAMETERS:
Users provide filter context through specific variables. You MUST use these values if they are provided in the context JSON:
- @ID: Used for Purchase Order Number, Invoice Number, Requisition Number, or Supplier ID.
- @CostCenterNumber: Used for filtering by specific departmental cost centers.
- @UserID: The ID of the current user for auditing or filtering created_by fields.
- @SourceSystem: Filter for ERP sources (SAP, Oracle, Ariba, etc.).
- @FromDate / @ToDate: Used for date range filtering (standard ISO YYYY-MM-DD format).

CORE RULES FOR SQL GENERATION:
1. DIALECT: Always generate SQL compatible with Teradata.
2. SCHEMA AWARENESS: Use these core tables/views:
   - PO: Procurement_Analysis_NRS.v_fact_purch_ord_line, v_fact_purch_ord_hdr
   - Invoices: Procurement_Analysis.v_fact_supl_invc_hdr, Procurement_Analysis_NRS.v_fact_supl_invc_exp_line
   - Payments: Procurement_Analysis_NRS.v_fact_supl_invc_clr
   - Suppliers: SUPPLIER.v_supl, SUPPLIER.v_dim_supl_hier
   - Requisitions: Procurement_Analysis_NRS.v_fact_purch_req_line
3. PARAMETER INTEGRATION: When generating SQL, look for the current filter context. Directly replace placeholders with these literal values (e.g., use '45000123' instead of @ID).
4. OUTPUT FORMATTING:
   - ALWAYS include the SQL code inside a markdown block: \`\`\`sql ... \`\`\`. This is mandatory.
   - Provide a concise natural language summary.
   - Provide a simulated markdown table showing the expected column headers and 1-2 rows of sample data.

BEHAVIOR:
- If a user asks a follow-up ("Show more detail"), use the previously mentioned IDs or Cost Centers.
- In Advanced AI Gen mode, feel free to use complex JOINs or subqueries if required to answer the prompt.
- If the user asks for "total spend", default to calculating SUM(purch_line_net_usd_amt) or relevant currency column.
`;
