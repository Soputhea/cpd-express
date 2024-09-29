<template>
  <v-container>
    <v-alert v-if="checkError" color="error">{{ msgError }}</v-alert> <br />
    <v-card prepend-icon="mdi-account" title="Create Users Infomation">
      <v-card-item>
        <v-form ref="searchForm" v-model="searchValid">
          <v-row>
            <v-col cols="8">
              <v-text-field label="Enter User ID" v-model="searchUserId" :rules="[rules.required]"
                @keyup.enter="searchUser" required />
            </v-col>
            <v-col cols="4">
              <v-btn color="primary" @click="searchUser">Search</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-item>
    </v-card>
    <br><br>
    <v-card>
      <v-card-item v-if="showForm">
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="User ID" v-model="formData.user_id" readonly />
              <!-- <v-text-field label="User ID" v-model="formData.user_id" /> -->
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Payroll ID" v-model="formData.payroll_id" required />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Name (Khmer)" v-model="formData.name_kh" required />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Name (English)" v-model="formData.name_en" required />
            </v-col>

            <v-col cols="12" md="6">
              <v-select label="Gender" v-model="formData.gender" :items="['Male', 'Female']" required />
            </v-col>

            <v-col cols="12" md="6">
              <div class="d-flex justify-center">
                <v-date-input v-model="formData.dob" label="Select a Date of Birth"></v-date-input>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div class="d-flex justify-center">
                <v-date-input v-model="formData.date_of_starting_work"
                  label="Select a Date of date_of_starting_work"></v-date-input>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Location (Khmer)" v-model="formData.location_kh" required />
            </v-col>

            <v-col cols="12" md="6">
              <v-select label="Location Type" v-model="formData.location_type" :items="['Urban', 'Rural']" required />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Province" v-model="formData.province" required />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Commune" v-model="formData.commune" required />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Current Position" v-model="formData.current_position" required />
            </v-col>

            <v-col cols="12" md="6">
              <div class="d-flex justify-center">
                <v-date-input v-model="formData.start_date" label="Select Position Start Date"></v-date-input>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Salary Level (Khmer)" v-model="formData.salary_level_kh" required />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Salary Degree" v-model="formData.salary_degree" required />
            </v-col>

            <v-col cols="12" md="6">
              <v-select label="Salary Type" v-model="formData.salary_type_shift_date"
                :items="['Monthly', 'Hourly', 'Daily']" required />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Highest Qualification" v-model="formData.highest_qualification" required />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Highest Qualification Subject" v-model="formData.highest_qualification_subject"
                required />
            </v-col>

            <v-col cols="12" md="6">
              <div class="d-flex justify-center">
                <v-date-input v-model="formData.highest_qualification_date"
                  label="Select Highest Qualification Date"></v-date-input>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Highest Professional" v-model="formData.highest_professional" required />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Professional" v-model="formData.professional" required />
            </v-col>

            <v-col cols="12">
              <v-btn color="primary" @click="submitForm">Submit</v-btn>
            </v-col>
          </v-row>
        </v-form>

      </v-card-item>
    </v-card>

  </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useDate } from 'vuetify'
import { VDateInput } from 'vuetify/labs/VDateInput'
const baseUrl = import.meta.env.VITE_API_URL;


const date = useDate()
const searchUserId = ref('')
const showForm = ref(false)
const checkError = ref(false);
const msgError = ref("");
const formatted = date.format('2010-04-13', 'fullDateWithWeekday')

const formData = ref({
  "user_id": "",
  "payroll_id": "",
  "name_kh": "",
  "name_en": "",
  "gender": "",
  "dob": "",
  "date_of_starting_work": "",
  "location_kh": "",
  "location_type": "",
  "province": "",
  "commune": "",
  "current_position": "",
  "start_date": "",
  "salary_level_kh": "",
  "salary_degree": "",
  "salary_type_shift_date": "",
  "highest_qualification": "",
  "highest_qualification_subject": "",
  "highest_qualification_date": "",
  "highest_professional": "",
  "professional": ""
}
);


const genderOptions = ['Male', 'Female']
const dobMenu = ref(false)
const dateOfStartingWorkMenu = ref(false)
const valid = ref(false)
const searchValid = ref(false)

const rules = {
  required: (value: string) => !!value || 'Required',
}

const searchUser = async () => {
  if (!searchValid.value) return;
  try {
    // const response = await axios.get(`${baseUrl}/api/users/${searchUserId.value}`)
    const response = await axios.get(`${baseUrl}/api/users/${searchUserId.value}`)
    // If user exists, populate formData and show the form
    if (response.data) {
      formData.value = response.data
      formData.value = {
        user_id: response.data.user_id,
        payroll_id: response.data.payroll_id,
        name_kh: response.data.name_kh,
        name_en: response.data.name_en,
        gender: response.data.gender,
        dob: response.data.dob,
        date_of_starting_work: response.data.date_of_starting_work,
        location_kh: response.data.location_kh,
        location_type: response.data.location_type,
        province: response.data.province,
        commune: response.data.commune,
        current_position: response.data.current_position,
        start_date: response.data.start_date,
        salary_level_kh: response.data.salary_level_kh,
        salary_degree: response.data.salary_degree,
        salary_type_shift_date: response.data.salary_type_shift_date,
        highest_qualification: response.data.highest_qualification,
        highest_qualification_subject: response.data.highest_qualification_subject,
        highest_qualification_date: response.data.highest_qualification_date,
        highest_professional: response.data.highest_professional,
        professional: response.data.professional
      };
      formData.value.user_id = searchUserId.value
      showForm.value = true
    } else {
      // If user doesn't exist, hide the form
      showForm.value = false
      formData.value.user_id = '';
      alert('User not found')
    }
  } catch (error) {
    console.error('Error searching user:', error)
    showForm.value = false
  }
}

const submitForm = async () => {
  checkError.value = false;
  msgError.value = "";
  if (valid.value) {
    try {
      const response = await axios.post(`${baseUrl}/api/userDetail`, formData.value)
      console.log('Form submitted successfully:', response.data)
      alert('Create user successfully')
      resetForm();
    } catch (error) {
      console.error('Error submitting the form:', error)
      checkError.value = true;
      msgError.value = error.response.data.error;
    }
  }
}

const resetForm = () => {
  searchUserId.value = "",
    formData.value = {
      "user_id": "",
      "payroll_id": "",
      "name_kh": "",
      "name_en": "",
      "gender": "",
      "dob": "",
      "date_of_starting_work": "",
      "location_kh": "",
      "location_type": "",
      "province": "",
      "commune": "",
      "current_position": "",
      "start_date": "",
      "salary_level_kh": "",
      "salary_degree": "",
      "salary_type_shift_date": "",
      "highest_qualification": "",
      "highest_qualification_subject": "",
      "highest_qualification_date": "",
      "highest_professional": "",
      "professional": ""
    }
}
</script>

<style scoped>
.v-text-field,
v-select,
v-menu {
  margin-bottom: 16px;
}

label {
  font-weight: bold;
  margin-bottom: 4px;
  display: inline-block;
}
</style>
