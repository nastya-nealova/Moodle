import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import RegistrationForm from 'components/RegistrationForm'
export interface IRegisterProps {
}

class RegisterPage extends PureComponent<IRegisterProps> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSubmit = (userData) => {
    };


    
    public render() {
        return (
            <div>
                <RegistrationForm onSubmit={this.handleSubmit}/>
            </div>
        );
    }
}



const mapStateToProps = (store: any) => {
    return {
    };
};

export default connect(mapStateToProps, {
})(
    RegisterPage
);

