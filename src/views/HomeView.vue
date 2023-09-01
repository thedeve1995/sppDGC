<template lang="">
  <form class="addform" @submit.prevent="addData">
    <div class="input-form">
      <div class="field has-addons">
        <div class="control">
          <label for="author">Supplier</label>
          <select id="author" v-model="supplier" class="input">
            <option value="">Pilih Supplier</option>
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
        <div class="control">
          <label for="foodTitle">Nama Makanan</label>
          <input
            id="foodTitle"
            v-model="foodTitle"
            class="input"
            type="text"
            placeholder="Nama Makanan"
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
          <label for="price">Harga Jual</label>
          <input
            id="price"
            v-model="price"
            class="input"
            type="number"
            placeholder="price"
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
          <label style="color: transparent" for="">.</label>
          <button :disabled="!supplier" class="button is-info">
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
    DAFTAR JUALAN KANTIN SMP SMA ISLAM 
    <br>DE GREEN CAMP HARI INI
  </h1>

  <div class="table-container">
    <table class="transaction-table">
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Supplier</th>
          <th>Nama Makanan</th>
          <th>Jumlah Supply</th>
          <th>Harga Makanan</th>
          <th>Komisi Kantin</th>
          <th>Untuk Supplier</th>
          <th>Terjual</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in filteredDatasForToday" :key="data.id">
          <td>{{ data.date }}</td>
          <td>{{ data.supplier }}</td>
          <td>{{ data.foodTitle }}</td>
          <td>{{ data.amount }}</td>
          <td>Rp {{ formatNumberWithCommas(data.price) }}</td>
          <td>Rp {{ calculateCommission(data.price) }}</td>
          <td>
            Rp
            {{
              formatNumberWithCommas(
                data.price - calculateCommission(data.price)
              )
            }}
          </td>
          <td>{{ data.terjual }}</td>
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
import { startOfDay } from "date-fns";

const amount = ref("");
const supplier = ref("");
const date = ref("");
const price = ref("");
const foodTitle = ref("");

const transactionCollectionQuery = query(
  collection(db, "kantin"),
  orderBy("date", "asc")
  // limit(10)
);
const datas = ref([]);
const filteredDatas = ref([]);


onMounted(() => {
  loadDatas();
});

const loadDatas = () => {
  onSnapshot(transactionCollectionQuery, (querySnapshot) => {
    const fbData = [];
    const supplierNames = []; // Array untuk menyimpan nama supplier
    const amountArray = [];
    const terjualArray = [];
    const foodTitleArray = [];

    querySnapshot.forEach((doc) => {
      const data = {
        id: doc.id,
        amount: doc.data().amount,
        date: doc.data().date,
        foodTitle: doc.data().foodTitle,
        price: doc.data().price,
        supplier: doc.data().supplier,
        terjual: doc.data().terjual,
      };

      fbData.push(data);
    });

    datas.value = fbData;
    filteredDatas.value = fbData;

  });
};

const currentDate = new Date();
const startOfCurrentDay = startOfDay(currentDate);

const filteredDatasForToday = computed(() => {
  return filteredDatas.value.filter((data) => {
    const dataDate = new Date(data.date);
    return startOfDay(dataDate).getTime() === startOfCurrentDay.getTime();
  });
});

const calculateTotalKantin = () => {
  return filteredDatas.value.reduce((total, data) => {
    return total + calculateCommission(data.price) * data.terjual;
  }, 0);
};

const calculateTotalSupplier = () => {
  return filteredDatas.value.reduce((total, data) => {
    return (
      total + (data.price - calculateCommission(data.price)) * data.terjual
    );
  }, 0);
};

const addData = () => {
  const supplierData = {
    amount: amount.value,
    supplier: supplier.value,
    date: date.value,
    foodTitle: foodTitle.value,
    price: price.value,
  };

  addDoc(collection(db, "kantin"), supplierData);

  amount.value = "";
  supplier.value = "";
  date.value = "";
  foodTitle.value = "";
  price.value = "";
};

const totalIncome = computed(() => {
  return filteredTransactions.value
    .filter(
      (transaction) =>
        transaction.transactiontype === "Pemasukan" ||
        transaction.transactiontype === "Hutang"
    )
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

const calculateCommission = (price) => {
  if (price > 6000) {
    return 500;
  } else if (price >= 2500 && price <= 6000) {
    return 300;
  }
};
</script>

<style>


.table-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.transaction-table {
  border-collapse: collapse;
  overflow: auto;
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
