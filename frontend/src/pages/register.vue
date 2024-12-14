<template>
  <v-container max-width="600px">
    <v-card>
      <v-card-title primary-title>
        បង្កើតគណនីថ្មី
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="formData.firstname" label="កោត្តនាម" :rules="[rules.required]" required />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field v-model="formData.lastname" label="នាមខ្លួន" :rules="[rules.required]" required />
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="formData.email" label="អ៊ីម៉ែល" :rules="[rules.required, rules.email]" required />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field v-model="formData.password" label="លេខសំងាត់" type="password"
                :rules="[rules.required, rules.minLength, rules.password]" required />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field v-model="formData.comfirmedPassword" label="បញ្ជាក់លេខសំងាត់" type="password"
                :rules="[rules.required, rules.matchPassword]" required />
            </v-col>

          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="loading" color="primary" @click="register" variant="outlined">
          <template v-if="!loading">បង្កើតគណនី</template>
          <template v-else>
            <v-progress-circular indeterminate size="20" color="white"></v-progress-circular>
          </template>
        </v-btn>
        <v-spacer />
        <v-btn :disabled="loading" to="/login">ត្រលប់ក្រោយ</v-btn>
      </v-card-actions>

      <!-- Success Dialog -->
      <v-dialog v-model="successDialog" max-width="400">
        <v-card class="mx-auto" title="បង្កើតគណនីជោគជ័យ">
          <template v-slot:append>
            <v-icon color="success" icon="mdi-check-circle"></v-icon>
          </template>
          <v-card-text>
            អ្នកបានបង្កើតគណនីជោគជ័យ. អ្នកអាចចូលប្រើប្រាស់ប្រព័ន្ធ.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="successDialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-alert v-if="checkError" type="error" dismissible>
        បញ្ហា: {{ errorMessage }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
const baseUrl = `${import.meta.env.VITE_API_URL}`;
import { useRouter } from 'vue-router';

const router = useRouter();

// Form validity state
const valid = ref(false);
const loading = ref(false);
const checkError = ref(false);
const errorMessage = ref('');
const successDialog = ref(false);

// Form data
const formData = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  comfirmedPassword: '',
  // role: '',
});

// Available roles
// const roles = ref(['user', 'MODERATOR', 'ADMIN']); // Replace with your role options

// Validation rules
const rules = {
  required: (value) => !!value || 'តម្រូវការ',
  email: (value) => /.+@.+\..+/.test(value) || 'អ៊ីម៉េលត្រឹមត្រូវ',
  // min: (minLength) => (value) => value.length >= minLength || `Min ${minLength} characters`,
  minLength: (value) => value.length >= 8 || 'លេខសំងាត់យ៉ាងតិច៨ខ្ទង់',
  matchPassword: (value) => value === formData.value.password || 'លេខសំងាត់ត្រូវដូចគ្នា'
};

// Validate form data

// Submit form
const register = async () => {
  if (!valid.value) return;
  loading.value = true;
  checkError.value = false;
  errorMessage.value = ''; // Reset error message before submission
  try {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await axios.post(`${baseUrl}/api/auth/signup`, formData.value);
    if (response.status === 200 || response.status === 201) {
      successDialog.value = true; // Show success dialog
    }
    // router.push('/');
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.error[0].msg || 'Registration failed.';
      console.log(error)
    } else {
      errorMessage.value = 'Network error or server is down.';
    }
    checkError.value = true;
  } finally {
    loading.value = false;
  }

  // Close the success dialog and redirect to login
  const closeSuccessDialog = () => {
    successDialog.value = false;
    router.push('/');
  };

};
</script>

<route lang="yaml">
  meta:
    layout: auth
  </route>
