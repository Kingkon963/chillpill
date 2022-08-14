import "@styles/prescribe/prescribe.scss";
import Alpine from "alpinejs";

Alpine.store("prescription", {
  currMed: {
    name: "",
    intakeAfterMeal: 0,
    atBreakfast: 0,
    atlunch: 0,
    atDinner: 0,
    remarks: "",
  },
  medicines: [],
  resetCurrMed() {
    this.currMed = {
      name: "",
      intakeAfterMeal: true,
      atBreakfast: false,
      atlunch: false,
      atDinner: false,
      remarks: "",
    };
  },
  addMedicine() {
    this.medicines.push({ ...this.currMed, id: this.medicines.length + 1 });
    this.resetCurrMed();
  },
  deleteMedicine(id) {
    this.medicines = this.medicines.filter((med) => med.id !== id);
  },
});

window.Alpine = Alpine;

Alpine.start();
