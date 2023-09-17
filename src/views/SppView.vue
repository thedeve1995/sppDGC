<template>
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
          <label for="paymentMonth">Bulan</label>
          <select id="paymentMonth" v-model="paymentMonth" class="input">
            <option v-for="month in months" :value="month.time">
              {{ month.time }}
            </option>
          </select>
        </div>
        <div class="control">
          <label for="amount">Jumlah</label>
          <input type="number" v-model="amount" class="input" id="amount" />
        </div>
        <div class="control">
          <label for="fileImage">Upload Gambar</label>
          <input
            type="file"
            class="input"
            id="fileImage"
            ref="myFile"
            @change="handleImageUpload"
          />
        </div>
        <div class="control">
          <label style="color: transparent" for="">.</label>
          <button class="button is-info">Tambah Data</button>
        </div>
      </div>
    </div>
  </form>

  <input type="hidden" v-model="linkImage" id="imageLink" />

  <div class="filter">
    <div>
      <label for="inputFilter">Filter</label>
      <select
        id="classSelect"
        v-model="selectedClass"
        class="input"
        @change="filterStudents()"
      >
        <option value="VII Shalih">VII Shalih</option>
        <option value="VII Shalihah">VII Shalihah</option>
        <option value="VIII Leader Putra">VIII Leader Putra</option>
        <option value="VIII Leader Putri">VIII Leader Putri</option>
        <option value="IX Juara Putra">IX Juara Putra</option>
        <option value="IX Juara Putri">IX Juara Putri</option>
      </select>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>No.</th>
        <th>Nama Murid</th>
        <th v-for="month in months" :key="month.id">{{ month.time }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(student, index) in filteredStudents" :key="student.id">
        <td>{{ index + 1 }}</td>
        <td>{{ student.studentName }}</td>
        <td style="text-align: center" v-for="month in months" :key="month.id">
          <span
            v-if="getStatus(student.studentName, month.time)"
            style="
              color: white;
              background-color: rgb(0, 89, 255);
              padding: 4px 10px;
              border-radius: 5px 0 0 5px;
              cursor: pointer;
            "
            @click="showImage(getLinkImage(student.studentName, month.time))"
          >
            {{ getStatus(student.studentName, month.time) }}
          </span>
          <span
            v-if="getStatus(student.studentName, month.time)"
            style="
              color: white;
              background-color: rgb(255, 0, 98);
              padding: 4px 10px;
              border-radius: 0 5px 5px 0;
              cursor: pointer;
            "
            @click="deleteData(getId(student.studentName, month.time))"
            >X</span
          >
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Modal untuk menampilkan gambar -->
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <p class="image">
        <img :src="selectedImage" alt="Gambar" />
      </p>
    </div>
    <button
      class="modal-close is-large"
      aria-label="Tutup"
      @click="showModal = false"
    ></button>
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
import { storage, app } from "@/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const addData = async () => {
  try {
    // Check if an image was uploaded
    if (selectedImageFile) {
      // Upload the image to Firebase Storage 
      await uploadBytes(imageRef, selectedImageFile);
      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(imageRef);
      // Update the linkImage field with the image URL
      linkImage.value = imageUrl;
    }

    const studentData = {
      name: selectedStudent.value,
      paymentMonth: paymentMonth.value,
      amount: amount.value,
      linkImage: linkImage.value, // Use the updated linkImage value
    };
    await addDoc(collection(db, "spp2324"), studentData);
    // Clear form fields
    selectedStudent.value = "";
    paymentMonth.value = "";
    amount.value = "";
    // Reset the selected image file
    selectedImageFile = null;
    // Update the filtered students
    filterStudents();
  } catch (error) {
    console.error("Error:", error);
  }
};

let selectedImageFile = null;
let imageRef; // Define imageRef globally

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Initialize imageRef within handleImageUpload
    imageRef = storageRef(storage, file.name);
    selectedImageFile = file;
  }
};

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
  filterStudents();
});

const getLinkImage = (studentName, month) => {
  // Cari data yang sesuai dalam koleksi "spp2324" berdasarkan nama murid dan nama bulan
  const matchingData = filteredDatas.value.find(
    (data) => data.name === studentName && data.paymentMonth === month
  );

  // Jika data yang sesuai ditemukan, kembalikan nilai linkImage; jika tidak, kembalikan string kosong.
  return matchingData ? matchingData.linkImage : "";
};
const getId = (studentName, month) => {
  // Cari data yang sesuai dalam koleksi "spp2324" berdasarkan nama murid dan nama bulan
  const matchingData = filteredDatas.value.find(
    (data) => data.name === studentName && data.paymentMonth === month
  );

  // Jika data yang sesuai ditemukan, kembalikan nilai linkImage; jika tidak, kembalikan string kosong.
  return matchingData ? matchingData.id : "";
};

const getStatus = (studentName, month) => {
  // Find the corresponding document in your Firestore collection
  const matchingData = datas.value.find(
    (data) => data.name === studentName && data.paymentMonth === month
  );

  // If matching data exists, return "Sudah Bayar"; otherwise, return an empty string.
  return matchingData ? "✔" : "";
};

const students = ref([]);
const filteredStudents = ref([]);
const selectedClass = ref("");
const paymentMonth = ref("");
const amount = ref("");
const selectedStudent = ref("");
const linkImage = ref("");
const selectedImage = ref("");
const showModal = ref(false);

const showImage = (linkImage) => {
  selectedImage.value = linkImage;
  showModal.value = true;
};

const months = [
  { id: 1, time: "Juli" },
  { id: 2, time: "Agustus" },
  { id: 3, time: "September" },
  { id: 4, time: "Oktober" },
  { id: 5, time: "November" },
  { id: 6, time: "Desember" },
  { id: 7, time: "Januari" },
  { id: 8, time: "Februari" },
  { id: 9, time: "Maret" },
  { id: 10, time: "April" },
  { id: 11, time: "Mei" },
  { id: 12, time: "Juni" },
];

const loadStudents = () => {
  onSnapshot(transactionCollectionQuery, (querySnapshot) => {
    const studentList = [];

    querySnapshot.forEach((doc) => {
      const student = {
        id: doc.id,
        no: doc.No,
        studentName: doc.data().Nama,
        kelas: doc.data().Rombel,
      };

      studentList.push(student);
    });

    students.value = studentList;
    filteredStudents.value = studentList;
  });
};

const filterStudents = () => {
  const filteredList = students.value.filter((student) => {
    return selectedClass.value === "" || student.kelas === selectedClass.value;
  });
  filteredStudents.value = filteredList;
};

const loadDatas = () => {
  onSnapshot(collection(db, "spp2324"), (querySnapshot) => {
    const fbData = [];

    querySnapshot.forEach((doc) => {
      const data = {
        id: doc.id,
        amount: doc.data().amount,
        name: doc.data().name,
        paymentMonth: doc.data().paymentMonth,
        linkImage: doc.data().linkImage,
      };

      fbData.push(data);
    });

    datas.value = fbData;
    filteredDatas.value = fbData;
  });
};


const deleteData = async (studentId) => {
  let password = prompt("Silahkan Masukkan Password");

  if (password === "dani1212") {
    try {
      const docRef = doc(db, "spp2324", studentId);
      await deleteDoc(docRef);

      // Data berhasil dihapus, Anda dapat melakukan tindakan lain jika diperlukan.
    } catch (error) {
      console.error("Error deleting document:", error);
      // Tangani kesalahan jika terjadi
    }
  } else {
    alert("Silahkan masukkan password yang benar");
  }
};
</script>

<style scoped>
table {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 95vw;
  border-collapse: collapse;
  margin-top: 20px;
  border-radius: 20px;
  background-color: white;
}

th,
td {
  padding: 5px;
  text-align: left;
  border: 1px solid #ccc;
}

th {
  background-color: #f5f5f5;
}
</style>
