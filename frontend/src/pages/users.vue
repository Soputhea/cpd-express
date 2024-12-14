<template>
  <v-container>
    <v-card color="primary">
      <v-card-title primary-title>
        <v-card-title class="d-flex align-center pe-2">
          <v-icon icon="mdi-account"></v-icon> &nbsp;
          បញ្ជីអ្នកប្រើប្រាស់
          <v-spacer></v-spacer>
          <v-text-field v-model="search" density="compact" label="ស្វែងរក" prepend-inner-icon="mdi-magnify"
            variant="solo-filled" flat hide-details single-line></v-text-field>
        </v-card-title>
      </v-card-title>

      <v-data-table :items="userData" :headers="header" :search="search" class="elevation-1">
        <template v-slot:item.user_id="{ item }">
          <span>{{ item.user_id.join(', ') }}</span>
        </template>

        <template v-slot:item.name_kh="{ item }">
          <span>{{ item.name_kh }}</span>
        </template>

        <template v-slot:item.name_en="{ item }">
          <span>{{ item.name_en }}</span>
        </template>

        <template v-slot:item.gender="{ item }">
          <span>{{ item.gender }}</span>
        </template>

        <template v-slot:item.dob="{ item }">
          <span>{{ formatDate(item.dob) }}</span>
        </template>

        <template v-slot:item.date_of_starting_work="{ item }">
          <span>{{ formatDate(item.date_of_starting_work) }}</span>
        </template>

        <template v-slot:item.location_kh="{ item }">
          <span>{{ item.location_kh }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" color="info" @click="viewItem(item)">
            mdi-eye
          </v-icon>
          <v-icon class="me-2" color="warning" size="small" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" color="error" @click="confirmDelete(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>

      <!-- View User Detail Dialog -->
      <v-dialog v-model="viewDialog" max-width="900px">
        <v-card>
          <v-card-title class="headline">ព័ត៌មានលម្អិត</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field label="អត្តលេខ" v-model="selectedItem.payroll_id" readonly /></v-col>
                <v-col cols="12" sm="6"> <v-text-field label="ឈ្មោះខ្មែរ" v-model="selectedItem.name_kh"
                    readonly /></v-col>
                <v-col cols="12" sm="6"> <v-text-field label="ឈ្មោះអង់គ្លេស" v-model="selectedItem.name_en"
                    readonly /></v-col>
                <v-col cols="12" sm="6"> <v-select label="ភេទ" v-model="selectedItem.gender" :items="['ប្រុស', 'ស្រី']"
                    readonly /></v-col>
                <v-col cols="12" sm="6"> <v-text-field label="ថ្ងៃខែឆ្នាំកំណើត" v-model="selectedItem.dob"
                    :value="formatDate(selectedItem.dob)" readonly /></v-col>
                <v-col cols="12" sm="6"> <v-text-field label="អង្គភាព" v-model="selectedItem.location_kh"
                    readonly /></v-col>
                <v-col cols="12" sm="6"> <v-select label="ប្រភេទអង្គភាព" v-model="selectedItem.location_type"
                  :items="['វិទ្យាល័យ', 'អនុវិទ្យាល័យ', 'បឋមសិក្សា', 'មត្តេយ្យសិក្សា']" readonly /></v-col>
                <v-col cols="12" sm="6"> <v-text-field label="ខេត្ត-ក្រុង" v-model="selectedItem.province"
                    readonly /></v-col>
                <v-col cols="12" sm="6"> <v-text-field label="ស្រុក" v-model="selectedItem.commune" readonly /></v-col>
                <v-col cols="12" sm="6"> <v-text-field label="តួនាទី" v-model="selectedItem.current_position"
                    readonly /></v-col>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="selectedItem.start_date" :value="formatDate(selectedItem.start_date)"  label="កាលបរិច្ឆេទធ្វើការចុងក្រោយ"/>
                  </v-col>
                <v-col cols="12" sm="6"><v-text-field label="កាំប្រាក់" v-model="selectedItem.salary_level_kh"
                    readonly /></v-col>
                <v-col cols="12" sm="6"><v-text-field label="កម្រិតកាំប្រាក់" v-model="selectedItem.salary_degree"
                    readonly /></v-col>
                <!-- <v-col cols="12" sm="6">
                  <v-text-field label="ថ្ងៃខែឡើងកាំប្រាក់" v-model="selectedItem.salary_type_shift_date" readonly />
                </v-col> -->
                <v-col cols="12" sm="6"><v-text-field label="កម្រិតវប្បធម៍" v-model="selectedItem.highest_qualification"
                    readonly /></v-col>
                <v-col cols="12" sm="6"><v-text-field label="កម្រិតវប្បធម៍-មុខវិជ្ជា"
                    v-model="selectedItem.highest_qualification_subject" readonly /></v-col>
                <!-- <v-col cols="12" sm="6">
                    <div class="d-flex justify-center">
                      <v-date-input v-model="selectedItem.highest_qualification_date"
                        label="កម្រិតវប្បធម៍-កាលបរិច្ឆេទ"></v-date-input>
                    </div>
                  </v-col> -->
                <v-col cols="12" sm="6"><v-text-field label="កម្រិតវិជ្ជាជីវៈ"
                    v-model="selectedItem.highest_professional" readonly /></v-col>
                <v-col cols="12" sm="6"><v-text-field label="កម្រិតវិជ្ជាជីវៈ-មុខវិជ្ជាំ"
                    v-model="selectedItem.professional" readonly /></v-col>

              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="viewDialog = false">បិទ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <!-- User Update Form (Hidden until edit) -->
      <v-dialog v-model="dialog" max-width="900px">
        <v-card>
          <v-card-title>ធ្វើបច្ចុប្បន្នភាពអ្នកប្រើប្រាស់</v-card-title>
          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="isValid">
                <v-row>

                  <v-col cols="12" sm="6"> <v-text-field label="អត្តលេខ" v-model="formData.payroll_id"
                      required /></v-col>
                  <v-col cols="12" sm="6"> <v-text-field label="ឈ្មោះខ្មែរ" v-model="formData.name_kh"
                      required /></v-col>
                  <v-col cols="12" sm="6"> <v-text-field label="ឈ្មោះអង់គ្លេស" v-model="formData.name_en"
                      required /></v-col>
                  <v-col cols="12" sm="6"> <v-select label="ភេទ" v-model="formData.gender" :items="['ប្រុស', 'ស្រី']"
                      required />
                  </v-col>
                  <v-col cols="12" sm="6"> <v-text-field label="អង្គភាព" v-model="formData.location_kh"
                      required /></v-col>
                  <v-col cols="12" sm="6"> <v-select label="ប្រភេទអង្គភាព" v-model="formData.location_type"
                      :items="['វិទ្យាល័យ', 'អនុវិទ្យាល័យ', 'បឋមសិក្សា', 'មត្តេយ្យសិក្សា']" required /></v-col>
                  <v-col cols="12" sm="6"> <v-text-field label="ខេត្ត-ក្រុង" v-model="formData.province"
                      required /></v-col>
                  <v-col cols="12" sm="6"> <v-text-field label="ស្រុក" v-model="formData.commune" required /></v-col>
                  <v-col cols="12" sm="6"> <v-text-field label="តួនាទី" v-model="formData.current_position"
                      required /></v-col>
                  <v-col cols="12" sm="6"><v-text-field label="កាំប្រាក់" v-model="formData.salary_level_kh"
                      required /></v-col>
                  <v-col cols="12" sm="6"><v-text-field label="កម្រិតកាំប្រាក់" v-model="formData.salary_degree"
                      required /></v-col>
                  <!-- <v-col cols="12" sm="6">
                    <v-select label="ថ្ងៃខែឡើងកាំប្រាក់" v-model="formData.salary_type_shift_date"
                      :items="['Monthly', 'Hourly', 'Daily']" required />
                  </v-col> -->
                  <v-col cols="12" sm="6"><v-text-field label="កម្រិតវប្បធម៍" v-model="formData.highest_qualification"
                      required /></v-col>
                  <v-col cols="12" sm="6"><v-text-field label="កម្រិតវប្បធម៍-មុខវិជ្ជា"
                      v-model="formData.highest_qualification_subject" required /></v-col>
                  <v-col cols="12" sm="6"><v-text-field label="កម្រិតវិជ្ជាជីវៈ" v-model="formData.highest_professional"
                      required /></v-col>
                  <v-col cols="12" sm="6"><v-text-field label="កម្រិតវិជ្ជាជីវៈ-មុខវិជ្ជាំ"
                      v-model="formData.professional" required /></v-col>

                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="submitUpdate">រក្សាទុក</v-btn>
            <v-btn @click="dialog = false">បោះបង់</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title class="headline">បញ្ជាក់ការលុប</v-card-title>
          <v-card-text>តើអ្នកប្រាកដថាចង់លុបអ្នកប្រើប្រាស់នេះទេ?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="deleteItem">យល់ព្រម</v-btn>
            <v-btn color="red darken-1" text @click="deleteDialog = false">បោះបង់</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios';
const baseUrl = `${import.meta.env.VITE_API_URL}`;

const userData = ref([]);
const formData = ref({});

const dialog = ref(false);
const deleteDialog = ref(false);
const selectedItem = ref(null);

const viewDialog = ref(false);

const viewItem = (item) => {
  selectedItem.value = item; // Set the selected user's data
  viewDialog.value = true;  // Open the view dialog
};

const isValid = ref(false);
const search = ref('');
const header = ref([
  // { title: 'ID', value: '_id' },
  { title: 'អត្តលេខ', value: 'payroll_id' },
  { title: 'ឈ្មោះខ្មែរ', value: 'name_kh' },
  { title: 'ឈ្មោះអង់គ្លេស', value: 'name_en' },
  { title: 'ភេទ', value: 'gender' },
  { title: 'ថ្ងៃខែឆ្នាំកំណើត', value: 'dob' },
  { title: 'កាលបរិច្ឆែទធ្វើការដំបូង', value: 'date_of_starting_work' },
  { title: 'អង្គភាព', value: 'location_kh' },
  { title: 'សកម្មភាព', key: 'actions', sortable: false },
])

const formatDate = (date: string) => {
  // const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  // return new Date(date).toLocaleDateString(undefined, options)
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;

}

// Function to open the edit form and populate it with the selected user's data
const editItem = (item) => {
  formData.value = { ...item }; // Clone the selected user's data into formData
  dialog.value = true; // Show the dialog with the form
};

const confirmDelete = (item) => {
  selectedItem.value = item;
  deleteDialog.value = true; // show the dialog
}

const deleteItem = () => {
  if (selectedItem.value) {
    deleteUserDetail(selectedItem.value._id);
  }
  deleteDialog.value = false; // close the dialog
}

// Fetch user data from API when component is mounted
const fetchUserData = async () => {
  try {
    // const response = await fetch(`http://localhost:4000/api/userDetail`);
    const response = await axios.get(`${baseUrl}/api/userDetail`)
    userData.value = response.data;

    // const data = await response.json();
    // userData.value = data;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

const submitUpdate = async () => {
  if (isValid.value) {
    try {
      const response = await axios.put(`${baseUrl}/api/userDetail/${formData.value._id}`, formData.value);
      if (response.status === 200) {
        alert('ធ្វើបច្ចុប្បន្នភាពជោគជ័យ');
        dialog.value = false; // Close the dialog
        fetchUserData(); return
      } else {
        alert('បច្ចុប្បន្នភាពមិនជោគជ័យ');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('ធ្វើបច្ចុប្បន្នភាពមានបញ្ហា');
    }
  }
};

// Delete user detail function
const deleteUserDetail = async (id: string) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/userDetail/${id}`);
    if (response.status === 200) {
      fetchUserData(); // Fetch updated user data after deletion.
    } else {
      alert('លុបជោគជ័យ');
    }
  } catch (error) {
    console.error('លុបមិនបញ្ហា:', error);
    // alert('Error deleting user');
  }
};

// Fetch data on component mount
onMounted(fetchUserData);

</script>
<route lang="yaml">
  meta:
    requiresAuth: true
  </route>


<style scoped>
.elevation-1 {
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
