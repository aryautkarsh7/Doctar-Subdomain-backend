require('dotenv').config();
const mongoose = require('mongoose');
const SubSubCategory = require('./models/SubSubCategory');

const data = [
  {
    name: "Abdominal Surgery - Exploratory & Emergency",
    slug: "abdominal-surgery-exploratory-emergency",
    categorySlug: "general-surgery",
    subCategorySlug: "abdominal-surgery-general",
    order: 1,
    keywords: ["Exploratory laparotomy","Emergency laparotomy for peritonitis","Laparotomy for abdominal trauma","Damage control laparotomy","Relook laparotomy","Laparotomy for intestinal obstruction","Laparotomy for hollow viscus perforation","Laparotomy for intra-abdominal bleeding","Abdominal packing and re-packing","Temporary abdominal closure","Abdominal compartment syndrome decompression"]
  },
  {
    name: "Abdominal Surgery - Diagnostic",
    slug: "abdominal-surgery-diagnostic",
    categorySlug: "general-surgery",
    subCategorySlug: "abdominal-surgery-general",
    order: 2,
    keywords: ["Diagnostic laparoscopy","Staging laparoscopy","Second-look laparotomy","Laparoscopy for acute abdomen"]
  },
  {
    name: "Esophageal Surgery",
    slug: "esophageal-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "esophageal-surgery",
    order: 3,
    keywords: ["Esophagectomy","McKeown esophagectomy","Transhiatal esophagectomy","Minimally invasive esophagectomy","Esophageal perforation repair","Boerhaave syndrome repair","Heller cardiomyotomy","Laparoscopic Heller myotomy","Esophageal stenting","Esophageal foreign body removal","Cricopharyngeal myotomy","Esophageal diverticulectomy"]
  },
  {
    name: "Stomach Surgery - Gastric Resection",
    slug: "stomach-surgery-gastric-resection",
    categorySlug: "general-surgery",
    subCategorySlug: "stomach-surgery",
    order: 4,
    keywords: ["Total gastrectomy","Subtotal gastrectomy","Distal gastrectomy","Proximal gastrectomy","Sleeve gastrectomy","Wedge resection of stomach","Billroth I","Billroth II","Roux-en-Y gastric reconstruction","Completion gastrectomy"]
  },
  {
    name: "Stomach Surgery - Peptic Ulcer",
    slug: "stomach-surgery-peptic-ulcer",
    categorySlug: "general-surgery",
    subCategorySlug: "stomach-surgery",
    order: 5,
    keywords: ["Truncal vagotomy","Selective vagotomy","Highly selective vagotomy","Pyloroplasty","Gastroenterostomy","Oversewing of bleeding peptic ulcer","Omental patch repair","Graham patch repair"]
  },
  {
    name: "Small Intestine Surgery",
    slug: "small-intestine-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "small-intestine-surgery",
    order: 6,
    keywords: ["Small bowel resection","Segmental jejunal resection","Segmental ileal resection","Ileocecal resection","Adhesiolysis","Laparoscopic adhesiolysis","Meckel diverticulectomy","Loop ileostomy","End ileostomy","Ileostomy closure","Feeding jejunostomy"]
  },
  {
    name: "Appendix Surgery",
    slug: "appendix-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "appendix-surgery",
    order: 7,
    keywords: ["Open appendectomy","Laparoscopic appendectomy","Interval appendectomy","Appendectomy for perforated appendicitis","Appendiceal abscess drainage","Incidental appendectomy","Appendiceal mucocele excision"]
  },
  {
    name: "Colon Surgery",
    slug: "colon-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "colon-surgery",
    order: 8,
    keywords: ["Right hemicolectomy","Left hemicolectomy","Sigmoid colectomy","Subtotal colectomy","Total colectomy","Hartmann procedure","Colostomy formation","Colostomy closure","Surgery for colonic volvulus","Surgery for colonic perforation"]
  },
  {
    name: "Rectum & Anus Surgery",
    slug: "rectum-anus-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "rectum-anus-surgery",
    order: 9,
    keywords: ["Anterior resection","Low anterior resection","Total mesorectal excision","Abdominoperineal resection","Hemorrhoidectomy","Stapled hemorrhoidopexy","Lateral internal sphincterotomy","Fistulotomy","Pilonidal sinus excision","Perianal abscess drainage","Sphincteroplasty"]
  },
  {
    name: "Liver Surgery",
    slug: "liver-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "liver-surgery",
    order: 10,
    keywords: ["Right hepatectomy","Left hepatectomy","Segmentectomy","Laparoscopic liver resection","Liver abscess drainage","Hydatid cyst surgery","Hepatorrhaphy","Hepaticojejunostomy"]
  },
  {
    name: "Gallbladder & Bile Duct Surgery",
    slug: "gallbladder-bile-duct-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "gallbladder-surgery",
    order: 11,
    keywords: ["Open cholecystectomy","Laparoscopic cholecystectomy","Subtotal cholecystectomy","Common bile duct exploration","Choledochoduodenostomy","Choledochojejunostomy","Bile duct repair","T-tube insertion","Cholangiography"]
  },
  {
    name: "Pancreatic Surgery",
    slug: "pancreatic-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "pancreatic-surgery",
    order: 12,
    keywords: ["Whipple procedure","Pancreaticoduodenectomy","Distal pancreatectomy","Total pancreatectomy","Laparoscopic distal pancreatectomy","Pancreatic necrosectomy","Cystogastrostomy","Pseudocyst drainage"]
  },
  {
    name: "Spleen Surgery",
    slug: "spleen-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "spleen-surgery",
    order: 13,
    keywords: ["Open splenectomy","Laparoscopic splenectomy","Splenorrhaphy","Partial splenectomy","Splenectomy for trauma","Splenectomy for hypersplenism"]
  },
  {
    name: "Hernia Surgery - Inguinal",
    slug: "hernia-surgery-inguinal",
    categorySlug: "general-surgery",
    subCategorySlug: "hernia-surgery",
    order: 14,
    keywords: ["Open inguinal hernia repair","Lichtenstein mesh repair","Laparoscopic TEP repair","Laparoscopic TAPP repair","Bilateral inguinal hernia repair","Strangulated inguinal hernia repair","Pediatric inguinal hernia repair","Shouldice technique","Bassini technique"]
  },
  {
    name: "Hernia Surgery - Femoral & Umbilical",
    slug: "hernia-surgery-femoral-umbilical",
    categorySlug: "general-surgery",
    subCategorySlug: "hernia-surgery",
    order: 15,
    keywords: ["Femoral hernia repair","Umbilical hernia repair","Paraumbilical hernia repair","Mayo technique","Laparoscopic umbilical hernia repair","Strangulated femoral hernia repair"]
  },
  {
    name: "Hernia Surgery - Incisional & Hiatal",
    slug: "hernia-surgery-incisional-hiatal",
    categorySlug: "general-surgery",
    subCategorySlug: "hernia-surgery",
    order: 16,
    keywords: ["Incisional hernia repair","Component separation technique","Laparoscopic IPOM repair","Hiatal hernia repair","Nissen fundoplication","Toupet fundoplication","Giant incisional hernia repair","Robotic hernia repair"]
  },
  {
    name: "Breast Surgery - Benign",
    slug: "breast-surgery-benign",
    categorySlug: "general-surgery",
    subCategorySlug: "breast-surgery",
    order: 17,
    keywords: ["Excision of fibroadenoma","Breast cyst excision","Breast abscess drainage","Microdochectomy","Total duct excision","Gynaecomastia excision","Core needle biopsy","Open breast biopsy"]
  },
  {
    name: "Breast Surgery - Malignant",
    slug: "breast-surgery-malignant",
    categorySlug: "general-surgery",
    subCategorySlug: "breast-surgery",
    order: 18,
    keywords: ["Wide local excision","Lumpectomy","Simple mastectomy","Modified radical mastectomy","Skin-sparing mastectomy","Nipple-sparing mastectomy","Bilateral prophylactic mastectomy","Sentinel lymph node biopsy","Axillary lymph node dissection"]
  },
  {
    name: "Thyroid Surgery",
    slug: "thyroid-surgery-general",
    categorySlug: "general-surgery",
    subCategorySlug: "thyroid-surgery",
    order: 19,
    keywords: ["Total thyroidectomy","Hemithyroidectomy","Subtotal thyroidectomy","Thyroid lobectomy","Completion thyroidectomy","Thyroidectomy for Graves disease","Central neck dissection","Modified radical neck dissection","Thyroglossal cyst excision","Sistrunk procedure"]
  },
  {
    name: "Parathyroid Surgery",
    slug: "parathyroid-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "parathyroid-surgery",
    order: 20,
    keywords: ["Bilateral neck exploration","Minimally invasive parathyroidectomy","Subtotal parathyroidectomy","Total parathyroidectomy","Parathyroid autotransplantation","Re-operative parathyroid surgery"]
  },
  {
    name: "Adrenal Surgery",
    slug: "adrenal-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "adrenal-surgery",
    order: 21,
    keywords: ["Open adrenalectomy","Laparoscopic adrenalectomy","Bilateral adrenalectomy","Adrenalectomy for phaeochromocytoma","Adrenalectomy for Conn syndrome","Adrenalectomy for Cushing syndrome","Adrenalectomy for adrenal carcinoma"]
  },
  {
    name: "Skin & Soft Tissue Surgery",
    slug: "skin-soft-tissue-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "skin-soft-tissue-surgery",
    order: 22,
    keywords: ["Sebaceous cyst excision","Lipoma excision","Ganglion cyst excision","Wide local excision melanoma","Split thickness skin graft","Full thickness skin graft","Soft tissue sarcoma excision","Lymph node biopsy","Inguinal lymph node dissection"]
  },
  {
    name: "Neck Surgery",
    slug: "neck-surgery-general",
    categorySlug: "general-surgery",
    subCategorySlug: "neck-surgery",
    order: 23,
    keywords: ["Branchial cyst excision","Cystic hygroma excision","Submandibular gland excision","Radical neck dissection","Selective neck dissection","Carotid body tumor excision","Cervical lymphadenectomy","Ludwig angina drainage"]
  },
  {
    name: "Vascular Surgery",
    slug: "vascular-surgery-general",
    categorySlug: "general-surgery",
    subCategorySlug: "vascular-surgery",
    order: 24,
    keywords: ["Femoral embolectomy","Brachial embolectomy","Arteriovenous fistula creation","Varicose vein surgery","Saphenous vein stripping","Below knee amputation","Above knee amputation","Venous cutdown","Deep vein thrombosis surgery"]
  },
  {
    name: "Trauma Surgery",
    slug: "trauma-surgery-general",
    categorySlug: "general-surgery",
    subCategorySlug: "trauma-surgery",
    order: 25,
    keywords: ["Damage control laparotomy","Splenectomy for trauma","Hepatorrhaphy","Bowel repair for trauma","Emergency thoracotomy","Fasciotomy for compartment syndrome","Necrotizing fasciitis debridement","Wound debridement"]
  },
  {
    name: "Bariatric Surgery",
    slug: "bariatric-surgery-general",
    categorySlug: "general-surgery",
    subCategorySlug: "bariatric-surgery",
    order: 26,
    keywords: ["Roux-en-Y gastric bypass","Mini gastric bypass","Laparoscopic sleeve gastrectomy","Gastric banding","Biliopancreatic diversion","Revisional bariatric surgery","Conversion of sleeve to bypass"]
  },
  {
    name: "Laparoscopic Surgery",
    slug: "laparoscopic-surgery-general",
    categorySlug: "general-surgery",
    subCategorySlug: "laparoscopic-surgery",
    order: 27,
    keywords: ["Diagnostic laparoscopy","Laparoscopic appendectomy","Laparoscopic cholecystectomy","Laparoscopic hernia repair","Laparoscopic colectomy","Laparoscopic splenectomy","Laparoscopic adrenalectomy","Laparoscopic gastric bypass","Laparoscopic adhesiolysis"]
  },
  {
    name: "Stomas & Intestinal Diversion",
    slug: "stomas-intestinal-diversion",
    categorySlug: "general-surgery",
    subCategorySlug: "stomas-intestinal-diversion",
    order: 28,
    keywords: ["Loop colostomy","End colostomy","Loop ileostomy","End ileostomy","Stoma closure","Stoma revision","Continent ileostomy","Defunctioning stoma"]
  },
  {
    name: "Thoracic Surgery",
    slug: "thoracic-surgery-general",
    categorySlug: "general-surgery",
    subCategorySlug: "thoracic-surgery",
    order: 29,
    keywords: ["Chest drain insertion","Open thoracotomy","Decortication of lung","VATS drainage","Lung biopsy","Mediastinotomy","Sympathectomy","Rib resection","Pleural biopsy"]
  },
  {
    name: "Colorectal Cancer Surgery",
    slug: "colorectal-cancer-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "colorectal-cancer-surgery",
    order: 30,
    keywords: ["Right hemicolectomy for cancer","Low anterior resection","Total mesorectal excision","Abdominoperineal resection","HIPEC","Cytoreductive surgery","Transanal total mesorectal excision","Pelvic exenteration"]
  },
  {
    name: "Endocrine Tumour Surgery",
    slug: "endocrine-tumour-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "endocrine-tumour-surgery",
    order: 31,
    keywords: ["Gastrinoma resection","Insulinoma resection","Carcinoid tumor resection","Pheochromocytoma resection","Paraganglioma resection","MEN surgery","Glomus tumor resection"]
  },
  {
    name: "Peritoneum & Retroperitoneum",
    slug: "peritoneum-retroperitoneum-surgery",
    categorySlug: "general-surgery",
    subCategorySlug: "peritoneum-surgery",
    order: 32,
    keywords: ["Intraperitoneal abscess drainage","Subphrenic abscess drainage","Peritoneal lavage","Omentectomy","Mesenteric cyst excision","Retroperitoneal sarcoma excision","Retroperitoneal lymph node dissection"]
  },
  {
    name: "Access & Wound Management",
    slug: "access-wound-management",
    categorySlug: "general-surgery",
    subCategorySlug: "access-procedures",
    order: 33,
    keywords: ["Central venous line insertion","Port-a-cath insertion","Hickman line insertion","Wound debridement","VAC dressing","Split thickness skin graft","Tracheostomy","PEG tube insertion","Necrotizing fasciitis debridement","Fournier gangrene debridement"]
  }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  for(const item of data) {
    await SubSubCategory.findOneAndUpdate(
      { slug: item.slug },
      item,
      { upsert: true, new: true }
    );
  }
  console.log('Seeded:', data.length, 'sub-sub categories');
  process.exit();
});
