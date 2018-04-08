import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
    UserUserGroup,
} from '../../../../redux/interface';
import { pathNames, iconNames } from '../../../../constants';
import { reverseRoute } from '../../../../vendor/react-store/utils/common';
import DangerButton from '../../../../vendor/react-store/components/Action/Button/DangerButton';

import * as styles from './styles.scss';

interface OwnProps {
    row: UserUserGroup;
    onRemove(row: UserUserGroup): void;
}
interface PropsFromState { }
interface PropsFromDispatch { }
type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States { }

export class ActionButtons extends React.PureComponent<Props, States> {

    constructor(props: Props) {
        super(props);
    }

    getLinks = () => {
        const {
            row,
        } = this.props;

        const edit = {
            pathname: reverseRoute(
                pathNames.userGroup,
                {
                    userGroupId: row.id,
                },
            ),
        };

        return { edit };
    }

    onRemove = () => {
        const { onRemove, row } = this.props;
        onRemove(row);
    }

    render() {
        const links = this.getLinks();

        return (
            <React.Fragment>
                <DangerButton
                    title="Remove UserGroup"
                    onClick={this.onRemove}
                    iconName={iconNames.delete}
                    smallVerticalPadding
                    transparent
                />
                <Link
                    className={styles.editLink}
                    title="Edit UserGroup"
                    to={links.edit}
                >
                    <i className={iconNames.edit} />
                </Link>
            </React.Fragment>
        );
    }
}

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    undefined,
)(ActionButtons);
