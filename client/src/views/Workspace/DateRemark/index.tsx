import React from 'react';

import Faram, {
//    FaramErrors,
//    FaramValues,
    FaramSchema,
} from '#rscg/Faram';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';

import {
    requiredCondition,
} from '#rscg/Faram/validations';

import * as styles from './styles.scss';

import LoadingAnimation from '#rscv/LoadingAnimation';
import NonFieldErrors from '#rsci/NonFieldErrors';
import TextArea from '#rsci/TextArea';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerButton from '#rsca/Button/DangerButton';
import {
    RequestCoordinator,
    RequestClient,
    requestMethods,
} from '../../../request';

interface Props {
    date: {
        year: Number;
        month: Number;
        day: Number;
    };
    closeModal(): void;
    saveDateRemark: any;
}
interface States {
    pending: boolean;
    pristine: boolean;
    faramValues: Object;
    faramErrors: any;
}

class DateRemark extends React.PureComponent<Props, States> {
    schema: FaramSchema;  // TODO: more concrete

    constructor(props: Props) {
        super(props);
        this.state = {
            pending: false,
            pristine: true,
            faramValues: {},
            faramErrors: {},
        };
        this.schema = {
            fields: {
                remark: [requiredCondition],
            },
        };
    }

    handleFaramChange = (values: any, errors: any) => {
        this.setState({
            pristine: false,
            faramValues: values,
            faramErrors: errors,
        });
    }

    handleFaramSubmit = ({ remark }: { remark: String }) => {
        const { date } = this.props;
        const params = {
            remark,
            date: `${date.year}-${date.month}-${date.day}`,
        };
        this.props.saveDateRemark.do(params);
    }

    handleFaramError = (errors: any) => {
        this.setState({ faramErrors: errors });
    }

    render () {
        const {
            pending,
            faramValues,
            faramErrors,
            pristine,
        } = this.state;
        const { closeModal, date } = this.props;
        return (
            <Modal>
                <Faram
                    className={styles.dateRemarkForm}
                    schema={this.schema}
                    value={faramValues}
                    error={faramErrors}
                    onChange={this.handleFaramChange}
                    onValidationSuccess={this.handleFaramSubmit}
                    onValidationFailure={this.handleFaramError}
                    disabled={pending}
                >
                    <ModalHeader title={`Remark for ${date.year}-${date.month}-${date.day}`} />
                    <ModalBody>
                        {pending && <LoadingAnimation />}
                        <NonFieldErrors faramElement />
                        <TextArea
                            faramElementName="remark"
                            label="Remark"
                            placeholder="Remark"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <div className={styles.actionButtons}>
                            <DangerButton
                                className={styles.actionButton}
                                onClick={closeModal}
                                disabled={pending}
                            >
                                Cancel
                            </DangerButton>
                            <PrimaryButton
                                className={styles.actionButton}
                                type="submit"
                                disabled={pristine || pending}
                            >
                                Save
                            </PrimaryButton>
                        </div>
                    </ModalFooter>
                </Faram>
            </Modal>
        );
    }
}

const requests = {
    saveDateRemark: {
        method: requestMethods.POST,
        url: '/date-remarks/',
        body: ({ params }: any) => params, // TODO: type
        onSuccess: ({ props, response }: { props: Props, response: any }) => { // TODO: type
            props.closeModal();
            // TODO: push data to REDUX stuffs
        },
    },
};

export default RequestCoordinator(RequestClient(requests)(DateRemark));
