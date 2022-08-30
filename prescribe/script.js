import "@styles/prescribe/prescribe.scss";
import Alpine from "alpinejs";

const isDev = import.meta.env.MODE === "development";
const SERVER_URL = isDev ? "http://localhost:80/" : "/";

Alpine.store("prescription", {
  currMed: {
    id: -1,
    name: "",
    intakeAfter: "0",
    atBreakfast: false,
    atLunch: false,
    atDinner: false,
    remarks: "",
  },
  medicines: [],
  medSuggestions: [
    // {
    //   medicineId: 1,
    //   name: "Napa 10mg",
    //   manufacturer: "",
    // },
    // {
    //   medicineId: 2,
    //   name: "Bashok 10mg",
    //   manufacturer: "",
    // },
  ],
  openHint: false,
  selectMed(id, name) {
    this.currMed = { ...this.currMed, id, name };
    this.openHint = false;
  },
  fetchHints() {
    if (this.currMed.name.length < 2) return;
    fetch(SERVER_URL + "chillpill/functions/getMedicineHints.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: this.currMed.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.openHint = true;
        this.medSuggestions = data.data;
      });
  },
  resetCurrMed() {
    this.currMed = {
      id: -1,
      name: "",
      intakeAfter: "0",
      atBreakfast: false,
      atLunch: false,
      atDinner: false,
      remarks: "",
    };
  },
  addMedicine() {
    if (this.currMed.name === "" || this.openHint) return;
    if (this.medicines.find((med) => med.id === this.currMed.id)) return;
    this.medicines.push({ ...this.currMed });
    this.resetCurrMed();
  },
  deleteMedicine(id) {
    this.medicines = this.medicines.filter((med) => med.id !== id);
  },
  send(doctorId, patientId) {
    console.log(this.medicines);
    fetch(`${SERVER_URL}chillpill/functions/createPrescription.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctorId,
        patientId,
        medicines: this.medicines,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          console.log(data);
          let msg = `Dear Sir, ${data.doctorName} has prescribed you the following medicines. \n`;
          const page = document.getElementById("prespriptionPage");
          page.removeChild(page.lastChild);
          page.removeChild(page.lastChild);
          msg += page.innerText;
          console.log(msg);
          var xhr = new XMLHttpRequest();
          xhr.open(
            "GET",
            `https://platform.clickatell.com/messages/http/send?apiKey=Hpxv3IC4RrKZWWfz-mpCTw==&to=88${patientId}&content=${encodeURIComponent(
              msg
            )}`,
            true
          );
          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
              console.log("success");
            }
          };
          xhr.send();
          window.location.href = isDev ? "/dashboard/" : "/chillpill/dashboard/";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
});

window.Alpine = Alpine;

Alpine.start();
