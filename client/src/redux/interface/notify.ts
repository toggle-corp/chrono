export interface Notification {
    type: string;
    title: string;
    message: string;
    dismissable: boolean;
    duration: number;
}

export interface Notify {
    notifications: Notification[];
}
