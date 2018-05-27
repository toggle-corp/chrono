import {
    wsEndpoint,
} from '../config/rest';

export const urlForGroupMembership: string = `${wsEndpoint}/group-memberships/`;
// get user membership

export const createUrlForGroupMembership = (memberId: number): string =>
    `${wsEndpoint}/group-memberships/${memberId}`;
