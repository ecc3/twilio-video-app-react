export interface IPatientDetails {
  PatientName: string;
  DateOfBirth: string;
  Sex: string;
  NhsNumber: string;
  Postcode: string;
}

export const getPatientDetails = async (patientId: string) => {
  return new Promise((reject, resolve) => {
    resolve({
      PatientName: 'Vincent Forbes',
      DateOfBirth: '03-Mar-1990 (20 Years)',
      Sex: 'Male',
      NhsNumber: '123456789',
      Postcode: 'LS12 1FS',
    });
  });
};
