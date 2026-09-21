import { CustomerDesign, CustomerOrder } from '@/types/nameplate';

export const INITIAL_MOCK_DESIGNS: CustomerDesign[] = [
  {
    id: 'des-rahman-01',
    userId: 'usr-cust-01',
    templateId: 'tpl-obsidian-gold',
    size: '5:3',
    houseName: 'The Rahman Family',
    proprietor: 'Md. Anisur Rahman',
    address: 'House 24, Road 7, Dhanmondi, Dhaka',
    holdingNumber: '12/A',
    updatedAt: '2026-03-18T14:30:00Z'
  },
  {
    id: 'des-rahman-02',
    userId: 'usr-cust-01',
    templateId: 'tpl-teak-brass',
    size: '4:2',
    houseName: 'Chowdhury Bari',
    proprietor: 'M. A. Chowdhury',
    address: 'Chawkbazar Road, Chittagong',
    holdingNumber: '84/B',
    updatedAt: '2026-03-15T10:15:00Z'
  }
];

export const INITIAL_MOCK_ORDERS: CustomerOrder[] = [
  {
    id: 'ord-10492',
    orderNumber: 'SN-10492',
    customerId: 'usr-cust-01',
    customerName: 'Md. Anisur Rahman',
    customerEmail: 'customer@example.com',
    customerPhone: '+880 1711-223344',
    designId: 'des-rahman-01',
    templateId: 'tpl-obsidian-gold',
    size: '5:3',
    houseName: 'The Rahman Family',
    proprietor: 'Md. Anisur Rahman',
    address: 'House 24, Road 7, Dhanmondi, Dhaka',
    holdingNumber: '12/A',
    finalDesignData: {
      templateId: 'tpl-obsidian-gold',
      size: '5:3',
      houseName: 'The Rahman Family',
      proprietor: 'Md. Anisur Rahman',
      address: 'House 24, Road 7, Dhanmondi, Dhaka',
      holdingNumber: '12/A',
      typography: {
        fontFamily: 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSizeScale: 'standard'
      },
      colors: {
        textColor: '#f6d365',
        accentColor: '#d4af37'
      }
    },
    price: 2450,
    paymentMethod: 'bKash',
    paymentStatus: 'paid',
    productionStatus: 'Working',
    transactionId: 'BK9A87B41C',
    senderPhone: '+880 1711-223344',
    paymentNote: 'Front gate installation',
    createdAt: '2026-03-16T11:20:00Z',
    updatedAt: '2026-03-17T09:00:00Z'
  },
  {
    id: 'ord-10380',
    orderNumber: 'SN-10380',
    customerId: 'usr-cust-01',
    customerName: 'Md. Anisur Rahman',
    customerEmail: 'customer@example.com',
    customerPhone: '+880 1711-223344',
    designId: 'des-rahman-02',
    templateId: 'tpl-carrara-stone',
    size: '4:3',
    houseName: 'Swapnonir Residence',
    proprietor: 'Dr. Sharmin Akter',
    address: 'Plot 312, Road 11/A, Dhanmondi',
    holdingNumber: 'Flat 5-C',
    finalDesignData: {
      templateId: 'tpl-carrara-stone',
      size: '4:3',
      houseName: 'Swapnonir Residence',
      proprietor: 'Dr. Sharmin Akter',
      address: 'Plot 312, Road 11/A, Dhanmondi',
      holdingNumber: 'Flat 5-C',
      typography: {
        fontFamily: 'sans',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSizeScale: 'standard'
      },
      colors: {
        textColor: '#0f172a',
        accentColor: '#475569'
      }
    },
    price: 2800,
    paymentMethod: 'Nagad',
    paymentStatus: 'paid',
    productionStatus: 'Completed',
    transactionId: 'NG77123984',
    senderPhone: '+880 1711-223344',
    createdAt: '2026-03-02T15:45:00Z',
    updatedAt: '2026-03-06T17:30:00Z'
  }
];
