import React from 'react';
import {  reduxForm, InjectedFormProps, Form, Field } from 'redux-form';
export interface ILoginFormProps extends InjectedFormProps{
    // user: any;
    onSubmit: any;
}

function LoginForm (props: ILoginFormProps ) {
    
    const { handleSubmit, submitting} = props;

    return (
        <div className="flex ">
            <div className='flex flex-col items-center justify-center w-1/2 h-screen bg-red-500'>
              <div className='m-10'> Hello</div>
              <div> Hello</div>

            </div>
            <div className='w-1/2 h-screen bg-green-500 items-center justify-center flex'>
            <Form className="flex  w-10 bg-black h-10">
                <Field
                className='bg-white w-2 h-2'
                    name='email'
                    component="text"/>
                    <Field
                    name='email'
                    component="text"/>
            </Form>
            </div>
           
        </div>
    );

}

export default reduxForm({
    form: 'login',
})(LoginForm);
