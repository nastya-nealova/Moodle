import React, { Component } from "react";
import { WrappedFieldProps } from "redux-form";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";

interface IInputFieldProps {
  id: string;
  type: string;
  placeholder: string;
  label: string;
}

class InputField extends Component<WrappedFieldProps & IInputFieldProps> {
  render() {
    const {
      input,
      type,
      placeholder,
      label,
      meta: { touched, error, warning, asyncValidating },
    } = this.props;
    return (
      <div className="w-full flex flex-row items-baseline">
           {type!=="hidden" && label && <label className='text-base mr-5 text-gray-700'>{label}</label>}
        <div className="flex-col flex-1">
        <div className="flex flex-row rounded-lg bg-gray-200">
          <input
            className=" rounded-lg outline-none border-none focus:bg-gray-300 bg-gray-200 w-full py-5 px-5"
            {...input}
            type={type}
            placeholder={ placeholder}
          />
          <div className="text-lg mr-5 self-center">
            {type!=="hidden" && touched &&
              ((!error && <FaCheck className=" text-green-500" />) ||
                (type!=="hidden" && error && <FaExclamationCircle className="text-red-500" />))}
          </div>
        </div>
        <div className="text-sm text-red-500 h-8">
          {touched && error && <span>{error}</span>}
      

        </div>
        </div>
      </div>
    );
  }
}

export default InputField;