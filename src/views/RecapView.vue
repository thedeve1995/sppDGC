<template lang="">
  
  <div style="display: flex; flex-direction: column; align-items: center">
    <label style="margin-top:30px;text-align: center; font-size: 20px" for="">Filter</label>
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
      margin-bottom: 10px;
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
  <div  style="
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px 0;
    ">
      <button @click="downloadAsPDF">Download as PDF</button>
    </div>

  <div class="screenshoot">
    <br />
    <h1
    style="
      font-size: 30px;
      text-align: center;
      font-weight: 700;
      color: burlywood;
    "
  >
    DAFTAR TRANSAKSI <br> ({{ startDate }} s/d {{ endDate }})
  </h1>
    
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
          </tr>
        </thead>
        <tbody>
          <td
            colspan="6"
            style="
              background-color: lightyellow;
              text-align: Left;
              border-top: 5px solid black;
            "
          >
            A1. Sarpras
          </td>
          <tr
            v-for="transaction in filteredTransactionsA1"
            :key="'A1-' + transaction.id"
          >
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.transactiontype }}</td>
            <td>{{ transaction.penerima }}</td>
            <td>{{ transaction.note }}</td>
            <td>{{ transaction.transactioncode }}</td>
            <td>Rp {{ formatNumberWithCommas(transaction.amount) }}</td>
          </tr>
          <tr>
            <td
              colspan="6"
              style="background-color: lightyellow; text-align: right"
            >
              Total Outcome (A1) =
              <span style="font-weight: 700"
                >Rp {{ formatNumberWithCommas(totalOutcomeA1) }}</span
              >
            </td>
          </tr>
          <td
            colspan="6"
            style="
              background-color: lightblue;
              text-align: Left;
              border-top: 5px solid black;
            "
          >
            B1. Project
          </td>
          <tr
            v-for="transaction in filteredTransactionsB1"
            :key="'B1-' + transaction.id"
          >
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.transactiontype }}</td>
            <td>{{ transaction.penerima }}</td>
            <td>{{ transaction.note }}</td>
            <td>{{ transaction.transactioncode }}</td>
            <td>Rp {{ formatNumberWithCommas(transaction.amount) }}</td>
          </tr>
          <tr>
            <td
              colspan="6"
              style="background-color: lightblue; text-align: right"
            >
              Total Outcome (B1) =
              <span style="font-weight: 700"
                >Rp {{ formatNumberWithCommas(totalOutcomeB1) }}</span
              >
            </td>
          </tr>
          <tr>
            <td
              colspan="6"
              style="color: white; background-color: Black; text-align: right"
            >
              Total Outcome (ALL) =
              <span style="font-weight: 700"
                >Rp {{ formatNumberWithCommas(totalOutcome) }}</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2
      style="
        text-align: center;
        font-size: 24px;
        margin-top: 40px;
        color: white;
      "
    >
      Pemasukan dan Hutang
    </h2>
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
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="transaction in filteredIncomeTransactions"
            :key="'income-' + transaction.id"
          >
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.transactiontype }}</td>
            <td>{{ transaction.penerima }}</td>
            <td>{{ transaction.note }}</td>
            <td>{{ transaction.transactioncode }}</td>
            <td>Rp {{ formatNumberWithCommas(transaction.amount) }}</td>
          </tr>
          <tr>
            <td
              colspan="6"
              style="text-align: right; background-color: black; color: white"
            >
              Total Pemasukan (ALL) =
              <span style="font-weight: 700"
                >Rp {{ formatNumberWithCommas(totalIncome) }}</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="balance-card">
      <div class="balance-item">
        <div class="balance-title">Total Pemasukan</div>
        <div class="balance-amount">
          Rp {{ formatNumberWithCommas(totalIncome) }}
        </div>
      </div>
      
      <div class="balance-item">
        <div class="balance-title">Total Pengeluaran</div>
        <div class="balance-amount">
          Rp {{ formatNumberWithCommas(totalOutcome) }}
        </div>
      </div>
      <div class="balance-item">
        <div class="balance-title">
          Neraca <br />
          ({{ startDate }} s/d {{ endDate }})
        </div>
        <div class="balance-amount">
          Rp
          {{ formatNumberWithCommas(totalIncome  - totalOutcome) }}
        </div>
      </div>
    </div>
    <div class="balance-card">
      
      <div class="balance-item">
        <div class="balance-title">Total Hutang</div>
        <div class="balance-amount">
          Rp {{ formatNumberWithCommas(totalDebt) }}
        </div>
      </div>
      <div class="balance-item">
        <div class="balance-title">Minus</div>
        <div class="balance-amount">
          Rp {{ formatNumberWithCommas(totalIncome  - totalOutcome) }}
        </div>
      </div>
      <div class="balance-item">
        <div class="balance-title">
          Neraca Tutup Hutang <br />
          ({{ startDate }} s/d {{ endDate }})
        </div>
        <div class="balance-amount">
          Rp
          {{ formatNumberWithCommas((totalIncome  - totalOutcome) + totalDebt) }}
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import html2canvas from "html2canvas"; // Import html2canvas
import jsPDF from "jspdf";

const downloadAsPDF = () => {
  const screenshotElement = document.querySelector(".screenshoot");

  html2canvas(screenshotElement).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("screenshot.pdf");
  });
};

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

const filteredIncomeTransactions = computed(() => {
  return filteredTransactions.value.filter(
    (transaction) =>
      transaction.transactiontype === "Pemasukan" ||
      transaction.transactiontype === "Hutang"
  );
});

const totalIncome = computed(() => {
  return filteredTransactions.value
    .filter((transaction) => transaction.transactiontype === "Pemasukan" )
    .reduce((total, transaction) => {
      return total + parseFloat(transaction.amount);
    }, 0);
});
const totalDebt = computed(() => {
  return filteredTransactions.value
    .filter((transaction) => transaction.transactiontype === "Hutang")
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

const filteredTransactionsA1 = computed(() => {
  return filteredTransactions.value.filter(
    (transaction) =>
      transaction.transactioncode === "A1. Sarpras" &&
      transaction.transactiontype === "Pengeluaran"
  );
});

const filteredTransactionsB1 = computed(() => {
  return filteredTransactions.value.filter(
    (transaction) =>
      transaction.transactioncode === "B1. Project" &&
      transaction.transactiontype === "Pengeluaran"
  );
});

const totalOutcomeA1 = computed(() => {
  return filteredTransactionsA1.value
    .filter((transaction) => transaction.transactiontype === "Pengeluaran")
    .reduce((total, transaction) => {
      return total + parseFloat(transaction.amount);
    }, 0);
});

const totalOutcomeB1 = computed(() => {
  return filteredTransactionsB1.value
    .filter((transaction) => transaction.transactiontype === "Pengeluaran")
    .reduce((total, transaction) => {
      return total + parseFloat(transaction.amount);
    }, 0);
});
</script>

<style>
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

.balance-card {
  display: flex;
  justify-content: space-around;
  max-width: 800px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 40px;
  padding: 20px;
  background-color: #f2f2f2;
  border-radius: 10px;
}

.balance-item {
  text-align: center;
}

.balance-title {
  font-size: 18px;
  font-weight: bold;
}

.balance-amount {
  font-size: 24px;
  font-weight: bold;
  color: #4caf50;
}
</style>
