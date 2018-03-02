import jwtDecode from 'jwt-decode';

import update from '../../vendor/react-store/utils/immutable-update';

import createReducerWithMap from '../../utils/createReducerWithMap';
import schema from '../../schema';
import initialAuthState from '../initial-state/auth';
import { Auth, Token, ActiveUser } from '../interface';

// TYPE

export const LOGIN_ACTION = 'auth/LOGIN';
export const LOGOUT_ACTION = 'auth/LOGOUT';
export const AUTHENTICATE_ACTION = 'auth/AUTHENTICATE_ACTION';
export const SET_ACCESS_TOKEN_ACTION = 'auth/SET_ACCESS_TOKEN';

// ACTION-CREATOR

export const loginAction = ({ access, refresh }: Token) => ({
    type: LOGIN_ACTION,
    access,
    refresh,
});

export const authenticateAction = () => ({
    type: AUTHENTICATE_ACTION,
});

export const logoutAction = () => ({
    type: LOGOUT_ACTION,
});

export const setAccessTokenAction = (access: string) => ({
    type: SET_ACCESS_TOKEN_ACTION,
    access,
});

// HELPER
const decodeAccessToken = (access: string) => {
    const decodedToken: ActiveUser = jwtDecode(access);
    try {
        schema.validate(decodedToken, 'accessToken');
        return {
            userId: decodedToken.userId,
            username: decodedToken.username,
            displayName: decodedToken.displayName,
            isSuperuser: decodedToken.isSuperuser,
            exp: decodedToken.exp,
        };
    } catch (ex) {
        console.warn(ex);
        return {};
    }
};

// REDUCER

const login = (state: Auth, action: { type: string, access: string, refresh: string}) => {
    const { access, refresh } = action;
    const decodedToken = decodeAccessToken(access);
    const settings = {
        token: { $set: {
            access,
            refresh,
        } },
        activeUser: { $set: decodedToken },
    };
    return update(state, settings);
};

const authenticate = (state: Auth) => {
    const settings = {
        authenticated: { $set: true },
    };
    return update(state, settings);
};

const logout = () => initialAuthState;

const setAccessToken = (state: Auth, action: { type: string, access: string }) => {
    const { access } = action;
    const decodedToken = decodeAccessToken(access);
    const settings = {
        token: { $merge: {
            access,
        } },
        activeUser: { $set: decodedToken },
    };
    return update(state, settings);
};

interface Reducers {
    [key: string]: ((state: Auth, action: object) => Auth);
}

export const authReducers: Reducers = {
    [LOGIN_ACTION]: login,
    [AUTHENTICATE_ACTION]: authenticate,
    [LOGOUT_ACTION]: logout,
    [SET_ACCESS_TOKEN_ACTION]: setAccessToken,
};

const authReducer = createReducerWithMap(authReducers, initialAuthState);
export default authReducer;
