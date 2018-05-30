import {
    Rest,
    wsEndpoint,
    commonHeaderForPost,
} from '../config/rest';

import {
    RestPostBody,
    PostGroupMembershipBody,
} from './interface';

export const urlForGroupMembership: string = `${wsEndpoint}/group-memberships/`;

// get user membership
export const createUrlForGroupMembership = (memberId: number): string =>
    `${wsEndpoint}/group-memberships/${memberId}/`;

export const createParamsForPostGroupMembership = (
    { member, group, role }: PostGroupMembershipBody,
): RestPostBody => ({
    method: Rest.POST,
    headers: commonHeaderForPost,
    body: JSON.stringify({
        member,
        group,
        role,
    }),
});
