import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import LoginForm from 'components/LoginForm'
export interface ILoginProps {
}

class LoginPage extends PureComponent<ILoginProps> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSubmit = (userData) => {
        
    };


    
    public render() {
        return (
            <div>
                <LoginForm onSubmit={this.handleSubmit}>
                </LoginForm>
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
    LoginPage
);

