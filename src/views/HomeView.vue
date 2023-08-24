<template lang="">
  <form class="addform" @submit.prevent="addTransaction">
    <div class="input-form">
      <div class="field has-addons">
        <div class="control">
          <label for="author">Penerima</label>
          <input
            id="author"
            v-model="penerima"
            class="input"
            type="text"
            placeholder="Your Name"
          />
        </div>
        <div class="control">
          <label for="amount">Jumlah</label>
          <input
            id="amount"
            v-model="amount"
            class="input"
            type="number"
            placeholder="amount"
          />
        </div>
        <div class="control">
          <label for="date">Tanggal</label>
          <input
            id="date"
            title="date"
            v-model="date"
            class="input"
            type="date"
          />
        </div>

        <div class="control">
          <label for="transactionType">Jenis</label>
          <select id="transactionType" v-model="transactionType" class="input">
            <option value="Pemasukan">Pemasukan</option>
            <option value="Pengeluaran">Pengeluaran</option>
            <option value="Hutang">Hutang</option>
          </select>
        </div>
        <div class="control">
          <label for="transactionCode">Kode</label>
          <select id="transactionCode" v-model="transactionCode" class="input">
            <option value="A1. Sarpras">A1.Sarpras</option>
            <option value="B1. Project">B1.Project</option>
            <option value="Pemasukan">Pemasukan</option>
          </select>
        </div>
        <div class="control">
          <label for="note">Keterangan</label>
          <input
            id="note"
            v-model="note"
            class="input"
            type="text"
            placeholder="Keterangan"
          />
        </div>
        <div class="control">
          <label style="color: transparent" for="">.</label>
          <button :disabled="!transactionType" class="button is-info">
            Tambah Transaksi
          </button>
        </div>
      </div>
    </div>
  </form>

  <h1
    style="
      font-size: 30px;
      text-align: center;
      margin-top: 20px;
      margin-bottom: 30px;
      font-weight: 700;
      color: burlywood;
    "
  >
    DAFTAR TRANSAKSI
  </h1>

  <div style="display: flex; flex-direction: column; align-items: center">
    <label style="text-align: center; font-size: 20px" for="">Filter</label>
    <select
      style="
        width: 250px;
        padding: 5px 20px;
        font-size: 15px;
        text-align: center;
        border-radius: 10px;
      "
      v-model="filterTransaction"
      @change="filterTransactions"
      class="input"
    >
      <option value="">All Transactions</option>
      <option value="Pemasukan">Pemasukan</option>
      <option value="Pengeluaran">Pengeluaran</option>
      <option value="Hutang">Hutang</option>
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
        @change="filterTransactions"
        class="input"
        type="date"
      />
      <span style="color: white">s/d</span>
      <input
        style="width: 200px"
        id="endDate"
        v-model="endDate"
        @change="filterTransactions"
        class="input"
        type="date"
      />
    </div>
  </div>

  <div
    style="
      display: flex;
      width: 100%;
      justify-content: center;
      margin-bottom: 30px;
    "
  >
    <h4
      style="
        font-size: 20px;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 30px;
        font-weight: 700;
        padding: 20px 40px;
        background: blue;
        color: white;
      "
      id="jumlah"
    >
      Total Pemasukan: <br />
      Rp {{ formatNumberWithCommas(totalIncome) }}
    </h4>
    <h4
      style="
        font-size: 20px;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 30px;
        font-weight: 700;
        padding: 20px 40px;
        background: red;
        color: white;
      "
    >
      Total Pengeluaran: <br />
      Rp {{ formatNumberWithCommas(totalOutcome) }}
    </h4>
    <h4
      style="
        font-size: 20px;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 30px;
        font-weight: 700;
        padding: 20px 40px;
        background: green;
        color: white;
      "
    >
      Neraca: <br />
      Rp {{ formatNumberWithCommas(totalIncome - totalOutcome) }}
    </h4>
  </div>

  <div class="table-container">
    <table class="transaction-table">
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Jenis</th>
          <th>Penerima</th>
          <th>Keterangan</th>
          <th>Kode</th>
          <th>Jumlah</th>
          <th style="width: 150px">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in filteredTransactions" :key="transaction.id">
          <td>{{ transaction.date }}</td>
          <td>{{ transaction.transactiontype }}</td>
          <td>{{ transaction.penerima }}</td>
          <td>{{ transaction.note }}</td>
          <td>{{ transaction.transactioncode }}</td>
          <td>Rp {{ formatNumberWithCommas(transaction.amount) }}</td>
          <td style="display: flex; justify-content: space-between">
            <button @click="openEditModal(transaction.id)" class="edit-button">
              Edit
            </button>
            <button
              @click="deleteTransaction(transaction.id)"
              class="delete-button"
            >
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="modal" :class="{ 'is-active': editModalOpen }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Transaction</p>
        <button
          class="delete"
          aria-label="close"
          @click="closeEditModal"
        ></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Amount</label>
          <div class="control">
            <input
              v-model="editAmount"
              class="input"
              type="number"
              placeholder="Amount"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Penerima</label>
          <div class="control">
            <input
              v-model="editPenerima"
              class="input"
              type="text"
              placeholder="Penerima"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Keterangan</label>
          <div class="control">
            <input
              v-model="editNote"
              class="input"
              type="text"
              placeholder="Keterangan"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Tanggal</label>
          <div class="control">
            <input
              v-model="editDate"
              class="input"
              type="date"
              placeholder="Tanggal"
            />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="label">Jenis</label>
            <select v-model="editTransactionType" class="input">
              <option value="Pemasukan">Pemasukan</option>
              <option value="Pengeluaran">Pengeluaran</option>
            </select>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="label">Code</label>
            <select v-model="editTransactionCode" class="input">
              <option value="A1. Sarpras">A1. Sarpras</option>
              <option value="B1. Project">B1. Project</option>
            </select>
          </div>
        </div>
        <!-- Add other fields for editing here -->
      </section>
      <footer class="modal-card-foot">
        <button
          @click="editTransaction(editingTransactionId)"
          class="button is-success"
        >
          Simpan
        </button>
        <button class="button" @click="closeEditModal">Batal</button>
      </footer>
    </div>
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
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";

const editNote = ref("");
const editingTransactionId = ref("");
const editTransactionType = ref("");
const editTransactionCode = ref("");
const editDate = ref("");
const editModalOpen = ref(false);
const editAmount = ref("");
const editPenerima = ref("");

const amount = ref("");
const penerima = ref("");
const date = ref("");
const transactionType = ref("");
const transactionCode = ref("")
const note = ref("");
const filterTransaction = ref("");
const startDate = ref("");
const endDate = ref("");

const transactionCollectionQuery = query(
  collection(db, "finance"),
  orderBy("date", "asc")
  // limit(10)
);
const transactions = ref([]);

onMounted(() => {
  loadTransactions();
});

const loadTransactions = () => {
  onSnapshot(transactionCollectionQuery, (querySnapshot) => {
    const fbTransaction = [];
    querySnapshot.forEach((doc) => {
      const transaction = {
        id: doc.id,
        amount: doc.data().amount,
        date: doc.data().date,
        note: doc.data().note,
        penerima: doc.data().penerima,
        transactiontype: doc.data().transactiontype,
        transactioncode: doc.data().transactioncode,
      };

      fbTransaction.push(transaction);
    });
    transactions.value = fbTransaction;
    filteredTransactions.value = fbTransaction;
  });
};

const filteredTransactions = ref([]);

const filterTransactions = () => {
  const selectedTransactionType = filterTransaction.value;
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  filteredTransactions.value = transactions.value.filter((transaction) => {
    const transactionDate = new Date(transaction.date);

    // Check if the transaction type matches the selected type and falls within the date range
    const isTransactionTypeMatching =
      selectedTransactionType === "" ||
      transaction.transactiontype === selectedTransactionType;
    const isDateInRange = transactionDate >= start && transactionDate <= end;

    return isTransactionTypeMatching && isDateInRange;
  });
};

const editTransaction = async (id) => {
  const transactionIndex = transactions.value.findIndex((t) => t.id === id);
  if (transactionIndex !== -1) {
    const editedTransaction = {
      amount: editAmount.value,
      penerima: editPenerima.value,
      date: editDate.value,
      transactiontype: editTransactionType.value,
      transactioncode: editTransactionCode.value,
      note: editNote.value,
    };

    try {
      await updateDoc(doc(db, "finance", id), editedTransaction);
      transactions.value[transactionIndex] = {
        ...transactions.value[transactionIndex],
        ...editedTransaction,
      };
      closeEditModal();
    } catch (error) {
      console.error("Error editing transaction:", error);
      // Handle error here (e.g., show an error message)
    }
  }
};

const openEditModal = (id) => {
  const transaction = transactions.value.find((t) => t.id === id);
  if (transaction) {
    editAmount.value = transaction.amount;
    editPenerima.value = transaction.penerima;
    editDate.value = transaction.date; // Populate editDate
    editTransactionType.value = transaction.transactiontype; // Populate editTransactionType
    editTransactionCode.value = transaction.transactioncode; 
    editNote.value = transaction.note;

    editingTransactionId.value = id;
    editModalOpen.value = true;
  }
};

const closeEditModal = () => {
  editAmount.value = "";
  editPenerima.value = "";
  editDate.value = ""; // Clear editDate
  editTransactionType.value = ""; // Clear editTransactionType
  editTransactionCode.value = ""; 
  editNote.value = ""; 
  // ... (clear other edit variables)

  editingTransactionId.value = "";
  editModalOpen.value = false;
};

const addTransaction = () => {
  const transactionData = {
    amount: amount.value,
    penerima: penerima.value,
    date: date.value,
    transactiontype: transactionType.value,
    transactioncode: transactionCode.value,
    note: note.value,
  };

  addDoc(collection(db, "finance"), transactionData);

  amount.value = "";
  penerima.value = "";
  date.value = "";
  transactionType.value = "";
  transactionCode.value = "";
  note.value = "";
};

const totalIncome = computed(() => {
  return filteredTransactions.value
    .filter((transaction) => transaction.transactiontype === "Pemasukan" || transaction.transactiontype === "Hutang")
    .reduce((total, transaction) => {
      return total + parseFloat(transaction.amount);
    }, 0);
});
const totalOutcome = computed(() => {
  return filteredTransactions.value
    .filter((transaction) => transaction.transactiontype === "Pengeluaran")
    .reduce((total, transaction) => {
      return total + parseFloat(transaction.amount);
    }, 0);
});

const deleteTransaction = async (id) => {
  // let password = prompt("Tolong Passwordnya");
  // if (password === "revi1212") {
  //   updateDoc(doc(db, "revitodos", id), {
  //     doneTime: new Date().toLocaleString(),
  //   });

  //   const deletedTask = await getDoc(doc(db, "revitodos", id));
  //   if (deletedTask.exists()) {
  //     const deletedData = deletedTask.data();
  //     await addDoc(collection(db, "reviselesai"), deletedData);
  //     deleteDoc(doc(db, "revitodos", id));
  //   }
  // } else {
  //   alert("Password anda salah");
  // }
  deleteDoc(doc(db, "finance", id));
};

// const toggleDoneRevi = (id) => {
//   let password = prompt("Tolong Passwordnya");
//   if (password === "revi1212") {
//     const index = revitodos.value.findIndex((revitodo) => revitodo.id === id);
//     updateDoc(doc(collection(db, "revitodos"), id), {
//       done: !revitodos.value[index].done,
//     });
//   } else {
//     alert("Password anda salah");
//   }
// };

const formatNumberWithCommas = (number) => {
  let numStr = number.toString();
  let groups = [];
  while (numStr.length > 0) {
    groups.unshift(numStr.slice(-3));
    numStr = numStr.slice(0, -3);
  }
  let formattedValue = groups.join(".");
  return formattedValue;
};
</script>

<style>
.modal-card {
  max-width: 600px;
  width: 80%;
  margin: auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

.modal-card-head {
  background-color: #f5f5f5;
}

.modal-card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.delete {
  background-color: transparent;
  border: none;
}

.modal-card-body {
  padding: 1.5rem;
}

.modal-card-foot {
  background-color: #f5f5f5;
  justify-content: flex-end;
  border-top: 1px solid #ccc;
}

.table-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.transaction-table {
  border-collapse: collapse;
  width: 100%;
  min-width: 500px;
  max-width: 800px;
  font-size: 14px;
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
}

.delete-button {
  background-color: #e57373;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #d32f2f;
}
.task-card {
  background-color: burlywood;
  padding: 0;
  width: 350px;
  margin-bottom: 20px;
  border-radius: 20px;
  margin-top: 20px;
  box-shadow: 2px 2px 15px rgb(7, 6, 6);
}

.task-card:hover {
  transform: translateY(-10px);
  transition: 0.5s ease-in-out;
}

.task-card h3 {
  color: black;
  text-align: center;
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
