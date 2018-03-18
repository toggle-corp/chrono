import React from 'react';
import {
    withRouter,
    Link,
    RouteComponentProps,
} from 'react-router-dom';
import Redux from 'redux';
import { connect } from 'react-redux';

import { reverseRoute } from '../../vendor/react-store/utils/common';
import List from '../../vendor/react-store/components/View/List';
import DropdownMenu from '../../vendor/react-store/components/Action/DropdownMenu';
import DropdownGroup from '../../vendor/react-store/components/Action/DropdownMenu/Group';

import {
    logoutAction,
    activeUserSelector,
} from '../../redux';
import { RootState, ActiveUser } from '../../redux/interface';

import {
    pathNames,
    iconNames,
} from '../../constants';
import { CloakSettings } from '../../constants/validLinks';

import Cloak from '../Cloak';
import styles from './styles.scss';

const defaultProps = {
    className: '',
    links: [],
};

type CloakSettingsWithKey = CloakSettings & { key: string };

interface OwnProps extends RouteComponentProps<{}> {
    className?: string;
    links: CloakSettingsWithKey[];
}
interface PropsFromDispatch {
    logout(): void;
}
interface PropsFromState {
    activeUser: ActiveUser;
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
}

class NavDrop extends React.PureComponent<Props, State> {
    static defaultProps = defaultProps;

    static dropdownItemIcons: {
        [key: string]: string
    } = {
        login: iconNames.person,
        workspace: iconNames.globe,
    };

    static getDropItemKey = (item: CloakSettingsWithKey): string => item.key;

    renderDropItem = (key: string, item: CloakSettingsWithKey) => {
        const {
            activeUser = {},
        } = this.props;

        const params = {
            userId: activeUser.userId,
        };

        const iconName = NavDrop.dropdownItemIcons[key];

        return (
            <Cloak
                key={key}
                requireLogin={item.requireLogin}
                requireAdminRights={item.requireAdminRights}
                requireDevMode={item.requireDevMode}
                render={() => (
                    <Link
                        to={reverseRoute(pathNames[key], params)}
                        className={styles['dropdown-item']}
                    >
                        {iconName && <span className={`${iconName} ${styles.icon}`} />}
                        {key}
                    </Link>
                )}
            />
        );
    }

    handleLogoutButtonClick = () => {
        this.props.logout();
    }

    render() {
        const {
            activeUser,
            links,
            className,
        } = this.props;

        // const currentValidLinks = validLinks[this.currentPath];
        const userName = activeUser.displayName || 'Anon';

        return (
            <DropdownMenu
                className={className}
                iconName={iconNames.person}
                title={userName}
            >
                <DropdownGroup>
                    <List
                        data={links}
                        keyExtractor={NavDrop.getDropItemKey}
                        modifier={this.renderDropItem}
                    />
                </DropdownGroup>
                <Cloak
                    requireLogin
                    render={
                        () => (
                            <DropdownGroup>
                                <button
                                    className={styles.dropdownItem}
                                    onClick={this.handleLogoutButtonClick}
                                >
                                    <span className={`${styles.icon} ${iconNames.logout}`} />
                                    Logout
                                </button>
                            </DropdownGroup>
                        )
                    }
                />
            </DropdownMenu>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    activeUser: activeUserSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    logout: () => dispatch(logoutAction()),
});

export default withRouter(
    connect<PropsFromState, PropsFromDispatch, OwnProps>(mapStateToProps, mapDispatchToProps)(NavDrop)
);
