import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import LoginForm from 'components/LoginForm'
export interface IRegisterPageProps {
}

class RegisterPage extends PureComponent<IRegisterPageProps> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSubmit = (userData) => {
    };


    
    public render() {
        return (
            <div>
                {/* <LoginForm onSubmit={this.handleSubmit}></LoginForm> */}
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

