import {
    wsEndpoint,
    Rest,
    commonHeaderForPost,
    p,
} from '../config/rest';
import {
    RestPostBody,
    PostUserGroupBody,
    PatchUserGroupBody,
    PostGroupMembershipBody,
} from './interface';

export type UserGroupUrlParams = {
    fields?: string[];
    user?: number;
};

export const urlForUserGroups: string = `${wsEndpoint}/user-groups/`;

export const createUrlForUserGroups = (params: UserGroupUrlParams): string => (
    `${wsEndpoint}/user-groups/?${p(params)}`
);
export const createUrlForUserGroup = (userGroupId: number): string =>
    `${wsEndpoint}/user-groups/${userGroupId}/`;

// get user membership
export const urlForGroupMembership: string = `${wsEndpoint}/group-memberships/`;

export const createUrlForGroupMembership = (memberId: number): string =>
    `${wsEndpoint}/group-memberships/${memberId}/`;

export const createParamsForPostUserGroup = (
    { title, description }: PostUserGroupBody,
): RestPostBody => ({
    method: Rest.POST,
    headers: commonHeaderForPost,
    body: JSON.stringify({
        title,
        description ,
    }),
});

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

export const createParamsForUserGroupPatch = (
    { title, description }: PatchUserGroupBody,
) : RestPostBody => ({
    method: Rest.PATCH,
    headers: commonHeaderForPost,
    body: JSON.stringify({
        title,
        description,
    }),
});
