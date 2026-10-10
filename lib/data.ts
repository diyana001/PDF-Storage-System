export type CategorySlug =
  | 'reports'
  | 'manuals'
  | 'academic'
  | 'forms'
  | 'legal'
  | 'finance'

export type Category = {
  slug: CategorySlug
  name: string
  description: string
  count: number
}

export type PdfDocument = {
  id: string
  title: string
  description: string
  category: CategorySlug
  author: string
  pages: number
  sizeMb: number
  uploadedAt: string
  downloads: number
  views: number
  tags: string[]
}

export const categories: Category[] = [
  { slug: 'reports', name: 'Reports', description: 'Annual, quarterly and research reports', count: 248 },
  { slug: 'manuals', name: 'Manuals', description: 'Product guides and user handbooks', count: 186 },
  { slug: 'academic', name: 'Academic', description: 'Papers, theses and lecture notes', count: 412 },
  { slug: 'forms', name: 'Forms', description: 'Applications and templates', count: 97 },
  { slug: 'legal', name: 'Legal', description: 'Policies, contracts and agreements', count: 134 },
  { slug: 'finance', name: 'Finance', description: 'Statements, budgets and audits', count: 159 },
]

export const documents: PdfDocument[] = [
  {
    id: 'annual-report-2026',
    title: 'Annual Sustainability Report 2026',
    description:
      'A comprehensive overview of environmental, social and governance performance across all operating regions, including emissions data, workforce metrics and the roadmap to net zero by 2035.',
    category: 'reports',
    author: 'Northwind Group',
    pages: 84,
    sizeMb: 12.4,
    uploadedAt: '2026-09-28',
    downloads: 4820,
    views: 15230,
    tags: ['ESG', 'Sustainability', '2026'],
  },
  {
    id: 'router-x200-manual',
    title: 'Router X200 Installation Manual',
    description:
      'Step-by-step setup, network configuration, firmware updates and troubleshooting for the X200 dual-band router series.',
    category: 'manuals',
    author: 'Lumen Networks',
    pages: 36,
    sizeMb: 4.2,
    uploadedAt: '2026-09-25',
    downloads: 3120,
    views: 8900,
    tags: ['Networking', 'Hardware'],
  },
  {
    id: 'ml-survey-thesis',
    title: 'A Survey of Efficient Transformer Architectures',
    description:
      'Graduate thesis reviewing sparse attention, linear attention and state-space models, with benchmarks on long-context reasoning tasks.',
    category: 'academic',
    author: 'Dr. Amara Okafor',
    pages: 142,
    sizeMb: 8.7,
    uploadedAt: '2026-09-22',
    downloads: 6410,
    views: 21004,
    tags: ['Machine Learning', 'Thesis'],
  },
  {
    id: 'employee-onboarding-form',
    title: 'Employee Onboarding Form',
    description:
      'Standard onboarding packet including personal details, tax declarations, emergency contacts and equipment acknowledgement.',
    category: 'forms',
    author: 'HR Operations',
    pages: 6,
    sizeMb: 0.8,
    uploadedAt: '2026-09-20',
    downloads: 2280,
    views: 4120,
    tags: ['HR', 'Template'],
  },
  {
    id: 'privacy-policy-v4',
    title: 'Data Privacy Policy v4.0',
    description:
      'Updated policy describing data collection, retention periods, user rights under GDPR and CCPA, and breach notification procedures.',
    category: 'legal',
    author: 'Legal & Compliance',
    pages: 18,
    sizeMb: 1.6,
    uploadedAt: '2026-09-18',
    downloads: 1940,
    views: 6020,
    tags: ['GDPR', 'Policy'],
  },
  {
    id: 'q3-financial-statement',
    title: 'Q3 2026 Financial Statement',
    description:
      'Unaudited quarterly results including income statement, balance sheet, cash flow analysis and segment performance commentary.',
    category: 'finance',
    author: 'Finance Office',
    pages: 28,
    sizeMb: 3.1,
    uploadedAt: '2026-09-15',
    downloads: 2875,
    views: 7310,
    tags: ['Quarterly', 'Earnings'],
  },
  {
    id: 'market-outlook-2027',
    title: 'Global Market Outlook 2027',
    description:
      'Forecasts for key industries, macroeconomic indicators and emerging market opportunities over the next 18 months.',
    category: 'reports',
    author: 'Insight Research',
    pages: 64,
    sizeMb: 9.3,
    uploadedAt: '2026-09-10',
    downloads: 3560,
    views: 11840,
    tags: ['Forecast', 'Economy'],
  },
  {
    id: 'lab-safety-handbook',
    title: 'Laboratory Safety Handbook',
    description:
      'Mandatory safety procedures, chemical handling guidelines, PPE requirements and emergency response protocols for research labs.',
    category: 'manuals',
    author: 'Campus Safety',
    pages: 52,
    sizeMb: 5.5,
    uploadedAt: '2026-09-05',
    downloads: 1720,
    views: 3980,
    tags: ['Safety', 'Research'],
  },
  {
    id: 'calculus-lecture-notes',
    title: 'Calculus II Lecture Notes',
    description:
      'Complete semester lecture notes covering integration techniques, sequences and series, parametric equations and polar coordinates.',
    category: 'academic',
    author: 'Prof. Lin Wei',
    pages: 210,
    sizeMb: 14.8,
    uploadedAt: '2026-08-30',
    downloads: 7930,
    views: 25110,
    tags: ['Mathematics', 'Lecture'],
  },
  {
    id: 'vendor-agreement-template',
    title: 'Vendor Service Agreement Template',
    description:
      'Editable master service agreement covering scope, payment terms, SLAs, confidentiality and termination clauses.',
    category: 'legal',
    author: 'Legal & Compliance',
    pages: 14,
    sizeMb: 1.1,
    uploadedAt: '2026-08-26',
    downloads: 2110,
    views: 5240,
    tags: ['Contract', 'Template'],
  },
  {
    id: 'expense-claim-form',
    title: 'Expense Reimbursement Form',
    description:
      'Submit travel and business expenses with itemized receipts, approval signatures and cost center allocation.',
    category: 'forms',
    author: 'Finance Office',
    pages: 2,
    sizeMb: 0.4,
    uploadedAt: '2026-08-20',
    downloads: 3390,
    views: 6870,
    tags: ['Finance', 'Template'],
  },
  {
    id: 'budget-plan-2027',
    title: 'Departmental Budget Plan 2027',
    description:
      'Proposed operating and capital budgets by department, with year-over-year comparisons and headcount planning assumptions.',
    category: 'finance',
    author: 'Finance Office',
    pages: 40,
    sizeMb: 2.9,
    uploadedAt: '2026-08-14',
    downloads: 1260,
    views: 3010,
    tags: ['Budget', 'Planning'],
  },
]

export const adminUser = {
  name: 'Alex Morgan',
  email: 'alex.morgan@pdfhub.io',
  initials: 'AM',
  role: 'Administrator',
}

export const downloadedIds = [
  'ml-survey-thesis',
  'q3-financial-statement',
  'router-x200-manual',
  'calculus-lecture-notes',
  'privacy-policy-v4',
]

export const savedIds = ['annual-report-2026', 'market-outlook-2027', 'vendor-agreement-template']

export type Member = {
  id: string
  name: string
  email: string
  initials: string
  role: 'Admin' | 'Editor' | 'Member'
  status: 'Active' | 'Invited' | 'Suspended'
  downloads: number
  joined: string
}

export const members: Member[] = [
  { id: 'u1', name: 'Alex Morgan', email: 'alex.morgan@pdfhub.io', initials: 'AM', role: 'Admin', status: 'Active', downloads: 214, joined: '2024-11-02' },
  { id: 'u2', name: 'Sarah Johnson', email: 'sarah.johnson@pdfhub.io', initials: 'SJ', role: 'Member', status: 'Active', downloads: 86, joined: '2025-03-14' },
  { id: 'u3', name: 'Daniel Kim', email: 'daniel.kim@pdfhub.io', initials: 'DK', role: 'Editor', status: 'Active', downloads: 132, joined: '2025-01-21' },
  { id: 'u4', name: 'Priya Patel', email: 'priya.patel@pdfhub.io', initials: 'PP', role: 'Member', status: 'Invited', downloads: 0, joined: '2026-10-01' },
  { id: 'u5', name: 'Marcus Lee', email: 'marcus.lee@pdfhub.io', initials: 'ML', role: 'Member', status: 'Active', downloads: 47, joined: '2025-07-09' },
  { id: 'u6', name: 'Elena Rossi', email: 'elena.rossi@pdfhub.io', initials: 'ER', role: 'Editor', status: 'Active', downloads: 158, joined: '2025-02-18' },
  { id: 'u7', name: 'Tom Becker', email: 'tom.becker@pdfhub.io', initials: 'TB', role: 'Member', status: 'Suspended', downloads: 12, joined: '2025-09-30' },
]

export type ActivityEntry = {
  id: string
  user: string
  initials: string
  action: 'Uploaded' | 'Downloaded' | 'Updated' | 'Deleted'
  documentTitle: string
  time: string
}

export const activity: ActivityEntry[] = [
  { id: 'a1', user: 'Alex Morgan', initials: 'AM', action: 'Uploaded', documentTitle: 'Annual Sustainability Report 2026', time: '12 min ago' },
  { id: 'a2', user: 'Sarah Johnson', initials: 'SJ', action: 'Downloaded', documentTitle: 'A Survey of Efficient Transformer Architectures', time: '28 min ago' },
  { id: 'a3', user: 'Daniel Kim', initials: 'DK', action: 'Updated', documentTitle: 'Router X200 Installation Manual', time: '1 hr ago' },
  { id: 'a4', user: 'Marcus Lee', initials: 'ML', action: 'Downloaded', documentTitle: 'Calculus II Lecture Notes', time: '2 hr ago' },
  { id: 'a5', user: 'Elena Rossi', initials: 'ER', action: 'Uploaded', documentTitle: 'Q3 2026 Financial Statement', time: '3 hr ago' },
  { id: 'a6', user: 'Alex Morgan', initials: 'AM', action: 'Deleted', documentTitle: 'Legacy Travel Policy (2019)', time: 'Yesterday' },
]

export const weeklyDownloads = [
  { day: 'Mon', value: 420 },
  { day: 'Tue', value: 560 },
  { day: 'Wed', value: 510 },
  { day: 'Thu', value: 690 },
  { day: 'Fri', value: 740 },
  { day: 'Sat', value: 380 },
  { day: 'Sun', value: 310 },
]

export const TODAY = '2026-10-08'

export const fileTypes = ['Standard PDF', 'PDF/A (Archival)', 'Fillable PDF'] as const
export type FileType = (typeof fileTypes)[number]

export function getFileType(doc: Pick<PdfDocument, 'category'>): FileType {
  if (doc.category === 'forms') return 'Fillable PDF'
  if (doc.category === 'legal') return 'PDF/A (Archival)'
  return 'Standard PDF'
}

export function daysAgo(iso: string) {
  return Math.round((Date.parse(TODAY) - Date.parse(iso)) / 86_400_000)
}

export function getDocument(id: string) {
  return documents.find((d) => d.id === id)
}

export function getCategory(slug: CategorySlug) {
  return categories.find((c) => c.slug === slug)!
}

export function formatSize(mb: number) {
  return mb < 1 ? `${Math.round(mb * 1024)} KB` : `${mb.toFixed(1)} MB`
}

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US', { notation: n >= 10000 ? 'compact' : 'standard' }).format(n)
}
