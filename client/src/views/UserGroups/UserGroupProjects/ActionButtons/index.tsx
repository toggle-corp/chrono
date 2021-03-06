import React, {
    Fragment,
    PureComponent,
} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import DangerButton from '#rsca/Button/DangerButton';
import { reverseRoute } from '#rsu/common';

import {
    pathNames,
    iconNames,
} from '../../../../constants';
import { isUserAdminSelector } from '../../../../redux';
import {
    RootState,
    Project,
} from '../../../../redux/interface';

import * as styles from './styles.scss';

interface OwnProps {
    row: Project;
    onRemove(row: Project): void;
}
interface PropsFromState{
    isAdmin: boolean;
}
interface PropsFromDispatch{}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States{ }

export class ActionButtons extends PureComponent<Props, States> {

    getLinks = () => {
        const {
            row,
        } = this.props;

        const projectLink = {
            pathname: reverseRoute(
                pathNames.project,
                {
                    projectId: row.id,
                },
            ),
        };

        return { projectLink };
    }

    onRemove = () => {
        const { onRemove, row } = this.props;
        onRemove(row);
    }

    render() {
        const links = this.getLinks();
        const { isAdmin } = this.props;

        if (!isAdmin) {
            return (
                <Link
                    className={styles.projectLink}
                    title="View Project"
                    to={links.projectLink}
                >
                    <i className={iconNames.openLink} />
                </Link>
            );
        }
        return (
            <Fragment>
                <DangerButton
                    title="Remove Project"
                    onClick={this.onRemove}
                    iconName={iconNames.delete}
                    smallVerticalPadding
                    transparent
                />
                <Link
                    className={styles.projectLink}
                    title="Edit Project"
                    to={links.projectLink}
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
export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps,
)(ActionButtons);
