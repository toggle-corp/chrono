import React, {
    PureComponent,
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { pathNames, iconNames } from '../../../../constants';
import { reverseRoute } from '../../../../vendor/react-store/utils/common';
import DangerButton from '../../../../vendor/react-store/components/Action/Button/DangerButton';

import {
    RootState,
    Member,
} from '../../../../redux/interface';

import * as styles from './styles.scss';

import {
    isUserAdminSelector,
} from '../../../../redux';

interface OwnProps {
    row: Member;
    onRemove(row: Member): void;
}
interface PropsFromState{
    isAdmin: boolean;
}
interface PropsFromDispatch { }
type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States { }

export class ActionButtons extends PureComponent<Props, States> {

    constructor(props: Props) {
        super(props);
    }

    getLinks = () => {
        const {
            row,
        } = this.props;

        const linkToMember = {
            pathname: reverseRoute(
                pathNames.profile,
                {
                    userId: row.member,
                },
            ),
        };
        return { linkToMember };
    }

    onRemove = () => {
        const { onRemove, row } = this.props;
        onRemove(row);
    }

    render () {
        const links = this.getLinks();
        const { isAdmin } = this.props;

        if (!isAdmin) {
            return (
                <Link
                    className={styles.memberLink}
                    title="View Profile"
                    to={links.linkToMember}
                >
                    <i className={iconNames.openLink} />
                </Link>
            );
        }
        return (
            <Fragment>
                <DangerButton
                    title="Remove Member"
                    onClick={this.onRemove}
                    iconName={iconNames.delete}
                    smallVerticalPadding
                    transparent
                />
                <Link
                    className={styles.memberLink}
                    title="Edit Member"
                    to={links.linkToMember}
                >
                    <i className={iconNames.edit} />
                </Link>
            </Fragment>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    isAdmin: isUserAdminSelector(state),
});

export default connect<PropsFromState,PropsFromDispatch, OwnProps>(
    mapStateToProps,
)(ActionButtons);
