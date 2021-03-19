import React from 'react';
import {  reduxForm, InjectedFormProps, Form, Field } from 'redux-form';
import InputField from './InputField';
export interface IRegistrationFormProps extends InjectedFormProps{
    // user: any;
    onSubmit: any;
}

function RegistrationForm (props: IRegistrationFormProps ) {
    
    const { handleSubmit, submitting} = props;

    return (
        
        <div className="flex ">
            
            <div className='flex flex-col items-center justify-center w-1/2 h-screen'  style={{ backgroundImage: "url(/static/MainPage.png)"}}>
              <div className='m-10'> Hello</div>
              <div> Hello</div>

            </div>
            
            <div className='w-1/2 h-screen bg-purple-200 items-center justify-center flex'>
                
            <div>
                {/* <link rel='stylesheet' href='/build/tailwind.css'/> */}
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,600;1,400&display=swap" rel="stylesheet"></link>
                <Form onSubmit={handleSubmit}>

            <h1 className='text-4xl font-semibold'> Sign Up</h1>
                {/* <label className='block py-2 px-4'> First Name </label> */}
                <Field
                // className='border-gray-400 block py-2 px-4 w-full rounded focus:outline-none focus:border-purple-400'
                type = 'text'
                name = 'firstname'
                // id = 'firstname'
                component={InputField}
                label = 'First Name'
                // placeholder='ddddd'
                />
                 <label className='block py-2 px-4'> Last Name </label>
                <input
                className='border-gray-400 block py-2 px-4 w-full rounded focus:outline-none focus:border-purple-400'

                type = 'text'
                name = 'lastname'
                id = 'lastname'
                />
                    
                 <label className='block py-2 px-4'> Email Address </label>
                <input
                className='border-gray-400 block py-2 px-4 w-full rounded focus:outline-none focus:border-purple-400'
                type = 'text'
                name = 'emailaddress'
                id = 'emailaddress'
                />
                <label className='block py-2 px-4'> Password </label>
                <input
                className='border-gray-400 block py-2 px-4 w-full rounded focus:outline-none focus:border-purple-400'
                type = 'text'
                name = 'password'
                id = 'password'
                />
                <label className='block py-2 px-4'> Confirm Password </label>
                <input
                className='border-gray-400 block py-2 px-4 w-full rounded focus:outline-none focus:border-purple-400'
                type = 'text'
                name = 'confirmpassword'
                id = 'confirmpassword'
                />
                <button
                className= 'w-full py-2 px-4 font-bold text-black bg-purple-500 rounded-full hover:bg-purple-700 focus:outline-none focus:shadow-outline'
                type="button"
                >
                    </button>
                </Form>

            </div>
            </div>
           
        </div>
    );

}

export default reduxForm({
    form: 'registration',
})(RegistrationForm);