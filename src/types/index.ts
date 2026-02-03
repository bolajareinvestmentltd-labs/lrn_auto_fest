// Core type definitions for IAF 2026

export type TicketType = 'REGULAR' | 'VIP_BRONZE' | 'VIP_SILVER' | 'VIP_GOLD' | 'VIP_DIAMOND';

export type GroupSize = 'SINGLE' | 'GROUP_2' | 'GROUP_4';

export type OrderStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export type PaymentMethod = 'PAYSTACK' | 'FLUTTERWAVE' | 'OPAY' | 'BANK_TRANSFER';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type VendorStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'SETUP_COMPLETE' | 'CANCELLED';

export interface TicketInfo {
  id: string;
  type: TicketType;
  name: string;
  description: string;
  totalUnits: number;
  soldUnits: number;
  presaleActive: boolean;
  presaleSinglePrice?: number;
  presaleGroup2Price?: number;
  presaleGroup4Price?: number;
  onsaleSinglePrice?: number;
  onsaleGroup2Price?: number;
  onsaleGroup4Price?: number;
  vipSeating: boolean;
  eventPack: boolean;
  merchandise: boolean;
  premiumExperience?: string;
  priorityRide: boolean;
  pradoPickup: boolean;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  userId: string;
  ticketType: TicketType;
  groupSize: GroupSize;
  quantity: number;
  totalPrice: number;
  parkingPasses: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  createdAt: Date;
  paidAt?: Date;
}

export interface TicketCode {
  id: string;
  orderId: string;
  ticketCode: string;
  qrCode: string;
  qrCodeUrl?: string;
  parkingPass1?: string;
  parkingPass2?: string;
  scanned: boolean;
  scannedAt?: Date;
}

export interface VendorData {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  productType: string;
  status: VendorStatus;
  bookingFee: number;
  paidAt?: Date;
  createdAt: Date;
}

export interface EventConfig {
  eventName: string;
  eventDate: Date;
  eventLocation: string;
  presaleEndDate: Date;
  onSaleStartDate: Date;
  maxVendors: number;
  vendorBookingFee: number;
}
