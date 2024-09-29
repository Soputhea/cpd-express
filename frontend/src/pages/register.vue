<template>
  <v-container max-width="500px">
    <v-form ref="form" v-model="valid">
      <v-card>
        <v-card-title primary-title>
          Register Account
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="formData.firstname" label="First Name" :rules="[rules.required]" required />
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="formData.lastname" label="Last Name" :rules="[rules.required]" required />
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="formData.email" label="Email" :rules="[rules.required, rules.email]" required />
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="formData.password" label="Password" type="password"
                :rules="[rules.required, rules.minLength, rules.password]" required />
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="formData.comfirmedPassword" label="Comfirm Password" type="password"
                :rules="[rules.required, rules.matchPassword]" required />
            </v-col>

          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="loading" color="primary" @click="register">
            <template v-if="!loading">Register</template>
            <template v-else>
              <v-progress-circular indeterminate size="20" color="white"></v-progress-circular>
            </template>
          </v-btn>
          <v-spacer />
          <v-btn :disabled="loading" to="/login">Already have an account?</v-btn>
        </v-card-actions>

        <v-alert v-if="checkError" color="error">{{ msgError }}</v-alert>
        <!-- <v-alert v-if="checkError" color="error"> {{ msgError }}</v-alert> -->
      </v-card>

    </v-form>
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
const msgError = ref("");

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
  required: (value) => !!value || 'Required.',
  email: (value) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
  // min: (minLength) => (value) => value.length >= minLength || `Min ${minLength} characters`,
  minLength: (value) => value.length >= 8 || 'Password must be at least 8 characters long.',
  matchPassword: (value) => value === formData.value.password || 'Passwords must match.'
};

// Validate form data

// Submit form
const register = async () => {
  if (!valid.value) return;
  loading.value = true;
  checkError.value = false;
  msgError.value = ""; // Reset error message before submission
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await axios.post(`${baseUrl}/api/auth/signup`, formData.value);
    if (response.status === 200 || response.status === 201) {
      checkError.value = false;
      router.push('/');
    }
    loading.value = false;
    checkError.value = true;
    // console.error(response.data.error);
  } catch (error) {
    console.error('Error during login:', error);
    checkError.value = true;
    msgError.value = error.response.data.error[0].msg;
    loading.value = false;
  }

};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
