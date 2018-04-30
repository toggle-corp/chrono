import { Auth } from '../interface';

const initialAuthState: Auth = {
    // is user authenticated?
    authenticated: false,

    // user token
    token: {
        access: undefined,
        refresh: undefined,
    },

    // currently logged-in user-detail
    activeUser: {
        isSuperuser: undefined,
        userId: undefined,
        username: undefined,
        displayName: undefined, // can change later
        exp: undefined,
    },
};
export default initialAuthState;
