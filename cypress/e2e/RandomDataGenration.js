export const getRandomUserData = (baseFirstName, baseLastName) => {
  
  const generateRandomNumberSuffix = (length) => {
    const digits = '0123456789';
    return Array.from({ length }, () => digits[Math.floor(Math.random() * digits.length)]).join('');
  };
  
  const randomNumberSuffix = generateRandomNumberSuffix(4);
  
  const user = {
    firstName: baseFirstName,
    lastName: `${baseLastName}${randomNumberSuffix}`,
  };
  
  return user;
}