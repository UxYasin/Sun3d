export type NameplateSize = '5:3' | '4:2' | '4:3';

export type TemplateCategory =
  | 'Modern Acrylic'
  | 'Classic Wood'
  | 'Royal Brass & Slate'
  | 'Minimalist Stone'
  | 'Traditional Heritage'
  | 'Contemporary Glass';

export type EditableFieldKey = 'houseName' | 'proprietor' | 'address' | 'holdingNumber';

export interface TextPlacementConfig {
  houseName: {
    fontFamily: string;
    fontSizeClass: string;
    fontWeight: string;
    textTransform?: 'uppercase' | 'capitalize' | 'none';
    letterSpacing?: string;
    color: string;
    subColor?: string;
  };
  proprietor: {
    fontFamily: string;
    fontSizeClass: string;
    fontWeight: string;
    prefix?: string;
    color: string;
  };
  address: {
    fontFamily: string;
    fontSizeClass: string;
    color: string;
  };
  holdingNumber: {
    fontFamily: string;
    fontSizeClass: string;
    badgeStyle?: boolean;
    prefix?: string;
    color: string;
  };
}

export interface TemplateStyle {
  background: string;
  textureOverlay?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  boxShadow?: string;
  standoffScrewType: 'silver-round' | 'brass-round' | 'black-hex' | 'none' | 'gold-cap';
  accentLineColor?: string;
  badgeAccent?: string;
  glowEffect?: string;
  materialFinish: string;
}

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  supportedSizes: NameplateSize[];
  thumbnail: string;
  description: string;
  material: string;
  priceStartingAt: number; // in BDT (Bangladeshi Taka)
  badge?: 'Popular' | 'Featured' | 'New' | 'Best Value';
  enabled?: boolean;
  style: TemplateStyle;
  textConfig: TextPlacementConfig;
  editableFields: EditableFieldKey[];
  defaultValues: {
    houseName: string;
    proprietor: string;
    address: string;
    holdingNumber: string;
  };
  createdAt: string;
}

export interface BusinessSettings {
  businessName: string;
  contactPhone: string;
  contactEmail: string;
  defaultCurrency: string;
  defaultOrderStatus: ProductionStatus;
  workshopAddress: string;
}

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  lastOrderDate?: string;
}

export interface TypographyConfig {
  fontFamily: 'serif' | 'sans' | 'mono';
  fontWeight: 'normal' | 'semibold' | 'bold' | 'extrabold';
  textAlign: 'left' | 'center' | 'right';
  fontSizeScale: 'compact' | 'standard' | 'prominent';
}

export interface ColorConfig {
  textColor: string;
  accentColor?: string;
}

export interface NameplateDesignState {
  id?: string;
  templateId: string;
  size: NameplateSize;
  houseName: string;
  proprietor: string;
  address: string;
  holdingNumber: string;
  typography: TypographyConfig;
  colors: ColorConfig;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export type ProductionStatus =
  | 'New'
  | 'Payment Pending'
  | 'Paid'
  | 'Working'
  | 'Ready'
  | 'Completed'
  | 'Cancelled';

export type PaymentStatus = 'unpaid' | 'submitted' | 'paid' | 'rejected';

export type PaymentMethod = 'bKash' | 'Nagad';

export interface PaymentSettings {
  bkashNumber: string;
  bkashAccountType: string;
  bkashInstructions: string;
  bkashEnabled: boolean;
  nagadNumber: string;
  nagadAccountType: string;
  nagadInstructions: string;
  nagadEnabled: boolean;
}

export interface CustomerDesign {
  id: string;
  userId: string;
  templateId: string;
  size: NameplateSize;
  houseName: string;
  proprietor: string;
  address: string;
  holdingNumber: string;
  typography?: TypographyConfig;
  colors?: ColorConfig;
  updatedAt: string;
}

export interface StatusHistoryItem {
  status: ProductionStatus;
  timestamp: string;
  note?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  designId: string;
  templateId: string;
  size: NameplateSize;
  houseName: string;
  proprietor: string;
  address: string;
  holdingNumber: string;
  finalDesignData: NameplateDesignState;
  price: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  productionStatus: ProductionStatus;
  statusHistory?: StatusHistoryItem[];
  transactionId?: string;
  senderPhone?: string;
  paymentNote?: string;
  createdAt: string;
  updatedAt: string;
}


