<template lang="">
  <form class="addform" @submit.prevent="addData">
    <div class="input-form">
      <div class="field has-addons">
        <div class="control">
          <label for="studentSelect">Nama Murid</label>
          <select id="studentSelect" v-model="selectedStudent" class="input">
            <option value="" disabled selected>Pilih Murid</option>
            <option v-for="student in students" :value="student.studentName">
              {{ student.studentName }}
            </option>
          </select>
        </div>
        <div class="control">
          <label for="price">NISN</label>
          <input
            id="price"
            v-model="nisn"
            class="input"
            type="number"
            placeholder="NISN"
          />
        </div>
        <div class="control">
          <label for="gender">Gender</label>
          <input
            id="gender"
            title="gender"
            v-model="gender"
            class="input"
            type="text"
          />
        </div>

        <div class="control">
          <label style="color: transparent" for="">.</label>
          <button :disabled="!studentName" class="button is-info">
            Tambah Data
          </button>
        </div>
      </div>
    </div>
  </form>

  <!-- <div
    style="
      display: flex;
      align-items: center;
      margin: 20px 0;
      justify-content: center;
      gap: 20px;
    "
  >
    <button style="padding: 20px; width: 200px" @click="downloadAsPDF">
      Download as PDF
    </button>
    <button style="padding: 20px; width: 200px" @click="openCommissionModal">
      Hitung Komisi Supplier
    </button>
  </div>

  <div style="display: flex; flex-direction: column; align-items: center">
    <label style="text-align: center; font-size: 20px" for="">Filter</label>
    <select
      style="width: 250px"
      id="author"
      @change="filterDatas"
      v-model="filterData"
      class="input"
    >
      <option value="Indah">Indah</option>
      <option value="Leni">Leni</option>
      <option value="Lisa">Lisa</option>
      <option value="Meta">Meta</option>
      <option value="Dani">Dani</option>
      <option value="Bunda Qory">Bunda Qory</option>
      <option value="Kris Juniati">Kris Juniati</option>
      <option value="Nur">Nur</option>
      <option value="Fiza">Fiza</option>
      <option value="Citra">Citra</option>
      <option value="Bunda Lutfi">Bunda Lutfi</option>
      <option value="Bunda Nessa">Bunda Nessa</option>
    </select>
  </div>

  <div
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 50px;
    "
  >
    <label style="text-align: center; font-size: 20px" for=""></label>
    <div style="display: flex; gap: 10px; align-items: center">
      <input
        style="width: 200px"
        id="startDate"
        v-model="startDate"
        @change="filterDatas"
        class="input"
        type="date"
      />
      <span style="color: white">s/d</span>
      <input
        style="width: 200px"
        id="endDate"
        v-model="endDate"
        @change="filterDatas"
        class="input"
        type="date"
      />
    </div>
  </div> -->

  <div class="table-container">
    <table class="transaction-table" style="padding: 20px">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama</th>
          <th style="width: 150px">NISN</th>
          <th>Gender</th>
          <th>Kelas</th>
          <th>Kebutuhan Khusus</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in filteredDatas" :key="data.id">
          <td>{{ data.No }}</td>
          <td>{{ data.studentName }}</td>
          <td>{{ data.nisn }}</td>
          <td>{{ data.gender }}</td>
          <td>{{ data.kelas }}</td>
          <td>{{ data.abk }}</td>
          <td>
            <button @click="deleteData(data.id)" class="delete-button">
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
// import html2canvas from "html2canvas"; // Import html2canvas
// import jsPDF from "jspdf";

const studentName = ref("");
const nisn = ref("");
const gender = ref("");

const transactionCollectionQuery = query(
  collection(db, "studentBase"),
  orderBy("No", "asc")
  // limit(10)
);
const datas = ref([]);
const filteredDatas = ref([]);

onMounted(() => {
  loadDatas();
  loadStudents(); 
});

const students = ref([]);

const months = [
  { id: 1, time: 'Juli 2023' },
  { id: 2, time: 'Agustus 2023' },
  { id: 3, time: 'September 2023' },
  { id: 4, time: 'Oktober 2023' },
  { id: 5, time: 'November 2023' },
  { id: 6, time: 'Desember 2023' },
  { id: 7, time: 'Januari 2024' },
  { id: 8, time: 'Februari 2024' },
  { id: 9, time: 'Maret 2024' },
  { id: 10, time: 'April 2024' },
  { id: 11, time: 'Mei 2024' },
  { id: 12, time: 'Juni 2024' },
]

const selectedStudent = ref("")

const loadStudents = () => {
  onSnapshot(transactionCollectionQuery, (querySnapshot) => {
    const studentList = [];

    querySnapshot.forEach((doc) => {
      const student = {
        id: doc.id,
        no: doc.No,
        studentName: doc.data().Nama,
      };

      studentList.push(student);
    });

    students.value = studentList;
  });
};
const loadDatas = () => {
  onSnapshot(transactionCollectionQuery, (querySnapshot) => {
    const fbData = [];

    querySnapshot.forEach((doc) => {
      const data = {
        id: doc.id,
        No: doc.data().No,
        studentName: doc.data().Nama,
        nisn: doc.data().NISN,
        gender: doc.data().JK,
        kelas: doc.data().Rombel,
        abk: doc.data().KebutuhanKhusus,
      };

      fbData.push(data);
    });

    datas.value = fbData;
    filteredDatas.value = fbData;
  });
};

const addData = () => {
  const studentData = {
    studentName: studentName.value,
    
    nisn: nisn.value,
    gender: gender.value,
  };

  addDoc(collection(db, "studentBase"), studentData);

  studentName.value = "";
  nis.value = "";
  nisn.value = "";
  gender.value = "";
};

const deleteData = async (id) => {
  deleteDoc(doc(db, "studentBase", id));
};

// const downloadAsPDF = () => {
//   const screenshotElement = document.querySelector(".table-container");

//   html2canvas(screenshotElement).then((canvas) => {
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF();
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save("screenshot.pdf");
//   });
// };

// const filterData = ref("");
// const startDate = ref("");
// const startDate1 = ref("");
// const endDate = ref("");
// const endDate1 = ref("");

// const editDate = ref("");
// const editingDataId = ref("");
// const editSupplier = ref("");
// const editFoodTitle = ref("");
// const editAmount = ref("");
// const editModalOpen = ref(false);
// const editTerjual = ref("");
// const supplyPutra = ref("");
// const supplyPutri = ref("");

// const editPrice = ref("");

// const commissionModalOpen = ref(false);
// const selectedSupplier = ref(""); // Untuk menyimpan nama supplier yang dipilih pada filter
// const commissionTotal = ref(0); // Untuk menyimpan total komisi supplier

// const openCommissionModal = () => {
//   commissionModalOpen.value = true;
// };

// const closeCommissionModal = () => {
//   commissionModalOpen.value = false;
// };

// const calculateCommissionTotal = () => {
//   // Filter data berdasarkan supplier dan rentang tanggal
//   const filteredData = filteredDatas.value.filter((data) => {
//     const dataDate = new Date(data.date);
//     const isSupplierMatching =
//       selectedSupplier.value === "" || data.supplier === selectedSupplier.value;
//     const isDateInRange =
//       dataDate >= new Date(startDate1.value) &&
//       dataDate <= new Date(endDate1.value);

//     return isSupplierMatching && isDateInRange;
//   });

//   // Hitung total komisi supplier
//   commissionTotal.value = filteredData.reduce((total, data) => {
//     return (
//       total + (data.price - calculateCommission(data.price)) * data.terjual
//     );
//   }, 0);
// };

// const editData = async (id) => {
//   const dataIndex = datas.value.findIndex((t) => t.id === id);
//   if (dataIndex !== -1) {
//     const editedData = {
//       amount: editAmount.value,
//       supplier: editSupplier.value,
//       date: editDate.value,
//       terjual: editTerjual.value,
//       price: editPrice.value,
//       foodTitle: editFoodTitle.value,
//       supplyPutra: supplyPutra.value,
//       supplyPutri: supplyPutri.value,

//     };

//     try {
//       await updateDoc(doc(db, "studentBase", id), editedData);
//       datas.value[dataIndex] = {
//         ...datas.value[dataIndex],
//         ...editedData,
//       };
//       closeEditModal();
//     } catch (error) {
//       console.error("Error editing transaction:", error);
//       // Handle error here (e.g., show an error message)
//     }
//   }
//   filterDatas();
// };

// const openEditModal = (id) => {
//   const data = datas.value.find((t) => t.id === id);
//   if (data) {
//     editAmount.value = data.amount;
//     editDate.value = data.date;
//     editFoodTitle.value = data.foodTitle; // Populate editDate
//     editPrice.value = data.price; // Populate editTransactionType
//     editSupplier.value = data.supplier;
//     editTerjual.value = data.terjual;
//     supplyPutra.value = data.putra;
//     supplyPutri.value = data.putri;

//     editingDataId.value = id;
//     editModalOpen.value = true;
//   }
// };

// const closeEditModal = () => {
//   editAmount.value = "";
//   editSupplier.value = "";
//   editDate.value = ""; // Clear editDate
//   editTerjual.value = ""; // Clear editTransactionType
//   editPrice.value = "";
//   editFoodTitle.value = "";
//   supplyPutra.value = "";
//   supplyPutri.value = "";

//   editingDataId.value = "";
//   editModalOpen.value = false;
// };

// const filterDatas = () => {
//   const selectedName = filterData.value;
//   const start = new Date(startDate.value);
//   const end = new Date(endDate.value);

//   filteredDatas.value = datas.value.filter((data) => {
//     const dataDate = new Date(data.date);

//     // Check if the transaction type matches the selected type and falls within the date range
//     const isNameMatching =
//       selectedName === "" || data.supplier === selectedName;
//     const isDateInRange = dataDate >= start && dataDate <= end;

//     return isNameMatching && isDateInRange;
//   });
// };

// const calculateTotalstudentBase = () => {
//   return filteredDatas.value.reduce((total, data) => {
//     return total + calculateCommission(data.price) * data.terjual;
//   }, 0);
// };

// const calculateTotalSupplier = () => {
//   return filteredDatas.value.reduce((total, data) => {
//     return (
//       total + (data.price - calculateCommission(data.price)) * data.terjual
//     );
//   }, 0);
// };

// const totalIncome = computed(() => {
//   return filteredTransactions.value
//     .filter(
//       (transaction) =>
//         transaction.transactiontype === "Pemasukan" ||
//         transaction.transactiontype === "Hutang"
//     )
//     .reduce((total, transaction) => {
//       return total + parseFloat(transaction.amount);
//     }, 0);
// });
// const totalOutcome = computed(() => {
//   return filteredTransactions.value
//     .filter((transaction) => transaction.transactiontype === "Pengeluaran")
//     .reduce((total, transaction) => {
//       return total + parseFloat(transaction.amount);
//     }, 0);
// });

// const formatNumberWithCommas = (number) => {
//   let numStr = number.toString();
//   let groups = [];
//   while (numStr.length > 0) {
//     groups.unshift(numStr.slice(-3));
//     numStr = numStr.slice(0, -3);
//   }
//   let formattedValue = groups.join(".");
//   return formattedValue;
// };

// const calculateCommission = (price) => {
//   if (price > 6000) {
//     return 500;
//   } else if (price >= 2500 && price <= 6000) {
//     return 300;
//   }
// };
</script>

<style>
.table-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-top: 20px;
}

.transaction-table {
  border-collapse: collapse;
  margin: 40px;
  font-size: 16px;
}

.transaction-table th,
.transaction-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.transaction-table th {
  background-color: #f2f2f2;
}
.transaction-table tr {
  background-color: #ddd;
}
.transaction-table tr:hover {
  background-color: #80c972;
}

.edit-button {
  background-color: #4a9c3a;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

.delete-button {
  background-color: #e57373;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.addform {
  width: 100%;
  margin-top: 50px;
  background-color: rgb(22, 22, 22);
  padding: 10px 30px 30px 20px;
  border-radius: 20px;
}

.input-form {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

@media (min-width: 1000px) {
  .container {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.content .btn-group {
  width: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: 800px) {
  .input-form .field {
    flex-direction: column;
    place-items: center;
    width: 300px;
  }
  .input-form .field .control {
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .input-form .field .control input {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .input-form .field .control button {
    width: 100%;
  }
  .input-form .field .control label:not(:first-child) {
    margin-top: 10px;
  }
  #dTime {
    margin-top: 20px;
  }
}
</style>
