import { Notification } from '../contexts/NotificationContext';

// Initial notifications for property transfers and fraud alerts
export const initialNotifications: Omit<Notification, 'id'>[] = [
  // Recent fraud alerts for new properties
  {
    type: 'fraud_detected',
    title: 'Fraud Alert - Forged Title Property',
    message: 'Property #47: Multiple ownership transfers detected in 4 days. Document hash verification failed.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    read: false,
    propertyId: '47',
    propertyName: 'Forged Title Property',
    actionUrl: '/property/47',
    severity: 'critical',
  },
  {
    type: 'property_frozen',
    title: 'Property Frozen - Scam Property Alert',
    message: 'Property #42: Frozen due to 9 fraud alerts. Investigation initiated.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: false,
    propertyId: '42',
    propertyName: 'Scam Property Alert',
    actionUrl: '/property/42',
    severity: 'critical',
  },
  {
    type: 'suspicious_activity',
    title: 'Suspicious Activity - Counterfeit Property',
    message: 'Property #39: Document verification failed. Property flagged for review.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: false,
    propertyId: '39',
    propertyName: 'Counterfeit Property',
    actionUrl: '/property/39',
    severity: 'high',
  },
  {
    type: 'property_frozen',
    title: 'Property Frozen - Suspicious Villa',
    message: 'Property #24: Frozen after multiple rapid ownership changes detected.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    read: false,
    propertyId: '24',
    propertyName: 'Suspicious Villa',
    actionUrl: '/property/24',
    severity: 'high',
  },
  {
    type: 'fraud_detected',
    title: 'Fraud Alert - Illegal Construction',
    message: 'Property #31: Building permits do not match registered documents. 7 fraud alerts.',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    read: false,
    propertyId: '31',
    propertyName: 'Illegal Construction',
    actionUrl: '/property/31',
    severity: 'high',
  },
  // Transfer notifications for properties with history
  {
    type: 'transfer_complete',
    title: 'Transfer Complete - Office Tower',
    message: 'Property #27: Successfully transferred to new owner. Ownership verified.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: false,
    propertyId: '27',
    propertyName: 'Office Tower',
    actionUrl: '/property/27',
    severity: 'low',
  },
  {
    type: 'transfer_complete',
    title: 'Transfer Complete - Corporate Headquarters',
    message: 'Property #17: Multi-signature transfer completed successfully.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    propertyId: '17',
    propertyName: 'Corporate Headquarters',
    actionUrl: '/property/17',
    severity: 'low',
  },
  {
    type: 'transfer_complete',
    title: 'Transfer Complete - City Apartment Complex',
    message: 'Property #21: Ownership transferred. All signatures verified.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
    propertyId: '21',
    propertyName: 'City Apartment Complex',
    actionUrl: '/property/21',
    severity: 'low',
  },
  {
    type: 'transfer_complete',
    title: 'Transfer Complete - Luxury Penthouse',
    message: 'Property #43: High-value property transfer completed with multi-sig approval.',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    read: true,
    propertyId: '43',
    propertyName: 'Luxury Penthouse',
    actionUrl: '/property/43',
    severity: 'medium',
  },
  {
    type: 'transfer_complete',
    title: 'Transfer Complete - Modern Loft',
    message: 'Property #26: Transfer completed. New owner verified via KYC.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    read: true,
    propertyId: '26',
    propertyName: 'Modern Loft',
    actionUrl: '/property/26',
    severity: 'low',
  },
  // Property registration notifications
  {
    type: 'property_registered',
    title: 'New Property - Ranch Estate',
    message: 'Property #50: Large land property registered. Pending verification.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: false,
    propertyId: '50',
    propertyName: 'Ranch Estate',
    actionUrl: '/property/50',
    severity: 'low',
  },
  {
    type: 'property_registered',
    title: 'New Property - Eco-Friendly Home',
    message: 'Property #45: Sustainable property registered with green certification.',
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
    read: false,
    propertyId: '45',
    propertyName: 'Eco-Friendly Home',
    actionUrl: '/property/45',
    severity: 'low',
  },
  {
    type: 'transfer_requested',
    title: 'Transfer Pending - Student Housing',
    message: 'Property #35: Transfer request submitted. Awaiting multi-sig approval.',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    read: false,
    propertyId: '35',
    propertyName: 'Student Housing',
    actionUrl: '/property/35',
    severity: 'medium',
  },
  {
    type: 'transfer_requested',
    title: 'Transfer Pending - Beach House',
    message: 'Property #28: Transfer initiated. Time-lock period active (2 days remaining).',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
    read: false,
    propertyId: '28',
    propertyName: 'Beach House',
    actionUrl: '/property/28',
    severity: 'medium',
  },
  {
    type: 'verification_complete',
    title: 'Verification Complete - Data Center',
    message: 'Property #46: All documents verified. Property approved for transfer.',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    read: true,
    propertyId: '46',
    propertyName: 'Data Center',
    actionUrl: '/property/46',
    severity: 'low',
  },
  {
    type: 'document_uploaded',
    title: 'Documents Updated - Historic Manor',
    message: 'Property #33: Updated property documents uploaded and verified.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    propertyId: '33',
    propertyName: 'Historic Manor',
    actionUrl: '/property/33',
    severity: 'low',
  },
  {
    type: 'transfer_complete',
    title: 'Transfer Complete - Seaside Villa',
    message: 'Property #48: Coastal property transferred successfully.',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    read: true,
    propertyId: '48',
    propertyName: 'Seaside Villa',
    actionUrl: '/property/48',
    severity: 'low',
  },
  {
    type: 'transfer_complete',
    title: 'Transfer Complete - Duplex Residence',
    message: 'Property #37: Residential property transfer completed.',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    read: true,
    propertyId: '37',
    propertyName: 'Duplex Residence',
    actionUrl: '/property/37',
    severity: 'low',
  },
  {
    type: 'transfer_complete',
    title: 'Transfer Complete - Suburban House',
    message: 'Property #30: Family home transferred with all documents verified.',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    read: true,
    propertyId: '30',
    propertyName: 'Suburban House',
    actionUrl: '/property/30',
    severity: 'low',
  },
  {
    type: 'fraud_detected',
    title: 'Fraud Alert - Fraudulent Estate',
    message: 'Property #19: Suspicious ownership pattern detected. Property under investigation.',
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    read: true,
    propertyId: '19',
    propertyName: 'Fraudulent Estate',
    actionUrl: '/property/19',
    severity: 'high',
  },
];
