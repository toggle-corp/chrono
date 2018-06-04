import { Map } from '../../utils/map';

export const enum ROUTE {
    exclusivelyPublic = 'exclusively-public',
    public = 'public',
    private = 'private',
}

export interface RouteSetting {
    type: ROUTE;
    redirectTo?: string;
    order: number;
    loader: () => any; // tslint:disable-line no-any
    // Undefined for 404 case
    path: string | undefined;
    links: Map<CloakSettings>;
    hideNavbar?: boolean;
    name: string;
}

export interface CloakSettings {
    requireDevMode?: boolean;
    requireLogin?: boolean;
    requireAdminRights?: boolean;
}
