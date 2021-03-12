const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = "Username is required";
  }
  if (!values.firstName) {
    errors.firstName = "First name is required";
  }
  if (!values.lastName) {
    errors.lastName = "Last name is required";
  }
  if (!values.password) {
    errors.password = "Password is required";
  }
  if (!values.recipeName) {
    errors.recipeName = "Recipe name is required";
  }
  if (!values.time) {
    errors.time = "Time is required";
  }
  if (values.newPassword && !values.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  }
  
  return errors;
};

export default validate;
