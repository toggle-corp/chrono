// NOTE: Route HERE
export interface Route {
    path?: string;
    url?: string;
    isExact?: boolean;
    params?: {
        userId?: number;
        userGroupId?: number;
        projectId?: number;
    };
    routeState?: object; // stricter rule here
}
