import "@styles/dashboard/dashboard.scss";
import Alpine from "alpinejs";

const isDev = import.meta.env.MODE === "development";
const SERVER_URL = isDev ? "http://localhost:80/" : "/";

Alpine.store("pd", {
  phone: "",
  error: "",
  needToCreatePatient: false,
  patientName: "",
  patientAge: null,
  patientGender: "male",
  async proceed() {
    if (this.validate()) {
      console.log(this.phone);
      const checkResponse = await checkUser(this.phone);
      if (checkResponse?.error) {
        this.error = checkResponse.error;
        return;
      }
      this.needToCreatePatient = !checkResponse?.userExists;

      if (this.needToCreatePatient) {
        const patient = {
          phone: this.phone,
          name: this.patientName,
          age: this.patientAge,
          gender: this.patientGender,
        };
        if (patient.phone && patient.name && patient.age && patient.gender) {
          console.log(patient);
          createPatient(patient, () => {
            console.log("User created...");
            window.location.href = isDev
              ? "/prescribe/?phone=" + this.phone
              : "/chillpill/prescribe/?phone=" + this.phone;
          });
        }
      } else {
        window.location.href = isDev
          ? "/prescribe/?phone=" + this.phone
          : "/chillpill/prescribe/?phone=" + this.phone;
      }
    }
  },
  validate() {
    this.error = "";
    const phoneRgx = /(^(01){1}[3456789]{1}(\d){8})$/;
    const phoneIsValid = phoneRgx.test(this.phone) && this.phone.length === 11;
    const patientNameIsValid = this.patientName.length > 0;
    const patientAgeIsValid = this.patientAge > 0;
    if (!phoneIsValid) this.error = "Please put a valid phone number";
    if (!patientNameIsValid && this.needToCreatePatient)
      this.error = "Please put a valid patient name";
    if (!patientAgeIsValid && this.needToCreatePatient)
      this.error = "Please put a valid patient age";
    if (this.needToCreatePatient) return phoneIsValid && patientNameIsValid && patientAgeIsValid;
    else return phoneIsValid;
  },
});

window.Alpine = Alpine;

Alpine.start();

const checkUser = async (phoneNumber) => {
  const response = await fetch(
    `${SERVER_URL}chillpill/functions/checkUser.php?phone=${phoneNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response?.ok) {
    const data = await response.json();
    console.log(data);
    return data;
  } else {
    return { error: `${response.status} Error` };
  }
};

const createPatient = async (patient, onSuccess) => {
  const response = await fetch(
    `${SERVER_URL}chillpill/functions/createPatient.php?phone=${patient?.phone}&name=${patient?.name}&age=${patient?.age}&gender=${patient?.gender}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response?.ok) {
    const data = await response.json();
    console.log(data);
    onSuccess();
    return data;
  } else {
    return { error: `${response.status} Error` };
  }
};
