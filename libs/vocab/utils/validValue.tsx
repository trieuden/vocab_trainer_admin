export const validPassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password);
};

export const validEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
export const validUsername = (username: string) => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
};
export const validPhoneNumber = (phoneNumber: string) => {
  const regex = /^(0|84|\+84)(3|5|7|8|9)[0-9]{8}$/;

  return regex.test(phoneNumber);
};
