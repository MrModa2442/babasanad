export enum Role {
    Notary = 'notary',
    ProvincialHead = 'provincial_head',
    NationalHead = 'national_head',
}

export interface User {
    id: string;
    name: string;
    role: Role;
    roleName: string;
    officeName?: string;
    province?: string;
    city?: string;
}

export type DocumentStatus = 'پیش‌نویس' | 'ثبت نهایی' | 'نیاز به بازبینی';

export interface Document {
    id: string;
    notaryId: string;
    officeName: string;
    type: string;
    parties: {
        seller: string;
        buyer: string;
    };
    subject: string;
    content: string; // The body of the official document
    registrationNumber: string;
    registrationDate: string;
    value: number;
    status: DocumentStatus;
    attachmentName?: string; // e.g., "scan-id.pdf"
}

export type ReportStatus = 'pending' | 'answered';

export interface Report {
    id: string;
    documentId: string;
    senderId: string;
    senderName: string;
    message: string;
    reply?: string;
    status: ReportStatus;
    timestamp: string;
}


export type View = 'dashboard' | 'document_form' | 'settings' | 'registration' | 'reports' | 'role_login';