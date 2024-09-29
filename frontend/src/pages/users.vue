<template>
  <v-container>
    <v-card color="primary">
      <v-card-title primary-title>
        <v-card-title class="d-flex align-center pe-2">
          <v-icon icon="mdi-account"></v-icon> &nbsp;
          List of users
          <v-spacer></v-spacer>
          <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
            variant="solo-filled" flat hide-details single-line></v-text-field>
        </v-card-title>
      </v-card-title>

      <v-data-table :items="userData" :headers="header" :search="search" class="elevation-1">
        <template v-slot:item.user_id="{ item }">
          <span>{{ item.user_id }}</span>
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

        <template v-slot:item.current_position="{ item }">
          <span>{{ item.current_position }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deleteUserDetail(item._id)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>

      <!-- User Update Form (Hidden until edit) -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>Edit User</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="isValid">
              <v-row>
                <v-col><v-text-field label="ID" v-model="formData._id" disabled /></v-col>
              <v-col><v-text-field label="User ID" v-model="formData.user_id" disabled /></v-col>
              </v-row>
              <v-text-field label="Payroll ID" v-model="formData.payroll_id" required />
              <v-text-field label="Name (Khmer)" v-model="formData.name_kh" required />
              <v-text-field label="Name (English)" v-model="formData.name_en" required />
              <v-select label="Gender" v-model="formData.gender" :items="['male', 'female']" required />
              <div class="d-flex justify-center">
                <v-date-input v-model="formData.dob" label="Select a Date of Birth"></v-date-input>
              </div>
              <div class="d-flex justify-center">
                <v-date-input v-model="formData.date_of_starting_work"
                  label="Select a Date of date_of_starting_work"></v-date-input>
              </div>
              <v-text-field label="Location (Khmer)" v-model="formData.location_kh" required />
              <v-select label="Location Type" v-model="formData.location_type" :items="['Urban', 'Rural']" required />
              <v-text-field label="Province" v-model="formData.province" required />
              <v-text-field label="Commune" v-model="formData.commune" required />
              <v-text-field label="Current Position" v-model="formData.current_position" required />
              <div class="d-flex justify-center">
                <v-date-input v-model="formData.start_date" label="Select Position Start Date"></v-date-input>
              </div>
              <v-text-field label="Salary Level (Khmer)" v-model="formData.salary_level_kh" required />
              <v-text-field label="Salary Degree" v-model="formData.salary_degree" required />
              <v-select label="Salary Type" v-model="formData.salary_type_shift_date"
                :items="['Monthly', 'Hourly', 'Daily']" required />
              <v-text-field label="Highest Qualification" v-model="formData.highest_qualification" required />
              <v-text-field label="Highest Qualification Subject" v-model="formData.highest_qualification_subject"
                required />
              <div class="d-flex justify-center">
                <v-date-input v-model="formData.highest_qualification_date"
                  label="Select Highest Qualification Date"></v-date-input>
              </div>
              <v-text-field label="Highest Professional" v-model="formData.highest_professional" required />
              <v-text-field label="Professional" v-model="formData.professional" required />
              <!-- Add more fields as required -->
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="submitUpdate">Save</v-btn>
            <v-btn @click="dialog = false">Cancel</v-btn>
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
const isValid = ref(false);
const search = ref('');
const header = ref([
  // { title: 'ID', value: '_id' },
  { title: 'UserId', value: 'user_id' },
  { title: 'Name KH', value: 'name_kh' },
  { title: 'Name EN', value: 'name_en' },
  { title: 'Gender', value: 'gender' },
  { title: 'Date of Birth', value: 'dob' },
  { title: 'Date of Starting Work', value: 'date_of_starting_work' },
  { title: 'Current Position', value: 'current_position' },
  { title: 'Actions', key: 'actions', sortable: false },
])

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}

// Function to open the edit form and populate it with the selected user's data
const editItem = (item) => {
  formData.value = { ...item }; // Clone the selected user's data into formData
  dialog.value = true; // Show the dialog with the form
};


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
        alert('User updated successfully');
        dialog.value = false; // Close the dialog
        fetchUserData(); return
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  }
};

// Delete user detail function
const deleteUserDetail = async (id: string) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/userDetail/${id}`);
    if (response.status === 200) {
      alert('User deleted successfully');
      fetchUserData(); // Fetch updated user data after deletion.
    } else {
      alert('Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('Error deleting user');
  }
};

// Fetch data on component mount
onMounted(fetchUserData);

</script>


<style scoped>
.elevation-1 {
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
