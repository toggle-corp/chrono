import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
    UserProject,
} from '../../../../redux/interface';
import { pathNames, iconNames } from '../../../../constants';
import { reverseRoute } from '#rsu/common';
import DangerButton from '#rsca/Button/DangerButton';

import * as styles from './styles.scss';

interface OwnProps {
    row: UserProject;
    onRemove(row: UserProject): void;
}
interface PropsFromState { }
interface PropsFromDispatch { }
type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States { }

export class ActionButtons extends React.PureComponent<Props, States> {

    getLinks = () => {
        const {
            row,
        } = this.props;

        const edit = {
            pathname: reverseRoute(
                pathNames.project,
                {
                    projectId: row.id,
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
                    title="Remove Project"
                    onClick={this.onRemove}
                    iconName={iconNames.delete}
                    smallVerticalPadding
                    transparent
                />
                <Link
                    className={styles.editLink}
                    title="Edit Project"
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
